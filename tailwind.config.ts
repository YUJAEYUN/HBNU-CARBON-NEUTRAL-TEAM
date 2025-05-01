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
    },
  },
  plugins: [],
};

export default config;
