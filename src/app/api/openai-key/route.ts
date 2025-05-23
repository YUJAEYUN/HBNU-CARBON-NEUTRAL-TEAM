import { NextResponse } from 'next/server';

/**
 * OpenAI API 키를 안전하게 제공하는 API 라우트
 * 실제 배포 환경에서는 추가적인 인증 및 보안 조치가 필요합니다.
 */
export async function GET() {
  // 환경 변수에서 API 키 가져오기
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }
  
  // API 키 반환 (실제 배포 시에는 세션 기반 인증 등 추가 보안 조치 필요)
  return NextResponse.json({ apiKey });
}
