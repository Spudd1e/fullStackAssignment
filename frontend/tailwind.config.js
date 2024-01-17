/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,vue}", "./src/App.vue"],
  theme: {
    extend: {
      keyframes: {
        slide: {
          "0%": { transform: "translateY(-100%)" },
        },
      },
      animation: {
        slide: "slide 0.5s ease",
      },
    },
  },
  plugins: [],
};
