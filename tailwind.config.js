/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      gridTemplateRows: {
        "max-2": "repeat(2, max-content)",
        "max-3": "repeat(3, max-content)",
        "max-4": "repeat(4, max-content)",
        "max-5": "repeat(5, max-content)",
        "max-6": "repeat(6, max-content)",
        "max-7": "repeat(7, max-content)",
        "max-8": "repeat(8, max-content)",
        "max-9": "repeat(9, max-content)",
        "max-10": "repeat(10, max-content)",
        "max-11": "repeat(11, max-content)",
        "max-12": "repeat(12, max-content)",
      },
      gridTemplateColumns: {
        "max-2": "repeat(2, max-content)",
        "max-3": "repeat(3, max-content)",
        "max-4": "repeat(4, max-content)",
        "max-5": "repeat(5, max-content)",
        "max-6": "repeat(6, max-content)",
        "max-7": "repeat(7, max-content)",
        "max-8": "repeat(8, max-content)",
        "max-9": "repeat(9, max-content)",
        "max-10": "repeat(10, max-content)",
        "max-11": "repeat(11, max-content)",
        "max-12": "repeat(12, max-content)",
      },
    },
  },
  plugins: [],
};
