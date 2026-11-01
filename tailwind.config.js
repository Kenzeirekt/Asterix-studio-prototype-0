/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'studio-bg': '#1e1e1e',
        'studio-panel': '#252526',
        'studio-accent': '#007acc',
        'studio-border': '#3c3c3c',
      },
    },
  },
  plugins: [],
}
