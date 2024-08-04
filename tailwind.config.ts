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
      borderRadius: {
        "4xl": "2.5rem",
        "5xl": "4rem",
      },
      boxShadow: {
        "project-light": "0px 32px 64px rgba(0, 0, 0, .05)",
        "project-light-expanded": "0px 64px 128px rgba(0, 0, 0, .05)",
        "project-dark": "0px 32px 64px rgba(0, 0, 0, .2)",
        "project-dark-expanded": "0px 64px 128px rgba(0, 0, 0, .2)",
      },
      keyframes: {
        "slide-up": {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "slide-up": "slide-up 500ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
