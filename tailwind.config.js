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
        deepNavy: '#0D0F1A',
        navy: '#161A30',
        purple: '#31304D',
        gray: '#B6BBC4',
        offWhite: '#F0ECE5',
        darkPurple: '#2A2943'
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
