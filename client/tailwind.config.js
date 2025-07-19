/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#6D5DF6',
          dark: '#4F46E5',
          light: '#8B5CF6',
          accent: '#3B82F6',
        },
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
};
