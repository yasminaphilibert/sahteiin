import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "@/lib/auth";
import Wordmark from "@/components/Wordmark";
import SpectrumStrip from "@/components/SpectrumStrip";
import ClinkMark from "@/components/ClinkMark";

/**
 * The front door.
 *
 * No password: the address is the credential. That is weak on purpose — the
 * people using this are two designers and one client on WhatsApp, and a
 * password they have to store somewhere would be lost by the second phase.
 * See src/content/access.ts for what this does and does not protect.
 */
const SignIn = ({ onSignedIn }: { onSignedIn: () => void }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const session = await signIn(email);
    setBusy(false);
    if (session) {
      onSignedIn();
    } else {
      setError(
        "That address is not on the list for this project. If you think it should be, reply to the message you got this link in."
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex items-center gap-3">
          <ClinkMark className="h-6 w-6 text-amber" />
          <span className="label">Private project</span>
        </div>

        <Wordmark className="text-[clamp(2.4rem,9vw,3.6rem)]" />
        <p className="arabic mt-3 text-2xl text-bone-2" lang="ar">
          صحتين
        </p>

        <SpectrumStrip className="my-8" />

        <p className="body-copy mb-8 text-[15px]">
          This proposal is shared with a few people. Enter the email address it
          was sent to and it will open.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/15 bg-plum-2 px-4 py-3.5 text-[15px] text-bone outline-none transition-colors placeholder:text-bone-3 focus:border-amber/60"
          />

          {error && (
            <p role="alert" className="text-[13px] leading-relaxed text-amber">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 rounded-full bg-amber px-7 py-3.5 font-mono text-[13px] uppercase tracking-[0.18em] text-plum transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Checking…" : "Open the project →"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignIn;
