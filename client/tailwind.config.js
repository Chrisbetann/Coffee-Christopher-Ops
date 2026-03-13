/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          brown:  '#6B3F1E',
          tan:    '#C9A96E',
          cream:  '#F5EFE6',
          dark:   '#1A0F08',
        },
      },
    },
  },
  plugins: [],
};
