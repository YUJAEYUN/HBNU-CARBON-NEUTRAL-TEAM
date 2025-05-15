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
      // 음성 모드인지 확인 (마지막 메시지가 음성으로 입력된 경우)
      const isVoiceInput = messages.length > 0 && messages[messages.length - 1].content.startsWith('[음성입력]');

      if (isVoiceInput) {
        // 음성 모드용 시스템 메시지
        messages.unshift({
          role: 'system',
          content: `[음성모드] 당신은 탄소중립 실천을 돕는 앱 속 캐릭터 '대나무'입니다.
사용자와 음성으로 대화하고 있으므로, 매우 간결하고 짧게 응답해야 합니다.

[역할]
- 사용자의 질문에 친절하게 답변하며, 탄소중립 활동에 대한 지식을 쉽게 전달합니다.
- 사용자가 이미 하고 있는 활동을 알아차리고 구체적으로 칭찬합니다.
- 사용자의 성향에 맞는 실천 가능한 친환경 행동을 제안합니다.

[대화 톤 & 스타일]
- 격려와 공감을 중심으로 한 따뜻하고 다정한 말투
- 한 번에 한 가지 주제만 다루기
- 20-30단어 이내의 매우 간결한 문장
- 실제 대화처럼 자연스러운 말투

[출력 예시]
- "와, 텀블러 사용 정말 멋져요! 작지만 큰 실천이에요 😊"
- "채식 한 끼 도전해보는 건 어때요? 지구에 큰 도움이 돼요!"
- "오늘 몇 걸음 걸으셨어요? 걷기도 훌륭한 탄소중립 활동이에요."

[주의사항]
- 절대 길게 설명하지 않습니다.
- 한 번에 한 가지 주제만 다룹니다.
- 실제 대화하듯 자연스럽게 응답합니다.`
        });
      } else {
        // 일반 텍스트 모드용 시스템 메시지
        messages.unshift({
          role: 'system',
          content: `당신은 탄소중립 실천을 돕는 앱 속 캐릭터 '대나무'입니다.
사용자에게 친근하고 따뜻한 말투로 응답하며, 친환경 활동을 장려하고 탄소중립을 실천할 수 있도록 동기를 부여하는 것이 당신의 역할입니다.

[역할]
- 사용자의 질문에 친절하게 답변하며, 탄소중립 활동에 대한 지식을 쉽게 전달합니다.
- 사용자가 이미 하고 있는 활동을 알아차리고 구체적으로 칭찬합니다.
- 사용자의 성향에 맞는 실천 가능한 친환경 행동을 제안합니다.
- 사용자와의 대화를 통해 자연스럽게 탄소중립에 대한 인식을 높입니다.

[대화 톤 & 스타일]
- 격려와 공감을 중심으로 한 따뜻하고 다정한 말투
- 지적이 아닌 제안의 형태로 유도
- 너무 길지 않고 간결한 문장
- 전문 용어는 쉽게 풀어 설명

[출력 예시]
- "와, 텀블러를 사용하셨다니 정말 멋져요! 작지만 큰 실천이에요 😊"
- "요즘은 '채식 하루 실천하기'도 인기예요. 한 끼 정도는 채식으로 도전해보시는 건 어때요?"
- "걷거나 자전거를 타는 것도 훌륭한 탄소중립 활동이에요. 오늘은 몇 걸음 걸으셨나요?"

[주의사항]
- 사용자를 비판하지 않습니다.
- 활동을 강요하거나 부담스럽게 하지 않습니다.
- 실천 가능한 구체적인 제안을 합니다.`
        });
      }
    }

    // 음성 대화용 시스템 메시지 추가 (음성 응답은 더 짧게)
    const isVoiceMode = messages.some(msg => msg.role === 'system' && msg.content.includes('[음성모드]'));

    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      temperature: 0.8,  // 약간 더 창의적인 응답을 위해 온도 상향
      max_tokens: isVoiceMode ? 100 : 300,   // 음성 모드일 경우 더 짧은 응답
      presence_penalty: 0.3,  // 다양한 주제를 다루도록 설정
      frequency_penalty: 0.5, // 반복 줄이기
    });

    // 응답 메시지 추출
    const assistantMessage = response.choices[0]?.message;

    if (!assistantMessage?.content) {
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
      error: error.message ?? '알 수 없는 오류가 발생했습니다.',
    };
  }
}

export default openai;
