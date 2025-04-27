/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003366',
          light: '#004080',
          dark: '#002040',
        },
        secondary: {
          DEFAULT: '#009933',
          light: '#00b33c',
          dark: '#00802b',
        },
        silver: {
          DEFAULT: '#C0C0C0',
          light: '#d9d9d9',
          dark: '#a6a6a6',
        },
        status: {
          verified: '#009933',
          tampered: '#cc3300',
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
};