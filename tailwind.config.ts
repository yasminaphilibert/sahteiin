import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Masterbrand — night is the brand's home ground.
        plum: "#15101A", // ground
        "plum-2": "#1E1826", // card surface
        "plum-3": "#26202F", // raised surface
        bone: "#F4F0F7", // primary type
        "bone-2": "#B7ADC3", // secondary type
        "bone-3": "#877D95", // tertiary type
        amber: "#F5B44C", // the rim light
        // Flavour range — product only, never the masterbrand.
        hugo: "#4FBE8F",
        rita: "#A8CE2E",
        limon: "#F2C230",
        paloma: "#F4713C",
        hula: "#2E9BD6",
        bramble: "#7B3FA0",
        nogroni: "#B01E3C",
      },
      fontFamily: {
        display: ["Unbounded", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Archivo", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        arabic: ["'Noto Naskh Arabic'", "'Segoe UI'", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
