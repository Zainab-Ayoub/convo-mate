/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#161A30',
        purple: '#31304D',
        gray: '#B6BBC4',
        offWhite: '#F0ECE5',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
