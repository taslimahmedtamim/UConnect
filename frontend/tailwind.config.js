/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6ea8fe',
          strong: '#3b82f6',
        },
        accent: '#22d3ee',
      },
    },
  },
  plugins: [],
}


