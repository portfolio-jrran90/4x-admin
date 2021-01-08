module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'navColor' : '#fff',                    // custom Top Navigation color
        'backgroundColor' : '#f7f7f8',          // custom Background color
        'sidemenuColor' : '#fff',               // custom Sidemenu Background color
        'sidemenuActiveColor' : '#d8d8f7',      // custom Sidemenu Active state color
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
