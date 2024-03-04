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
          "100%": { transform: "rotate(180deg)" },
        },
        wave: {
          "0%, 60%, 100%": { transform: "rotate(0deg)" },
          "10%, 30%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10deg)" },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
          "50%": {
            transform: "translateY(-10%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
        },
      },
      animation: {
        jump: "jump .5s ease-in-out forwards 2",
        "spin-slow": "spin-slow 1s ease-in-out forwards",
        jiggle: "jiggle 1s forwards",
        wave: "wave 2.5s forwards infinite",
        bounce: "bounce .5s forwards cubic-bezier(0, 0, 0.2, 1) 2",
      },
    },
  },
  plugins: [],
};

export default config;
