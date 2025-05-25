import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",  // ✅ Next.js 13+ App Router 포함
    "./src/components/**/*.{js,ts,jsx,tsx}",  // ✅ 재사용 가능한 컴포넌트 포함
  ],
  theme: {
    extend: {
      colors: {
        // 친환경 탄소중립 색상 시스템
        'primary': '#22C55E', // 생생한 자연 그린
        'primary-light': '#DCFCE7',
        'primary-medium': '#86EFAC',
        'primary-dark': '#15803D',
        'accent': '#F59E0B', // 따뜻한 햇살 오렌지

        // 친환경 컬러 팔레트
        'eco': {
          'primary': '#22C55E',
          'primary-light': '#DCFCE7',
          'primary-dark': '#15803D',
          'secondary': '#0EA5E9',
          'secondary-light': '#E0F2FE',
          'accent': '#F59E0B',
          'earth': '#A3A3A3',
          'earth-light': '#F5F5F4',
          'success': '#10B981',
          'warning': '#EAB308',
          'error': '#EF4444',
        },

        // 토스 컬러 팔레트 (호환성)
        'toss': {
          'blue': '#0EA5E9',
          'blue-light': '#E0F2FE',
          'blue-dark': '#0284C7',
          'gray': {
            '50': '#F9FAFB',
            '100': '#F2F4F6',
            '200': '#E5E8EB',
            '300': '#D1D6DB',
            '400': '#B0B8C1',
            '500': '#8B95A1',
            '600': '#6B7684',
            '700': '#4E5968',
            '800': '#333D4B',
            '900': '#191F28',
          },
          'red': '#EF4444',
          'orange': '#F59E0B',
          'yellow': '#EAB308',
          'green': '#22C55E',
          'mint': '#10B981',
          'purple': '#8B5CF6',
        },
      },
      boxShadow: {
        // 토스 스타일 그림자 시스템
        'toss-1': '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        'toss-2': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'toss-3': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        'toss-4': '0 16px 40px 0 rgba(0, 0, 0, 0.16)',

        // 기존 그림자들을 토스 스타일로 호환
        'ios-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        'ios': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'ios-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        'card': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        'button-3d': '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
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
        // 토스 스타일 반경 시스템
        'toss-4': '4px',
        'toss-8': '8px',
        'toss-12': '12px',
        'toss-16': '16px',
        'toss-20': '20px',
        'toss-24': '24px',
        // 기존 호환성
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        'full': '9999px',
      },
      fontSize: {
        // 토스 스타일 타이포그래피
        'toss-h1': ['28px', { lineHeight: '1.4', fontWeight: '700' }],
        'toss-h2': ['24px', { lineHeight: '1.4', fontWeight: '700' }],
        'toss-h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'toss-h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'toss-body1': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'toss-body2': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'toss-caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        // 토스 스타일 간격 시스템
        'toss-1': '4px',
        'toss-2': '8px',
        'toss-3': '12px',
        'toss-4': '16px',
        'toss-5': '20px',
        'toss-6': '24px',
        'toss-8': '32px',
        'toss-10': '40px',
        'toss-12': '48px',
      },
    },
  },
  plugins: [],
};

export default config;
