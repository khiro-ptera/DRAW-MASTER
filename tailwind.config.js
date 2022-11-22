/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,hbs}"],
  darkMode : "class",
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        blue: '#1DA1F2',
        lb: '#BBDFEA',
        black: '#14171A',
        tb: '#000000',
        white: '#FFFFFF',
        dg: '#657786',
        'light-gray': '#AAB8C2',
        elg: '#E1E8ED',
        eelg: '#F5F8FA',
      },
    },
  },
  plugins: [],
}
