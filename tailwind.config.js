/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        botiva: {
          ink: '#0F2A4A',
          blue: '#2563EB',
          'blue-soft': '#EFF4FF',
          success: '#16A34A',
          bg: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
};
