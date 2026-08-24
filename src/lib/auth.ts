import { ACCOUNTS, type Role } from "@/content/access";

const KEY = "sahteiin.session";

export interface Session {
  role: Role;
  label: string;
  /** Kept only so the header can show who is signed in. */
  email: string;
}

/**
 * SHA-256 via Web Crypto, which needs a secure context — https or localhost.
 * Both of ours qualify (GitHub Pages forces https), so no fallback is
 * shipped: a silent non-crypto fallback would be worse than a clear failure.
 */
async function sha256(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Returns the session on a match, or null. Never says which part was wrong. */
export async function signIn(email: string): Promise<Session | null> {
  if (!email.trim()) return null;
  const hash = await sha256(email);
  const account = ACCOUNTS.find((a) => a.hash === hash);
  if (!account) return null;

  const session: Session = {
    role: account.role,
    label: account.label,
    email: email.trim().toLowerCase(),
  };
  // localStorage, not sessionStorage: the client will open this link from
  // WhatsApp on a phone, close it, and come back days later when a phase
  // lands. Asking for the address again every visit reads as broken.
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* private browsing — they stay signed in for this tab only */
  }
  return session;
}

export function currentSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    // Re-validate against the allowlist on every read, so revoking someone is
    // just deleting their line here and pushing — their stored session dies
    // with it rather than outliving their access.
    return ACCOUNTS.some((a) => a.role === s.role && a.label === s.label)
      ? s
      : null;
  } catch {
    return null;
  }
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}
