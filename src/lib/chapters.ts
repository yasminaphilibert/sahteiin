/**
 * Chapter loader — the site's only content pipeline.
 *
 * One markdown file per chapter in src/content/chapters/; the frontmatter is
 * the manifest (order, slug, released flag, imagery) and the body is the prose.
 * Files in src/content/drafts/ are OUTSIDE this glob on purpose: a draft is
 * genuinely absent from the bundle, while a chapter with `released: false` is
 * merely unlisted — present, reachable by its unguessable slug, invisible in
 * the nav. Releasing a phase is flipping the flag and pushing.
 *
 * The frontmatter parser is ported from the portfolio's content.ts — scalars,
 * string arrays, and arrays of flat objects (comparisonPairs). Keep frontmatter
 * within those shapes.
 */
import { withBase } from "./utils";
import { isChapterOpen } from "@/content/project-state";
import type { Role } from "@/content/access";

const chapterFiles = import.meta.glob("/src/content/chapters/*.md", {
  as: "raw",
  eager: true,
});

/** A single pair for the comparison slider — same subject, resolved twice. */
export interface ComparisonPair {
  label: string;
  left: string;
  right: string;
}

export interface ChapterContent {
  order: number;
  slug: string;
  title: string;
  /** Arabic counterpart of the title, set at equal weight beside it. */
  titleArabic?: string;
  kicker: string;
  phase: string;
  released: boolean;
  /** Flavour colour that stands for this chapter in the spectrum nav. */
  color: string;
  heroImage?: string;
  heroAlt?: string;
  location?: string;
  year?: string;
  tags?: string[];
  keywords?: string[];
  tools?: string[];
  /** A short caveat rendered under the metadata, e.g. that imagery is concept work. */
  note?: string;
  galleryImages?: string[];
  comparisonPairs?: ComparisonPair[];
  /** Caption line above the comparison set. */
  compareLabel?: string;
  compareNote?: string;
  showTimeline?: boolean;
  showPricing?: boolean;
  /** Chapter 06: the two website quote cards. */
  showWebsiteQuotes?: boolean;
  /** Colophon: fee, week range and what the phase closes with. */
  fee?: string;
  weeks?: string;
  closesWith?: string[];
  /** Body paragraphs, in order. A lone `---` line starts a new prose group. */
  description: string[][];
}

