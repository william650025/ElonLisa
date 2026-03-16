/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'muji-white': '#F5F0EB',
        'muji-cream': '#EDE8E1',
        'muji-charcoal': '#3C3C3C',
        'muji-linen': '#B8B0A8',
        'muji-red': '#C53D43',
        'muji-border': '#D8D2CA',
        'muji-text': '#2C2C2C',
        'muji-text-light': '#7A7A7A',
      },
    },
  },
  plugins: [],
}
