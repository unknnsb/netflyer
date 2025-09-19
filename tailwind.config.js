import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black': '#1C1C1E'
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      addCommonColors: true,
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            background: "#111827",
          },
        },
      },
    }),
  ],
};
