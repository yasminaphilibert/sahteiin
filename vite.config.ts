import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Project-page repo: served at yasminaphilibert.github.io/sahteiin/, so every
// asset URL and the router basename hang off this base. The three must agree —
// see BrowserRouter in main.tsx and withBase() in lib/utils.ts.
export default defineConfig({
  base: "/sahteiin/",
  plugins: [react()],
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
