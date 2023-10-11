/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    colors: {
      'bc-blue': '#2251A3',
      'bc-gold': '#FECE02',
      'bc-red': '#DA272D',
    },
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
};
