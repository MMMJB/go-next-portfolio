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
      keyframes: {
        jump: {
          "0%, 100%": { transform: "translateY(0) scaleX(1) scaleY(1)" },
          "50%": { transform: "translateY(-10%) scaleX(.9) scaleY(1.1)" },
        },
        jiggle: {
          "0%, 100%": { transform: "scale(1, 1)" },
          "25%": { transform: "scale(0.9, 1.1)" },
          "50%": { transform: "scale(1.1, 0.9)" },
          "75%": { transform: "scale(0.95, 1.05)" },
        },
        "spin-slow": {
          "100%": { transform: "rotate(90deg)" },
        },
      },
      animation: {
        jump: "jump .5s ease-in-out forwards",
        "spin-slow": "spin-slow .5s ease-in-out forwards",
        jiggle: "jiggle 1s forwards",
      },
    },
    borderRadius: {
      md: "4px",
    },
  },
  plugins: [],
};

export default config;
