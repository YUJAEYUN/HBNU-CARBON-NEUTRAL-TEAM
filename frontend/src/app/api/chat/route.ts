import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, ChatMessage } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 메시지 배열 추출
    const { messages } = await request.json() as { messages: ChatMessage[] };

    // 메시지 배열이 없거나 비어있는 경우 에러 응답
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: '유효한 메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    // OpenAI API를 사용하여 채팅 응답 생성
    const response = await generateChatResponse(messages);

    // 에러가 있는 경우 에러 응답
    if (response.error) {
      return NextResponse.json(
        { error: response.error },
        { status: 500 }
      );
    }

    // 성공적인 응답
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('API 라우트 오류:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