function cleanValue(raw: string): string | number | boolean {
  const v = raw.replace(/^["']|["']$/g, "").trim();
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^\d+$/.test(v)) return parseInt(v, 10);
  return v;
}

function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  // Normalise line endings before anything else. `\r` is a line terminator to
  // JS regex, so on a CRLF checkout `(.*)$` stops short of it and every
  // top-level scalar — slug, title, order — parses as null while indented
  // array items still come through (they get .trim()ed). The symptom is a
  // chapter that silently 404s with its gallery intact. Git on Windows
  // converts to CRLF by default, so this is the state of a fresh clone here,
  // not an exotic edge case.
  const content = raw.replace(/\r\n?/g, "\n");
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { data: {}, content: content.trim() };

  const data: Record<string, unknown> = {};
  let currentKey = "";
  let inArray = false;
  let arrayValues: string[] = [];
  let inObjectArray = false;
  let objectArrayValues: Record<string, unknown>[] = [];
  let currentObject: Record<string, unknown> = {};

  const lines = match[1].split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;

    const indent = line.match(/^(\s*)/)?.[1].length || 0;
    const isArrayItem = /^\s+-\s+/.test(line);
    const isTopLevel = indent === 0;

    if (isTopLevel && currentKey) {
      if (inObjectArray) {
        if (Object.keys(currentObject).length > 0) {
          objectArrayValues.push(currentObject);
          currentObject = {};
        }
        if (objectArrayValues.length > 0) {
          data[currentKey] = objectArrayValues;
          objectArrayValues = [];
          inObjectArray = false;
        }
      } else if (inArray && arrayValues.length > 0) {
        data[currentKey] = arrayValues;
        arrayValues = [];
        inArray = false;
      }
    }

    if (isArrayItem) {
      if (inObjectArray && Object.keys(currentObject).length > 0) {
        objectArrayValues.push(currentObject);
        currentObject = {};
      }
      const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
      const isObjectItem =
        (nextLine && /^\s{4,}/.test(nextLine)) ||
        /^\s+-\s+[a-zA-Z_]+:\s*/.test(line);

      if (isObjectItem) {
        inObjectArray = true;
        inArray = false;
        const inline = line.match(/^\s+-\s+([a-zA-Z_]+):\s*(.*)$/);
        if (inline) currentObject[inline[1]] = cleanValue(inline[2]);
        continue;
      }
      arrayValues.push(
        line.replace(/^\s+-\s+/, "").replace(/^["']|["']$/g, "").trim()
      );
      inArray = true;
      continue;
    }

    if (inObjectArray && indent >= 4) {
      const kv = line.match(/^\s+([a-zA-Z_]+):\s*(.*)$/);
      if (kv) currentObject[kv[1]] = cleanValue(kv[2]);
      continue;
    }

    if (isTopLevel) {
      const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
      if (kv) {
        if (
          inObjectArray &&
          currentKey &&
          Object.keys(currentObject).length > 0
        ) {
          objectArrayValues.push(currentObject);
          currentObject = {};
        }
        currentKey = kv[1];
        if (kv[2] === "") {
          inArray = false;
          inObjectArray = false;
          arrayValues = [];
          objectArrayValues = [];
        } else {
          data[kv[1]] = cleanValue(kv[2]);
          inArray = false;
          inObjectArray = false;
        }
      }
    }
  }

  if (inObjectArray && currentKey) {
    if (Object.keys(currentObject).length > 0)
      objectArrayValues.push(currentObject);
    if (objectArrayValues.length > 0) data[currentKey] = objectArrayValues;
  }
  if (inArray && currentKey && arrayValues.length > 0)
    data[currentKey] = arrayValues;

  return { data, content: match[2].trim() };
}

/** Body -> groups of paragraphs. A lone `---` line starts a new group. */
function parseBody(body: string): string[][] {
  const groups: string[][] = [];
  let current: string[] = [];
  for (const block of body.split(/\n\s*\n/)) {
    const text = block.trim();
    if (!text) continue;
    if (text === "---") {
      if (current.length) groups.push(current);
      current = [];
      continue;
    }
    current.push(text.replace(/\s*\n\s*/g, " "));
  }
  if (current.length) groups.push(current);
  return groups;
}

function normalizePair(pair: ComparisonPair): ComparisonPair {
  return { ...pair, left: withBase(pair.left), right: withBase(pair.right) };
}

let cache: ChapterContent[] | null = null;

export function loadChapters(): ChapterContent[] {
  if (cache) return cache;
  const chapters: ChapterContent[] = [];
  for (const raw of Object.values(chapterFiles)) {
    const { data, content } = parseFrontmatter(raw as string);
    chapters.push({
      order: (data.order as number) ?? 0,
      slug: (data.slug as string) ?? "",
      title: (data.title as string) ?? "",
      titleArabic: data.titleArabic as string | undefined,
      kicker: (data.kicker as string) ?? "",
      phase: (data.phase as string) ?? "",
      released: data.released === true,
      color: (data.color as string) ?? "#F4F0F7",
      heroImage: data.heroImage ? withBase(data.heroImage as string) : undefined,
      heroAlt: data.heroAlt as string | undefined,
      location: data.location as string | undefined,
      year: String(data.year ?? ""),
      tags: (data.tags as string[]) ?? [],
      keywords: (data.keywords as string[]) ?? [],
      tools: (data.tools as string[]) ?? [],
      note: data.note as string | undefined,
      galleryImages: ((data.galleryImages as string[]) ?? []).map(withBase),
      comparisonPairs: ((data.comparisonPairs as ComparisonPair[]) ?? []).map(
        normalizePair
      ),
      compareLabel: data.compareLabel as string | undefined,
      compareNote: data.compareNote as string | undefined,
      showTimeline: data.showTimeline === true,
      showPricing: data.showPricing === true,
      showWebsiteQuotes: data.showWebsiteQuotes === true,
      fee: data.fee as string | undefined,
      weeks: data.weeks as string | undefined,
      closesWith: (data.closesWith as string[]) ?? [],
      description: parseBody(content),
    });
  }
  chapters.sort((a, b) => a.order - b.order);
  cache = chapters;
  return chapters;
}

export function getChapterBySlug(slug: string): ChapterContent | undefined {
  return loadChapters().find((c) => c.slug === slug);
}

/** Prev/next chain runs over RELEASED chapters only — an unlisted chapter is
 *  reachable by its link but never advertised by its neighbours. */
export function getReleasedChapters(): ChapterContent[] {
  return loadChapters().filter((c) => c.released);
}

/**
 * Two gates, and both must pass. `released` is the hard switch in the
 * chapter's own frontmatter — a chapter can be withheld regardless of how the
 * project is going. `openChapters` in project-state is the soft one that the
 * engagement moves: a phase is delivered, its chapter opens.
 */
export function isOpen(chapter: ChapterContent): boolean {
  return chapter.released && isChapterOpen(chapter.order);
}

export function getOpenChapters(): ChapterContent[] {
  return loadChapters().filter(isOpen);
}

/**
 * What a given account may open. Owners see every released chapter whatever
 * the project state says — they are the ones deciding when a phase is ready,
 * so they have to be able to read it first. The client sees only what has
 * actually been handed over.
 */
export function isVisibleTo(chapter: ChapterContent, role: Role | null): boolean {
  if (!chapter.released) return false;
  if (role === "owner") return true;
  return isChapterOpen(chapter.order);
}

export function getVisibleChapters(role: Role | null): ChapterContent[] {
  return loadChapters().filter((c) => isVisibleTo(c, role));
}
