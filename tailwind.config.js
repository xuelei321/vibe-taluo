import { Config } from 'tailwindcss'

const config = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aura: {
          50: '#e6f4fa',
          100: '#c0e3f3',
          200: '#97d0ec',
          300: '#6dbde4',
          400: '#4fb0df',
          500: '#2fa3d9',
          600: '#2696d1',
          700: '#1c85c7',
          800: '#1375bd',
          900: '#005ca3',
          DEFAULT: '#2fa3d9'
        },
        void: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
          500: '#52525b',
          600: '#3f3f46',
          700: '#27272a',
          800: '#18181b',
          900: '#0a0a0f',
          950: '#050510',
          DEFAULT: '#0a0a0f'
        },
        neon: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          DEFAULT: '#8b5cf6'
        },
        mystic: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          DEFAULT: '#facc15'
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        'noto-serif-sc': ['Noto Serif SC', 'serif']
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        drift: 'drift 20s linear infinite'
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' }
        },
        drift: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(20px, -10px)' },
          '50%': { transform: 'translate(0, -20px)' },
          '75%': { transform: 'translate(-20px, -10px)' },
          '100%': { transform: 'translate(0, 0)' }
        }
      }
    }
  },
  plugins: []
}

export default config
