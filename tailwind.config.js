/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        background: "rgb(var(--background))",
        surface: {
          DEFAULT: "rgb(var(--surface))",
          hover: "rgb(var(--surface-hover))",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "#FFFFFF",
        },
        secondary: "rgb(var(--secondary))",
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",

        text: {
          main: "rgb(var(--text-main))",
          secondary: "rgb(var(--text-secondary))",
        },

        status: {
          error: "rgb(var(--status-error))",
          warning: "rgb(var(--status-warning))",
          success: "rgb(var(--status-success))",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
};
