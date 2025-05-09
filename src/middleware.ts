import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 인증이 필요한 경로 목록
const protectedRoutes = [
  '/dashboard',
  '/character',
  '/certification',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증이 필요한 경로인지 확인
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // 쿠키에서 토큰 확인
    const token = request.cookies.get('auth_token')?.value;

    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * 다음 경로에 미들웨어 적용:
     * - 인증이 필요한 모든 경로
     * - API 경로 제외
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
