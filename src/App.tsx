import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import RequireAuth from "@/components/RequireAuth";
import { SessionProvider } from "@/lib/session-context";
import Intro from "@/pages/Intro";
import Devis from "@/pages/Devis";
import Chapter from "@/pages/Chapter";
import NotFound from "@/pages/NotFound";

/**
 * basename comes from Vite's base ("/sahteiin/") so dev, preview and GitHub
 * Pages all agree. Deep links on Pages survive via the 404.html copy of
 * index.html — see .github/workflows/deploy.yml.
 *
 * Every project route is wrapped in RequireAuth. NotFound is deliberately
 * left open: a wrong URL should say "wrong URL", not demand an email first.
 */
const App = () => (
  <SessionProvider>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Intro />
            </RequireAuth>
          }
        />
        <Route
          path="/devis"
          element={
            <RequireAuth>
              <Devis />
            </RequireAuth>
          }
        />
        <Route
          path="/c/:slug"
          element={
            <RequireAuth>
              <Chapter />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </SessionProvider>
);

export default App;
