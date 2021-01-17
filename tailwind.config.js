module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'navColor' : '#fff',                    // Top Navigation color
        'backgroundColor' : '#f7f7f8',          // Background color
        'sidemenuColor' : '#fff',               // Sidemenu Background color
        'sidemenuActiveColor' : '#d8d8f7',      // Sidemenu Active state color
        'dangerBtn' : '#E24949',                // button red color
        'primaryBtn' : '#393C8E',               // button blue color
        'successBtn' : '#28B867',               // button green color
        'closeBtn' : '#6c757d',                 // button gray color
        'dangerMsg' : '#EB5757 !important',     // message bg red color
        'primaryMsg' : '#393C8E',               // message bg blue color
        'successMsg' : '#36D37A',               // message bg green color
        'violet' : '#393C8E',                   // violet color
        'v-status-none' : '#E5E6E8',            // verification status none color
        'v-status-approved' : '#36D37A',         // verification status approve color
        'v-status-rejected' : '#EB5757',        // verification status rejected color
        'v-status-pending' : '#F08B34',         // verification status pending color
        'loader' : '#000000cc',                 // loading state bg color
      },
      flex: {
        '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
        'auto': 'auto'
      },
      fontSize: {
        'xxs': '.55rem',
      },
      maxHeight:  {
        'vh2.5/10': '25vh',
        'vh5/10': '50vh',
        'vh7/10': '70vh',
        'vh7.5/10': '75vh',
        'vh8/10': '80vh',
        'vh8.5/10': '85vh',
        'vh9/10': '90vh',
        'vhfull': '100vh',
      },
      minHeight: {
        '50px': '50px',
      },
      maxWidth: {
        '150px': '150px',
        '170px': '170px',
        '180px': '180px',
        '44': '11rem',
      },
      minWidth: {
        '11': '2.75rem',
        '28': '7rem',
        '40': '10rem',
        '48': '12rem',
      },
      width:  {
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
        '45': '11.25rem',
        '100': '25rem',
        '103': '25.75rem',
        '110': '32.625rem',
      },
      gridTemplateRows:  {
        '12': 'repeat(12, minmax(0, 1fr));',
      },
      borderRadius: {
        '50%': '50%'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
