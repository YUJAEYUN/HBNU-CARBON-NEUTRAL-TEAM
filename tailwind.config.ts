import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",  // ✅ Next.js 13+ App Router 포함
    "./src/components/**/*.{js,ts,jsx,tsx}",  // ✅ 재사용 가능한 컴포넌트 포함
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4CAF50',
        'primary-light': '#E8F5E9',
        'primary-medium': '#81C784',
        'primary-dark': '#2E7D32',
        'accent': '#1B5E20',
      },
      boxShadow: {
        'neu-up': '6px 6px 12px #d1d9d1, -6px -6px 12px #ffffff',
        'neu-down': 'inset 6px 6px 12px #d1d9d1, inset -6px -6px 12px #ffffff',
        'card': '0 10px 15px -3px rgba(76, 175, 80, 0.1), 0 4px 6px -2px rgba(76, 175, 80, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(76, 175, 80, 0.1), 0 10px 10px -5px rgba(76, 175, 80, 0.04)',
        'button-3d': '0 4px 0 0 #2E7D32',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
