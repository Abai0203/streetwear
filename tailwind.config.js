/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        bg2: '#111111',
        bg3: '#1a1a1a',
        bg4: '#222222',
        brd: '#2a2a2a',
        acc: '#ff3c00',
        acc2: '#00ff88',
        card: '#141414',
        t1: '#f0ece4',
        t2: '#888888',
        t3: '#555555',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'cursive'],
        mono: ['"Space Mono"', 'monospace'],
        sans: ['Manrope', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        bjump: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'scale-in': 'scaleIn 0.2s ease both',
        shimmer: 'shimmer 1.5s infinite',
        bjump: 'bjump 2s ease infinite',
      },
    },
  },
  plugins: [],
}
