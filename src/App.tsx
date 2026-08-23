import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Chapter from "@/pages/Chapter";
import NotFound from "@/pages/NotFound";

/**
 * basename comes from Vite's base ("/sahteiin/") so dev, preview and GitHub
 * Pages all agree. Deep links on Pages survive via the 404.html copy of
 * index.html — see .github/workflows/deploy.yml.
 */
const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/c/:slug" element={<Chapter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
