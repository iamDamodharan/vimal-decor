/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#252923",
        paper: "#f8f7f4",
        accent: "#60745d"
      }
    }
  },
  plugins: []
};
