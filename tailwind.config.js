/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modo Claro (Warm Editorial Alabaster)
        alabaster: {
          bg: '#FBFBFD',
          card: '#FFFFFF',
          secondary: '#F1F2F6',
          text: '#111318',
          subtext: '#676E7E',
          accent: '#1A1D24',
          gold: '#D4AF37'
        },
        // Modo Oscuro (Obsidian Luxury Studio)
        obsidian: {
          bg: '#0E0F12',
          card: '#16181E',
          border: '#262933',
          secondary: '#1F222B',
          text: '#F4F5F8',
          subtext: '#9E9EB2',
          gold: '#E5C158'
        }
      },
      fontFamily: {
        title: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        body: ['Inter', 'SF Pro Display', 'sans-serif']
      }
    },
  },
  plugins: [],
};
