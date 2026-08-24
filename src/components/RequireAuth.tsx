import { useSession } from "@/lib/session-context";
import SignIn from "@/pages/SignIn";

/**
 * Every project page sits behind this. Rather than redirecting to a /signin
 * route, the sign-in form replaces the page in place — so the URL the client
 * was sent survives the sign-in and they land exactly where the link pointed
 * instead of being dumped on the intro.
 */
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { session, refresh } = useSession();
  if (!session) return <SignIn onSignedIn={refresh} />;
  return <>{children}</>;
};

export default RequireAuth;
