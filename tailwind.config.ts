import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: {
          light: "#282828",
          dark: "#171717",
        },
        surface: "#F3F4F8",
        border: "#EBEBEB",
      },
    },
  },
  plugins: [],
};

export default config;
