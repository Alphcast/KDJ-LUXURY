/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
        'gold-light': '#E8D5A0',
        'gold-dark': '#8B6914',
        black: '#0A0A0A',
        'off-white': '#F8F5F0',
        'warm-gray': '#E8E3DC',
        'mid-gray': '#9A9490',
        'text-dark': '#1A1A1A',
        'text-mid': '#5A5550',
        accent: '#2C1810',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}