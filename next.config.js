/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 시 ESLint 오류가 있어도 빌드를 계속 진행합니다.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 TypeScript 오류가 있어도 빌드를 계속 진행합니다.
    ignoreBuildErrors: true,
  },
  compiler: {
    // Styled Components 지원 활성화
    styledComponents: true,
  },
};

module.exports = nextConfig;
