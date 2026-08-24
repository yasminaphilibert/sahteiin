/**
 * Who can open what.
 *
 * ── Read this before trusting it ──────────────────────────────────────────
 * This is a FRONT DOOR, not a lock. The site is static and the repo is
 * public, so the whole bundle — every chapter's prose and every image URL —
 * is on the client's machine the moment the page loads, and on github.com
 * before that. Anyone willing to open devtools is past this in under a
 * minute. It exists to stop a forwarded link being casually browsed and to
 * make the phase-by-phase reveal feel deliberate, and it does that job well.
 *
 * If a phase genuinely must not be readable early, the mechanism that
 * actually works is to keep it out of the build: move its markdown to
 * src/content/drafts/ (outside the content glob) and hold its images back
 * until release. Absence is the only real secret a static site can keep.
 *
 * ── Why hashes ────────────────────────────────────────────────────────────
 * Addresses are stored as SHA-256 of the lowercased, trimmed email so this
 * public repo does not publish three people's inboxes to scrapers. It does
 * not harden the gate — an address is guessable — it just avoids leaking
 * personal data as a side effect of shipping the site.
 */

export type Role = "owner" | "client";

interface Account {
  /** sha256(email.trim().toLowerCase()) */
  hash: string;
  role: Role;
  /** Shown after sign-in so someone can tell they are on the right account. */
  label: string;
}

export const ACCOUNTS: Account[] = [
  {
    // christian.j.dimitrii@gmail.com
    hash: "dcc767ccde633c983aee69d4eea4bfb8b9ab48b4d029ff35be029cc364a525a8",
    role: "owner",
    label: "Christian",
  },
  {
    // yasminaphilibert@gmail.com
    hash: "c0c507de5c744a1717e6bd7ea34b89d9eae367ea8342a96dd3b1b41b7a65da35",
    role: "owner",
    label: "Yasmina",
  },
  // ── CLIENT ────────────────────────────────────────────────────────────────
  // Add the client's address here before sending the link. Generate with:
  //   node -e "console.log(require('crypto').createHash('sha256')
  //     .update('THEIR@EMAIL.COM'.trim().toLowerCase()).digest('hex'))"
  // Until this is filled in the client cannot sign in at all.
  //
  // {
  //   hash: "…",
  //   role: "client",
  //   label: "ElectroNytes",
  // },
];

/**
 * Owners see everything, including phases not yet released to the client —
 * that is the point of the two-role split: Yasmina needs to check a chapter
 * reads correctly before the client is told it exists.
 */
export const canSeeLockedChapters = (role: Role | null) => role === "owner";

/** Any signed-in account may open the intro, the devis and open chapters. */
export const canSeeProject = (role: Role | null) => role !== null;
