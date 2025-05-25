const fs = require('fs');
const path = require('path');

// 아이콘 크기 배열
const iconSizes = [
  16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 384, 512
];

// 기본 SVG 템플릿
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 배경 원 -->
  <circle cx="256" cy="256" r="256" fill="#22C55E"/>
  
  <!-- 잎사귀 모양 -->
  <path d="M256 100C200 100 150 150 150 220C150 280 200 320 256 320C312 320 362 280 362 220C362 150 312 100 256 100Z" fill="#16A34A"/>
  
  <!-- 줄기 -->
  <rect x="248" y="320" width="16" height="80" fill="#15803D"/>
  
  <!-- 작은 잎사귀들 -->
  <ellipse cx="200" cy="180" rx="30" ry="20" fill="#16A34A" transform="rotate(-30 200 180)"/>
  <ellipse cx="312" cy="180" rx="30" ry="20" fill="#16A34A" transform="rotate(30 312 180)"/>
  
  <!-- 하이라이트 -->
  <ellipse cx="220" cy="160" rx="15" ry="25" fill="#34D399" opacity="0.7" transform="rotate(-20 220 160)"/>
  
  <!-- 텍스트 -->
  <text x="256" y="450" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">C</text>
</svg>
`;

// 파비콘 생성
const createFavicon = () => `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="16" fill="#22C55E"/>
  <path d="M16 6C12.5 6 9.5 9 9.5 13.5C9.5 17.5 12.5 20 16 20C19.5 20 22.5 17.5 22.5 13.5C22.5 9 19.5 6 16 6Z" fill="#16A34A"/>
  <rect x="15.5" y="20" width="1" height="5" fill="#15803D"/>
  <text x="16" y="28" font-family="Arial, sans-serif" font-size="3" font-weight="bold" text-anchor="middle" fill="white">C</text>
</svg>
`;

// 디렉토리 생성
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 아이콘 SVG 파일들 생성
iconSizes.forEach(size => {
  const svgContent = createIconSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(iconsDir, filename), svgContent);
  console.log(`Generated ${filename}`);
});

// 파비콘 생성
const faviconContent = createFavicon();
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconContent);
console.log('Generated favicon.svg');

// 기본 아이콘 복사
fs.writeFileSync(path.join(iconsDir, 'icon-16x16.svg'), createIconSVG(16));
fs.writeFileSync(path.join(iconsDir, 'icon-32x32.svg'), createIconSVG(32));

console.log('All icons generated successfully!');
console.log('Note: For production, consider converting SVG files to PNG using a tool like sharp or imagemagick');
console.log('Example: npm install sharp && node scripts/convert-to-png.js');
