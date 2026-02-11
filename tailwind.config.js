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
				background: "rgb(var(--background) / <alpha-value>)",
				surface: {
					DEFAULT: "rgb(var(--surface) / <alpha-value>)",
					hover: "rgb(var(--surface-hover) / <alpha-value>)",
				},
				primary: {
					DEFAULT: "rgb(var(--primary) / <alpha-value>)",
					foreground: "#FFFFFF",
				},
				secondary: "rgb(var(--secondary) / <alpha-value>)",
				border: "rgb(var(--border) / <alpha-value>)",
				input: "rgb(var(--input) / <alpha-value>)",

				text: {
					main: "rgb(var(--text-main) / <alpha-value>)",
					secondary: "rgb(var(--text-secondary) / <alpha-value>)",
				},

				status: {
					error: "rgb(var(--status-error) / <alpha-value>)",
					warning: "rgb(var(--status-warning) / <alpha-value>)",
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/container-queries"),
	],
	presets: [require("@mantine/core/styles.css")],
};
