import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",  // ✅ Next.js 13+ App Router 포함
    "./src/components/**/*.{js,ts,jsx,tsx}",  // ✅ 재사용 가능한 컴포넌트 포함
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
