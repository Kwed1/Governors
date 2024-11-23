/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        starAnimation: 'starAnimation 2.5s ease-out infinite',
      },
      keyframes: {
        starAnimation: {
          '0%': { transform: 'scale(0) translateY(0)', opacity: '1' },
          '50%': { transform: 'scale(1.5) translateY(-20px)', opacity: '0.7' },
          '100%': { transform: 'scale(0) translateY(-40px)', opacity: '0' },
        },
      },
      colors: {
        myColors: {
          50: '#323232',
          100: '#292929',
          150: '#191919',
          200: '#404040',
          250: '#FFCC00',
          300: '#797979',
          350: '#404040',
          400: '#212121',
          450: '#1F1F1F',
          500: '#F7AE3B',
          550: '#FFF6A7',
          600: '#403F3E',
          650: '#A0A0A0',
          700: '#BD8836',
          750: '#343434',
          800: "#484545",
          850: "#878484",
          900: "#B9C44E",
          950: "#0C0C0C",
        },
        myColors2: {
          50: "#1C1C1C",
          100: "#292929E8",
          150: "#464646",
          200: "#00000033"
        }
      },
      backgroundImage: {
        'gray-gradient': "linear-gradient(90deg, #404040 0%, #F7AE3B 100%)",
      },
      screens: {
        'custom-sm': {'max': '380px'},
        'custom-lg': {'min': '390px'},
        'custom-md': {'min': '414px'},
        'custom-xl': {'min': '430px'},
        'h-xs': { 'raw': '(max-height: 667px)' },
        'h-md': { 'raw': '(max-height: 760px)' },
      },
    },
  },
  plugins: [],
}

