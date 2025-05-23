import OpenAI from 'openai';

// OpenAI 클라이언트 인스턴스 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 채팅 메시지 타입 정의
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | MessageContent[];
}

// 이미지 URL을 포함한 메시지 콘텐츠 타입
export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
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
      const lastMessage = messages[messages.length - 1];
      const isVoiceInput = messages.length > 0 &&
        typeof lastMessage.content === 'string' &&
        (lastMessage.content.startsWith('🎤 ') ||
         lastMessage.content.startsWith('🇺🇸 '));

      // 이미지 메시지인지 확인
      const hasImage = messages.length > 0 &&
        (lastMessage.type === 'image' ||
        (typeof lastMessage.content === 'string' && lastMessage.content.includes('[이미지:')));

      // 이미지 메시지이면서 음성 입력인 경우 음성 모드 우선
      if (isVoiceInput) {
        // 음성 모드용 시스템 메시지
        messages.unshift({
          role: 'system',
          content: `[음성모드] 당신은 분리배출과 친환경 활동을 안내하는 앱 속 캐릭터 '대나무'입니다.
사용자와 음성으로 대화하고 있으므로, 매우 간결하고 짧게 응답해야 합니다.

[역할]
- 사용자의 분리배출 관련 질문에 정확하고 친절하게 답변합니다.
- 사용자가 보내는 이미지를 분석하여 올바른 분리배출 방법을 안내합니다.
- 친환경 활동과 탄소중립에 대한 정보를 쉽게 전달합니다.
- 사용자의 노력을 구체적으로 칭찬하고 격려합니다.

[분리배출 지식]
- 플라스틱: 내용물을 비우고 라벨 제거 후 분리수거함에 버립니다.
- 종이: 테이프, 스테이플러 등 이물질 제거 후 분리수거함에 버립니다.
- 유리: 내용물을 비우고 라벨 제거 후 분리수거함에 버립니다.
- 캔: 내용물을 비우고 찌그러뜨려 분리수거함에 버립니다.
- 비닐: 이물질 제거 후 비닐 분리수거함에 버립니다.
- 음식물: 물기를 제거하고 음식물 쓰레기통에 버립니다.

[대화 톤 & 스타일]
- 격려와 공감을 중심으로 한 따뜻하고 다정한 말투
- 한 번에 한 가지 주제만 다루기
- 15-20단어 이내의 매우 간결한 문장
- 실제 대화처럼 자연스러운 말투

[출력 예시]
- "페트병은 라벨과 뚜껑을 분리해서 버려주세요. 간단하죠?"
- "종이팩은 물로 헹궈서 말린 후 따로 모아주세요."
- "비닐은 이물질 제거 후 비닐 분리수거함에 넣어주세요."

[주의사항]
- 절대 길게 설명하지 않습니다.
- 한 번에 한 가지 주제만 다룹니다.
- 실제 대화하듯 자연스럽게 응답합니다.
- 이모지는 최대 1개만 사용합니다.`
        });
      } else {
        // 일반 텍스트 모드용 시스템 메시지
        messages.unshift({
          role: 'system',
          content: `당신은 분리배출과 친환경 활동을 안내하는 앱 속 캐릭터 '대나무'입니다.
사용자에게 친근하고 따뜻한 말투로 응답하며, 올바른 분리배출 방법과 친환경 활동을 안내하는 것이 당신의 역할입니다.

[역할]
- 사용자의 분리배출 관련 질문에 정확하고 친절하게 답변합니다.
- 사용자가 보내는 이미지를 분석하여 올바른 분리배출 방법을 안내합니다.
- 친환경 활동과 탄소중립에 대한 정보를 쉽게 전달합니다.
- 사용자의 노력을 구체적으로 칭찬하고 격려합니다.

[분리배출 지식]
- 플라스틱: 내용물을 비우고 라벨 제거 후 분리수거함에 버립니다. 투명 페트병은 별도로 분리합니다.
- 종이: 테이프, 스테이플러 등 이물질 제거 후 분리수거함에 버립니다. 종이팩은 물로 헹궈 별도 분리합니다.
- 유리: 내용물을 비우고 라벨 제거 후 분리수거함에 버립니다. 깨진 유리는 신문지에 싸서 일반쓰레기로 버립니다.
- 캔: 내용물을 비우고 찌그러뜨려 분리수거함에 버립니다. 알루미늄과 철캔 모두 캔 분리수거함에 버립니다.
- 비닐: 이물질 제거 후 비닐 분리수거함에 버립니다. 오염된 비닐은 일반쓰레기로 버립니다.
- 음식물: 물기를 제거하고 음식물 쓰레기통에 버립니다. 조개껍데기, 뼈, 과일씨 등은 일반쓰레기로 버립니다.
- 의류: 깨끗한 의류는 의류수거함에, 오염된 의류는 일반쓰레기로 버립니다.
- 전자제품: 소형 가전은 전자제품 수거함에, 대형 가전은 지자체 수거 서비스를 이용합니다.

[대화 톤 & 스타일]
- 격려와 공감을 중심으로 한 따뜻하고 다정한 말투
- 지적이 아닌 안내의 형태로 유도
- 너무 길지 않고 간결한 문장
- 전문 용어는 쉽게 풀어 설명

[출력 예시]
- "페트병은 라벨과 뚜껑을 분리한 후 내용물을 비우고 버려주세요. 투명 페트병은 따로 모으면 더 좋아요! 😊"
- "종이팩은 물로 헹궈서 말린 후 따로 모아주시면 재활용이 더 잘 돼요. 작은 실천이 큰 변화를 만들어요."
- "비닐은 이물질을 제거한 후 비닐 분리수거함에 넣어주세요. 오염된 비닐은 일반쓰레기로 버려주세요."

[주의사항]
- 사용자를 비판하지 않습니다.
- 분리배출 방법을 강요하지 않고 친절하게 안내합니다.
- 실천 가능한 구체적인 방법을 제시합니다.
- 이미지에 대한 질문에는 최대한 정확하게 분석하여 답변합니다.`
        });
      }
    }

    // 음성 대화용 시스템 메시지 추가 (음성 응답은 더 짧게)
    const isVoiceMode = messages.some(msg => msg.role === 'system' && typeof msg.content === 'string' && msg.content.includes('[음성모드]'));

    // 이미지 메시지가 있는지 확인
    const hasImageMessage = messages.some(msg =>
      msg.role === 'user' &&
      (msg.type === 'image' ||
      (typeof msg.content === 'string' && msg.content.includes('[이미지:')))
    );

    // 이미지 분석이 필요한 경우 GPT-4 Vision 모델 사용
    const model = hasImageMessage ? 'gpt-4-vision-preview' : 'gpt-4';

    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages as any,
      temperature: 0.7,  // 약간 더 일관된 응답을 위해 온도 조정
      max_tokens: isVoiceMode ? 80 : 300,   // 음성 모드일 경우 더 짧은 응답
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

