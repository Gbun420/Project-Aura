/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        aura: {
          base: '#030712', // Deep Space
          accent: '#4F46E5', // Gemini Indigo
          pulse: '#22D3EE', // Compliance Cyan
          glass: 'rgba(255, 255, 255, 0.03)',
          surface: '#0B0D11',
        },
        'gemini-blue': '#4285F4',
        'gemini-purple': '#9B72CB',
        'gemini-pink': '#D96570',
        'gemini-bg': '#0F1114',
      },
      backgroundImage: {
        'neural-gradient': 'radial-gradient(circle at center, #4F46E5 0%, #030712 100%)',
        'gemini-gradient': 'linear-gradient(135deg, #4285F4 0%, #9B72CB 50%, #D96570 100%)',
        'aura-glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neural-glow': 'neural-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'neural-glow': {
          '0%': { boxShadow: '0 0 5px rgba(79, 70, 229, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' },
        }
      }
    },
  },
  plugins: [],
};
