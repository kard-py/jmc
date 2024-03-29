/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "jmc-blue": "#009999",
        cinza: "#9a9a9a",
        info: "#525252",
        login: "#fafafa",
        loginCard: "#4f4f4f",
      },
      spacing: {
        128: "32rem",
        192: "32rem",
        256: "64rem",
        512: "128rem",
      },

      keyframes: {
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      keyframes: {
        fadeInSlide: {
          "0%": { opacity: 0, transform: "translateY(5%)" },
          "100%": { opacity: 1, trasnform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
