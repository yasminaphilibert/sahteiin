import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { currentSession, signOut as clearSession, type Session } from "@/lib/auth";
import type { Role } from "@/content/access";

interface Ctx {
  session: Session | null;
  role: Role | null;
  refresh: () => void;
  signOut: () => void;
}

const SessionContext = createContext<Ctx>({
  session: null,
  role: null,
  refresh: () => {},
  signOut: () => {},
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(() => currentSession());

  const refresh = useCallback(() => setSession(currentSession()), []);
  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, role: session?.role ?? null, refresh, signOut }),
    [session, refresh, signOut]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
