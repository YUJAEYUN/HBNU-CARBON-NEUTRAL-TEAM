import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",  // ✅ Next.js 13+ App Router 포함
    "./src/components/**/*.{js,ts,jsx,tsx}",  // ✅ 재사용 가능한 컴포넌트 포함
  ],
  theme: {
    extend: {
      colors: {
        // 기존 색상 유지 (약간 조정)
        'primary': '#34C759', // iOS 그린으로 변경
        'primary-light': '#E9F9EF',
        'primary-medium': '#86E0A0',
        'primary-dark': '#248A3D',
        'accent': '#1B5E20',

        // iOS 스타일 색상 추가
        'ios': {
          'green': '#34C759',
          'blue': '#007AFF',
          'indigo': '#5856D6',
          'purple': '#AF52DE',
          'teal': '#5AC8FA',
          'red': '#FF3B30',
          'orange': '#FF9500',
          'yellow': '#FFCC00',
          'gray': '#8E8E93',
          'gray-light': '#E5E5EA',
          'background': '#F2F2F7',
        },
      },
      boxShadow: {
        // iOS 스타일 그림자
        'ios-sm': '0 4px 10px rgba(0, 0, 0, 0.08)',
        'ios': '0 8px 20px rgba(0, 0, 0, 0.12)',
        'ios-lg': '0 12px 30px rgba(0, 0, 0, 0.15)',
        'ios-inner': 'inset 0 1px 3px rgba(0, 0, 0, 0.06)',

        // 기존 그림자 (iOS 스타일로 업데이트)
        'neu-up': '0 4px 10px rgba(0, 0, 0, 0.08)',
        'neu-down': 'inset 0 1px 3px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 10px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 20px rgba(0, 0, 0, 0.12)',
        'button-3d': '0 4px 10px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-sm': 'bounce-sm 2s ease-in-out infinite',
        'scale': 'scale 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-sm': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px',
      },
      // iOS 스타일 블러 효과
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        DEFAULT: '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
