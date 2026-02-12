/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#f8f4ee',
          100: '#f2e9dd',
          200: '#ead8c3'
        },
        navy: {
          800: '#1a2033',
          900: '#0d1423'
        },
        mist: '#e5ebff'
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(145deg, #f6f1ea, #efe4d7)',
        'gradient-night': 'linear-gradient(145deg, #0d1423, #1a2033)'
      },
      boxShadow: {
        glass: '0 14px 34px rgba(19, 29, 48, 0.14)'
      },
      transitionDuration: {
        base: '300ms',
        major: '500ms'
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    },
  },
  plugins: [],
}
