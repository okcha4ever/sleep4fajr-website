import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f4efe3",
        foreground: "#152018",
        card: "#fbf7ef",
        accent: "#22543d",
        accentSoft: "#d8ead8",
        border: "#d5cbb7",
        muted: "#677465",
        sunrise: "#f2a65a",
      },
      boxShadow: {
        panel: "0 18px 50px rgba(17, 24, 39, 0.12)",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