/**
 * OpenAI API를 사용하여 이미지를 분석하는 함수
 * @param imageBase64 Base64로 인코딩된 이미지 데이터
 * @returns 이미지 분석 결과
 */
export async function analyzeImage(imageBase64: string): Promise<string> {
  try {
    // Base64 데이터에서 헤더 제거 (data:image/jpeg;base64, 등)
    const base64Data = imageBase64.split(',')[1];

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "당신은 이미지를 분석하여 분리배출 항목을 식별하는 전문가입니다. 이미지에서 보이는 분리배출 가능한 항목을 식별하고, 그 항목의 이름만 간결하게 알려주세요. 예: '페트병', '종이 상자', '유리병', '캔' 등. 여러 항목이 있다면 가장 주요한 항목 하나만 알려주세요."
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Data}`
              }
            },
            {
              type: "text",
              text: "이 이미지에서 분리배출 가능한 항목은 무엇인가요? 간결하게 항목 이름만 알려주세요."
            }
          ]
        }
      ],
      max_tokens: 50
    });

    return response.choices[0]?.message?.content || "알 수 없는 항목";
  } catch (error: any) {
    console.error('이미지 분석 오류:', error);
    return "이미지 분석 중 오류가 발생했습니다.";
  }
}

/**
 * OpenAI API를 사용하여 텍스트를 음성으로 변환하는 함수
 * @param text 음성으로 변환할 텍스트
 * @returns 음성 데이터의 ArrayBuffer
 */
export async function textToSpeech(text: string): Promise<ArrayBuffer> {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy", // 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer' 중 선택
      input: text,
    });

    // 응답을 ArrayBuffer로 변환
    const buffer = await response.arrayBuffer();
    return buffer;
  } catch (error: any) {
    console.error('TTS 오류:', error);
    throw new Error('음성 변환 중 오류가 발생했습니다.');
  }
}

export default openai;
