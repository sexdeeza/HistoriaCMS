/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        royal: {
          pink: '#F8A5C2',
          rose: '#E84393',
          blue: '#74B9FF',
          sky: '#81ECEC',
          green: '#55EFC4',
          mint: '#A3E4D7',
          purple: '#A29BFE',
          cream: '#FFF5F5',
          peach: '#FFEAA7',
          dark: '#2D3436',
          darker: '#1E272E',
        }
      },
      fontFamily: {
        royal: ['Arial Rounded MT Bold', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #F8A5C2 0%, #FDA7DF 50%, #A29BFE 100%)',
        'royal-gradient-dark': 'linear-gradient(135deg, #2D3436 0%, #1E272E 100%)',
      },
      boxShadow: {
        'royal': '0 4px 14px 0 rgba(248, 165, 194, 0.4)',
        'royal-dark': '0 4px 14px 0 rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
