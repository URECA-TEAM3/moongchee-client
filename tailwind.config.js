/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        white: '#ffffff',
        primary: '#2589E7',
        secondary: '#FFC73A',
        lightblue: '#5FB0FC',
        paleblue: '#F5FAFF',
        text: '#404040',
        divider: '#EDEDED',
        alert: '#FF2D2D',
        delete: '#D34444',
      },
    },
  },
  plugins: [],
};
