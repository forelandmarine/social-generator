import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg0: "#040D1A",
        bg1: "#081630",
        bg2: "#0C1E42",
        accent: "#5386B6",
        muted: "#7BA8C8",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "Aptos", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
