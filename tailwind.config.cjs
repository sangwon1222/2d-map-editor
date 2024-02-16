module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: true,
  theme: {
    screens: {
      mobile: '0px',
      tablet: '600px',
      desktop: '800px',
    },
    extend: {
      gridTemplateColumns: {
        1: 'repeat(1, minmax(0, 1fr))',
        2: 'repeat(2, minmax(0, 1fr))',
        3: 'repeat(3, minmax(0, 1fr))',
        4: 'repeat(4, minmax(0, 1fr))',
        5: 'repeat(5, minmax(0, 1fr))',
        6: 'repeat(6, minmax(0, 1fr))',
        7: 'repeat(7, minmax(0, 1fr))',
        8: 'repeat(8, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))',
        10: 'repeat(10, minmax(0, 1fr))',
        11: 'repeat(11, minmax(0, 1fr))',
        12: 'repeat(12, minmax(0, 1fr))',
        none: 'none',
        'fill-40': 'repeat(auto-fill, 10rem)',
      },
      letterSpacing: {
        maxtight: '-0.1rem',
        maxtighter: '-0.15rem',
      },
      colors: {
        'main-color-1': '#2f3241',
        'main-color-2': '#373B4D',

        'sub-color-1': '#403B2E',
        'sub-color-2': '#57608C',
      },
      rotate: {
        135: '135deg',
        225: '225deg',
      },
      fontSize: {
        xs: '0.75rem',
        '2xs': '0.6rem',
      },
      borderWidth: {
        DEFAULT: '1px',
      },
      keyframes: {
        slide: {
          '0%': { marginLeft: '-100%' },
          '100%': { marginLeft: '0' },
        },
        fadeIn: {
          '0%': { display: 'block', opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '99%': { opacity: '0' },
          '100%': { display: 'none' },
        },
      },
      animation: {
        slide: 'slide 0.5s ease-in-out forwards',
        fadeIn: 'fadeIn 0.5s ease-in-out forwards',
        fadeOut: 'fadeOut 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
