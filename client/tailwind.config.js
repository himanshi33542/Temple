/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          500: '#FF6B00',
          600: '#E65C00',
        },
        gold: {
          400: '#E5C158',
          500: '#D4AF37',
          600: '#B5952F',
        },
        cream: {
          50: '#FFFCF5',
          100: '#FFF8E7',
          200: '#F5EED5',
        },
        maroon: {
          800: '#800020',
          900: '#5C0017',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mandala-pattern': "url('/mandala-bg.svg')",
      }
    },
  },
  plugins: [],
}
