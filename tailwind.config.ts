import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: {
          light: "#353A56",
          dark: "#fff",
        },
        link: {
          light: "#6790E0",
          dark: "#B4CDFF",
        },
        card: {
          light: "#DADCEF",
          dark: "#fff",
        },
      },
    },
    borderRadius: {
      md: "4px",
    },
  },
  plugins: [],
};

export default config;
