/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { 
    extend: {
      colors: {
        verdeSuave: {
          DEFAULT: '#C3D9C9',
          50:  '#EAF2EB',
          100: '#DDE8DE',
          200: '#C3D9C9',
          300: '#A9C7B3',
          400: '#8FB49D',
          500: '#75A287',
          600: '#5C8870',
          700: '#446E59',
          800: '#2C5542',
          900: '#153C2C',
        },
      }
    } 
  },
  plugins: [],
}
