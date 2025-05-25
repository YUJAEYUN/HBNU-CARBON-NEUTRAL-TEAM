import { NextResponse } from 'next/server';

/**
 * 간단한 네트워크 연결 테스트용 API 라우트
 * 음성 인식 시작 전에 실제 네트워크 연결을 확인하는 데 사용
 */
export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: Date.now() });
}

/**
 * HEAD 요청 처리 (더 가벼운 응답)
 */
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
