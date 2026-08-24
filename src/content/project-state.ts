/**
 * The project's state — the one file Yasmina edits to move the engagement on.
 *
 * The site is static, so there is no database and no login: what the client
 * sees is whatever was committed and deployed. That is a feature here, not a
 * shortcut — the state of the job is a thing the two of you agree on out loud,
 * and this file is the written record of that agreement. Change a status,
 * push, and the tracker, the locks and the payment panel all follow.
 *
 * Money lives here too. Every price on the site reads from this file so that
 * the devis, the price page and the website quotes can never quietly disagree
 * with each other — the failure mode that makes a client stop trusting a
 * document.
 */

export type Stage = "proposal-sent" | "accepted" | "in-progress" | "delivered";

/** Where a phase stands. `locked` means its chapter is not open yet. */
export type PhaseStatus =
  | "locked"
  | "current"
  | "in-review"
  | "delivered"
  | "approved";

export type PaymentStatus = "due" | "paid" | "scheduled";

export interface Phase {
  n: number;
  /** Chapter `order` this phase's work is shown in, once it opens. */
  chapter: number;
  name: string;
  fee: number;
  weeks: string;
  status: PhaseStatus;
  /** What the phase closes with — mirrors the chapter's own colophon. */
  deliverables: string[];
}

export interface Payment {
  label: string;
  pct: number;
  amount: number;
  due: string;
  status: PaymentStatus;
}

export const PROJECT = {
  reference: "SAH-2026-01",
  issued: "2026-08-23",
  validDays: 30,

  from: {
    name: "Yasmina Philibert",
    role: "Brand & packaging design",
    location: "Beirut, Lebanon",
    // Published deliberately: a quote the client cannot reply to is not a
    // quote. This is the address acceptance comes back to.
    email: "yasminaphilibert@gmail.com",
  },
  client: {
    name: "ElectroNytes",
    attn: "Tino Karam",
    project: "Rebrand — naming, identity, packaging, launch",
    location: "Beirut, Lebanon",
  },

  stage: "proposal-sent" as Stage,

  currency: "USD",
  total: 6500,

  phases: [
    {
      n: 1,
      chapter: 1,
      name: "Foundations",
      fee: 1400,
      weeks: "Weeks 1 – 1.5",
      status: "locked" as PhaseStatus,
      deliverables: [
        "Kickoff session and a one-page creative brief",
        "Positioning — who it is for, why they pick it up",
        "Naming shortlist checked in Arabic, French and English, down to one name together",
      ],
    },
    {
      n: 2,
      chapter: 2,
      name: "Identity",
      fee: 1900,
      weeks: "Weeks 1.5 – 3",
      status: "locked" as PhaseStatus,
      deliverables: [
        "Logo with a matching Arabic lockup",
        "Colour system built for a seven-flavour shelf",
        "Typography licensed for print and web",
        "Full logo file suite, every format",
      ],
    },
    {
      n: 3,
      chapter: 3,
      name: "Packaging",
      fee: 2100,
      weeks: "Weeks 3 – 5",
      status: "locked" as PhaseStatus,
      deliverables: [
        "All seven stick designs and the multipack box",
        "Bilingual labels with the legal panel laid out",
        "Print-ready dielines your printer can run",
        "3D mockups for retailers and investors",
      ],
    },
    {
      n: 4,
      chapter: 4,
      name: "Launch kit",
      fee: 1100,
      weeks: "Weeks 5 – 6",
      status: "locked" as PhaseStatus,
      deliverables: [
        "Mini brand guidelines, around twelve pages",
        "Social templates for the launch",
        "Shot list for your first photography",
        "Organised handover of every working file",
      ],
    },
  ] as Phase[],

  payments: [
    {
      label: "Deposit",
      pct: 50,
      amount: 3250,
      due: "On acceptance",
      status: "due" as PaymentStatus,
    },
    {
      label: "Balance",
      pct: 50,
      amount: 3250,
      due: "On delivery, week 6",
      status: "scheduled" as PaymentStatus,
    },
  ] as Payment[],

  /** Quoted separately, deliberately outside the total. */
  addOns: [
    { name: "The brand site", fee: 1600, weeks: "2 weeks" },
    { name: "The shop", fee: 3000, weeks: "3 weeks" },
  ],

  /**
   * Chapter `order`s the client can open, beyond the intro and the devis.
   * Empty for the first send: the intro sells it, the devis prices it, and
   * each chapter opens as its phase is paid and delivered.
   */
  openChapters: [] as number[],
};

const STAGE_COPY: Record<Stage, { label: string; line: string }> = {
  "proposal-sent": {
    label: "Proposal sent",
    line: "The devis is with you. Nothing starts until you accept it.",
  },
  accepted: {
    label: "Accepted",
    line: "Signed and the deposit is in. Phase 1 starts Monday.",
  },
  "in-progress": {
    label: "In progress",
    line: "Work is underway. Each phase opens here as it is delivered.",
  },
  delivered: {
    label: "Delivered",
    line: "Every phase is closed and the files are handed over.",
  },
};

export const stageCopy = () => STAGE_COPY[PROJECT.stage];

/** "$6,500" — one formatter so no price is typed by hand anywhere. */
export const money = (n: number) =>
  `$${n.toLocaleString("en-US")}`;

export const validUntil = () => {
  const d = new Date(PROJECT.issued);
  d.setDate(d.getDate() + PROJECT.validDays);
  return d.toISOString().slice(0, 10);
};

/** The intro and the devis are always reachable; chapters are opened by hand. */
export const isChapterOpen = (order: number) =>
  PROJECT.openChapters.includes(order);

export const phaseForChapter = (order: number) =>
  PROJECT.phases.find((p) => p.chapter === order);

/** Phases are numbered; the intro, price page and website chapter are not. */
export const phaseCount = PROJECT.phases.length;
