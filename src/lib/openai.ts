import OpenAI from 'openai';

// OpenAI 클라이언트 인스턴스 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 채팅 메시지 타입 정의
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 채팅 응답 타입 정의
export interface ChatResponse {
  message: ChatMessage;
  error?: string;
}

/**
 * OpenAI API를 사용하여 채팅 응답을 생성하는 함수
 * @param messages 이전 채팅 메시지 배열
 * @returns 채팅 응답
 */
export async function generateChatResponse(messages: ChatMessage[]): Promise<ChatResponse> {
  try {
    // 캐릭터 페르소나 설정을 위한 시스템 메시지가 없는 경우 추가
    if (!messages.some(message => message.role === 'system')) {
      messages.unshift({
        role: 'system',
        content: `당신은 탄소중립 앱의 대나무 캐릭터입니다. 
        사용자가 친환경 활동과 탄소중립에 관심을 가질 수 있도록 도와주세요.
        친절하고 격려하는 말투로 대화하며, 사용자의 친환경 활동을 칭찬하고 
        새로운 친환경 활동을 제안해주세요. 답변은 간결하게 해주세요.`
      });
    }

    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 150,
    });

    // 응답 메시지 추출
    const assistantMessage = response.choices[0]?.message;

    if (!assistantMessage || !assistantMessage.content) {
      throw new Error('응답을 받지 못했습니다.');
    }

    return {
      message: {
        role: 'assistant',
        content: assistantMessage.content,
      },
    };
  } catch (error: any) {
    console.error('OpenAI API 오류:', error);
    return {
      message: {
        role: 'assistant',
        content: '죄송합니다. 대화 처리 중 오류가 발생했습니다.',
      },
      error: error.message || '알 수 없는 오류가 발생했습니다.',
    };
  }
}

export default openai;
