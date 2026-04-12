import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#d4af6a',
        charcoal: '#2c2c2c',
        cream: '#e8e4dc',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(220,38,38,.8)' },
          '60%': { opacity: '.82', boxShadow: '0 0 0 6px rgba(220,38,38,0)' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 1.5s infinite',
        'blink-fast': 'blink 1.4s infinite',
        slideUp: 'slideUp 0.22s ease',
        fadeDown: 'fadeDown 0.2s ease',
      },
      backgroundImage: {
        hatch: 'repeating-linear-gradient(45deg, #f0ede8, #f0ede8 4px, #e0dbd2 4px, #e0dbd2 8px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
