/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nova: {
          base: '#050505', // Synced with --nova-bg
          accent: '#4F46E5', // Gemini Indigo
          pulse: '#22D3EE', // Compliance Cyan
          glass: 'rgba(255, 255, 255, 0.03)',
          surface: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        'gemini-blue': '#4285F4',
        'gemini-purple': '#9B72CB',
        'gemini-pink': '#D96570',
      },
      backgroundImage: {
        'neural-gradient': 'radial-gradient(circle at center, #4F46E5 0%, #050505 100%)',
        'gemini-gradient': 'linear-gradient(135deg, #4285F4 0%, #9B72CB 50%, #D96570 100%)',
        'nova-glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
        'nova-mesh': 'radial-gradient(circle at 20% -20%, rgba(66, 133, 244, 0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(155, 114, 203, 0.12), transparent 40%)',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
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
