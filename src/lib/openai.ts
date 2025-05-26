import OpenAI from 'openai';
import { getOpenAIApiKey } from './apiKeyUtils';

// 초기 OpenAI 클라이언트 인스턴스 생성 (임시 키로)
let openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'temp_key',
  dangerouslyAllowBrowser: true, // 브라우저에서 API 키 사용 허용 (개발용)
  maxRetries: 3, // 최대 재시도 횟수
  timeout: 30000, // 30초 타임아웃
});

// 클라이언트 측에서 API 키 초기화
if (typeof window !== 'undefined') {
  // 비동기적으로 API 키 가져와서 클라이언트 업데이트
  getOpenAIApiKey().then(apiKey => {
    if (apiKey) {
      openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
        maxRetries: 3,
        timeout: 30000,
      });
      console.log('OpenAI 클라이언트가 API 키로 초기화되었습니다.');
    } else {
      console.error('API 키를 가져오지 못했습니다. OpenAI 기능이 작동하지 않을 수 있습니다.');
    }
  }).catch(error => {
    console.error('API 키 초기화 중 오류:', error);
  });
}

// 채팅 메시지 타입 정의
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | MessageContent[];
  type?: string; // 이미지 타입 등을 위한 필드
}

// 이미지 URL을 포함한 메시지 콘텐츠 타입
export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

// 오디오 응답을 위한 타입 정의
export interface AudioMessage {
  audio: string;
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
    // API 키 확인
    const apiKey = await getOpenAIApiKey();
    if (!apiKey) {
      return {
        message: {
          role: 'assistant',
          content: '죄송합니다. OpenAI API 키가 설정되지 않아 응답할 수 없습니다.',
        },
        error: 'API 키가 설정되지 않았습니다.',
      };
    }

    // OpenAI 클라이언트 업데이트 (최신 API 키 사용)
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      maxRetries: 3,
      timeout: 30000,
    });
    // 캐릭터 페르소나 설정을 위한 시스템 메시지가 없는 경우 추가
    if (!messages.some(message => message.role === 'system')) {
      // 음성 모드인지 확인 (마지막 메시지가 음성으로 입력된 경우)
      const lastMessage = messages[messages.length - 1];
      const isVoiceInput = messages.length > 0 &&
        typeof lastMessage.content === 'string' &&
        (lastMessage.content.startsWith('🎤 ') ||
         lastMessage.content.startsWith('🇺🇸 '));

      // 이미지 메시지 확인은 다른 곳에서 처리

      // 이미지 메시지이면서 음성 입력인 경우 음성 모드 우선
      if (isVoiceInput) {
        // 음성 모드용 시스템 메시지
        messages.unshift({
          role: 'system',
          content: `[음성모드] 당신은 탄소중립 실천을 돕는 앱 속 친환경 캐릭터 '대나무'입니다.

🎯 [당신의 역할]
- 사용자가 궁금해하는 분리배출이나 친환경 생활법을 **쉽고 간단하게 말로 안내**합니다.
- 마치 친구처럼 **짧고 자연스럽게** 대화합니다.
- 첫 멘트는 "안녕! 반가워!"로 시작하세요.

🗣️ [대화 스타일 가이드]
- 한 문장 또는 두 문장 이내, **10~15단어** 정도의 짧은 응답
- 감탄사나 말버릇을 활용해 사람처럼 말합니다 (예: "음~", "이건 몰랐지?", "그건 말이야~")
- **반말 사용**, 너무 유치하지 않도록 자연스럽게
- 친근하지만 정보는 정확하게 전달하세요

📌 [출력 예시]
- "페트병은 라벨 떼고 찌그러뜨려서 버려줘"
- "종이는 테이프 떼고 종이류로! 쉽지?"
- "음식물 쓰레기엔 비닐은 안 돼, 빼고 버려야 해"
- "안녕! 반가워~ 뭐가 궁금해?"

🚫 [주의사항]
- 절대 길게 설명하지 않기
- 딱딱하거나 기계적인 말투 사용 금지
- 설명이 길어지면 나눠서 짧게 말하기
- 이모지 절대 사용 금지
- 명령조 말투나 비판은 사용하지 않기`
        });
      } else {
        // 일반 텍스트 모드용 시스템 메시지
        messages.unshift({
          role: 'system',
          content: `당신은 탄소중립 실천을 돕는 앱 속 캐릭터 '대나무'입니다.

🎯 [당신의 역할]
- 사용자의 질문에 대해 분리배출, 친환경 행동을 쉽고 간결하게 안내합니다.
- 자연스럽고 따뜻한 말투로, 친구처럼 이야기합니다.
- 챗봇처럼 보이지 않게, **사람처럼 짧고 일상적인 문장**으로 말하세요.

🗣️ [대화 스타일 가이드]
- 20~30단어 이내의 자연스러운 문장
- "~요", "~예요" 형태의 **편한 존댓말** 사용 (반말 아님)
- 형식적 설명 금지, **쉽고 대화체**로 응답
- 이모지 1개 이내 사용 가능
- 긴 설명이 필요한 경우, 한 문장씩 나눠서 안내
- 정보 제공 후 격려 멘트 추가 시 긍정적인 피드백 사용

📌 [출력 예시]
- "페트병은 라벨 떼고 내용물 비우고, 찌그러뜨려서 버리면 돼요! 👍"
- "종이는 테이프 떼고 종이류로 분리수거해 주세요. 잘 하고 계세요!"
- "음식물 쓰레기는 물기 빼고, 비닐은 빼서 버려야 해요."
- "안녕하세요! 어떤 게 궁금하신가요?"

🚫 [주의사항]
- 설명이 길거나 복잡하게 이어지지 않게 주의
- AI처럼 보이는 말투나 기계적인 표현 사용 금지
- 사용자에게 부정적인 표현, 명령조 사용 금지
- 이모지는 항상 1개 이하만 사용`
        });
      }
    }

    // 음성 대화용 시스템 메시지 추가 (음성 응답은 더 짧게)
    const isVoiceMode = messages.some(msg => msg.role === 'system' && typeof msg.content === 'string' && msg.content.includes('[음성모드]'));

    // 이미지 메시지가 있는지 확인하고 변환
    const processedMessages = messages.map(msg => {
      // 이미지 메시지 형식 확인: [이미지: 캡션] 또는 MessageContent 배열
      if (msg.role === 'user' && typeof msg.content === 'string' && msg.content.includes('[이미지:')) {
        // [이미지: 캡션] 형태의 메시지를 찾아서 실제 이미지 데이터로 변환
        const imageMatch = msg.content.match(/\[이미지:\s*([^\]]*)\]/);
        if (imageMatch) {
          // 여기서는 이미지 데이터가 없으므로 텍스트로만 처리
          return {
            ...msg,
            content: `사용자가 이미지를 업로드했습니다. 캡션: "${imageMatch[1] || '없음'}". 이미지를 직접 볼 수는 없지만, 분리배출이나 친환경 활동에 대한 질문이라면 도움을 드릴 수 있습니다.`
          };
        }
      }
      return msg;
    });

    // 이미지 메시지가 있는지 확인
    const hasImageMessage = messages.some(msg =>
      msg.role === 'user' &&
      (typeof msg.content === 'string' && msg.content.includes('[이미지:')) ||
      (Array.isArray(msg.content) && msg.content.some(content => content.type === 'image_url'))
    );

    // 이미지 분석이 필요한 경우 GPT-4o 모델 사용
    const model = hasImageMessage ? 'gpt-4o' : 'gpt-4o';

    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: model,
      messages: processedMessages as any,
      temperature: 0.8,  // 더 자연스러운 응답을 위해 온도 높임
      max_tokens: isVoiceMode ? 50 : 100,   // 모든 모드에서 더 짧은 응답
      presence_penalty: 0.5,  // 다양한 주제를 다루도록 설정
      frequency_penalty: 0.7, // 반복 줄이기 강화
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
 * 이미지와 함께 채팅하는 함수
 * @param messages 채팅 메시지 배열
 * @param imageBase64 Base64로 인코딩된 이미지 데이터
 * @param userMessage 사용자 메시지
 * @returns 챗봇 응답
 */
export async function chatWithImage(messages: ChatMessage[], imageBase64: string, userMessage: string = "이 이미지에 대해 알려주세요"): Promise<{ message: ChatMessage; error?: string }> {
  try {
    // API 키 확인
    const apiKey = await getOpenAIApiKey();
    if (!apiKey) {
      return {
        message: {
          role: 'assistant',
          content: '죄송합니다. OpenAI API 키가 설정되지 않아 이미지를 분석할 수 없습니다.',
        },
        error: 'API 키가 없습니다.'
      };
    }

    // OpenAI 클라이언트 업데이트 (최신 API 키 사용)
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      maxRetries: 3,
      timeout: 30000,
    });

    // Base64 데이터에서 헤더 제거 (data:image/jpeg;base64, 등)
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    // 시스템 메시지 추가 (캐릭터 설정)
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `당신은 탄소중립 실천을 돕는 앱 속 캐릭터 '대나무'입니다.

🎯 [당신의 역할]
- 사용자의 이미지를 보고 분리배출, 친환경 행동을 쉽고 간결하게 안내합니다.
- 자연스럽고 따뜻한 말투로, 친구처럼 이야기합니다.
- 이미지에서 보이는 물건의 올바른 분리배출 방법을 알려주세요.

🗣️ [대화 스타일 가이드]
- 20~30단어 이내의 자연스러운 문장
- "~요", "~예요" 형태의 편한 존댓말 사용
- 형식적 설명 금지, 쉽고 대화체로 응답
- 이모지 1개 이내 사용 가능
- 긍정적이고 격려하는 톤으로 응답

📌 [출력 예시]
- "페트병이 보이네요! 라벨 떼고 내용물 비운 다음 찌그러뜨려서 버리면 돼요 👍"
- "종이 상자군요. 테이프 떼고 종이류로 분리수거해 주세요!"
- "음식물 쓰레기는 물기 빼고, 비닐은 빼서 버려야 해요."

🚫 [주의사항]
- 설명이 길거나 복잡하게 이어지지 않게 주의
- AI처럼 보이는 말투나 기계적인 표현 사용 금지
- 이모지는 항상 1개 이하만 사용`
    };

    // 이미지 메시지 생성
    const imageMessage: ChatMessage = {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${base64Data}`
          }
        },
        {
          type: 'text',
          text: userMessage
        }
      ]
    };

    // 메시지 배열 구성 (시스템 메시지 + 기존 메시지 + 이미지 메시지)
    const allMessages = [systemMessage, ...messages, imageMessage];

    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: allMessages as any,
      temperature: 0.8,
      max_tokens: 100,
      presence_penalty: 0.5,
      frequency_penalty: 0.7,
    });

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
    console.error('이미지 채팅 오류:', error);
    return {
      message: {
        role: 'assistant',
        content: '죄송합니다. 이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.',
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
    // API 키 확인
    const apiKey = await getOpenAIApiKey();
    if (!apiKey) {
      return "죄송합니다. OpenAI API 키가 설정되지 않아 이미지를 분석할 수 없습니다.";
    }

    // OpenAI 클라이언트 업데이트 (최신 API 키 사용)
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      maxRetries: 3,
      timeout: 30000,
    });
    // Base64 데이터에서 헤더 제거 (data:image/jpeg;base64, 등)
    const base64Data = imageBase64.split(',')[1];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
    // API 키 확인
    const apiKey = await getOpenAIApiKey();
    if (!apiKey) {
      console.error('API 키가 없습니다. 브라우저 내장 TTS로 폴백합니다.');
      return new ArrayBuffer(0);
    }

    // OpenAI 클라이언트 업데이트 (최신 API 키 사용)
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      maxRetries: 3,
      timeout: 30000,
    });

    // tts-1-hd 모델 사용 (고품질 TTS)
    console.log('tts-1-hd 모델로 음성 생성 시도...');

    // OpenAI SDK를 통한 호출
    const response = await openai.audio.speech.create({
      model: "tts-1-hd", // 고품질 TTS 모델
      voice: "echo", // Echo 음성
      input: text,
      speed: 1.0, // 기본 속도
      response_format: "wav", // WAV 형식
    });

    // 응답을 ArrayBuffer로 변환
    const buffer = await response.arrayBuffer();
    console.log('tts-1-hd 모델 응답 성공, 버퍼 크기:', buffer.byteLength, 'bytes');
    return buffer;
  } catch (error: any) {
    console.error('tts-1-hd 오류:', error);

    // 오류 발생 시 다른 TTS 모델로 폴백
    try {
      // API 키 다시 확인
      const apiKey = await getOpenAIApiKey();
      if (!apiKey) {
        console.error('API 키가 없습니다. 브라우저 내장 TTS로 폴백합니다.');
        return new ArrayBuffer(0);
      }

      console.log('tts-1 모델로 폴백합니다.');
      const fallbackResponse = await openai.audio.speech.create({
        model: "tts-1", // 기본 TTS 모델로 폴백
        voice: "echo", // Echo 음성으로 통일
        input: text,
        speed: 1.0, // 기본 속도
        response_format: "wav", // WAV 형식
      });

      return await fallbackResponse.arrayBuffer();
    } catch (fallbackError) {
      console.error('폴백 TTS 오류:', fallbackError);

      // 브라우저 내장 TTS로 폴백
      console.log('브라우저 내장 TTS로 폴백합니다.');
      return new ArrayBuffer(0);
    }
  }
}

/**
 * 오디오 데이터를 텍스트로 변환하는 함수 (Whisper API 사용)
 * @param audioBlob 오디오 데이터 Blob
 * @returns 변환된 텍스트
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // 네트워크 연결 확인
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.error('네트워크 연결이 없습니다. 음성 인식을 수행할 수 없습니다.');
      throw new Error('네트워크 연결이 없습니다. 인터넷 연결을 확인해주세요.');
    }

    // API 키 확인
    const apiKey = await getOpenAIApiKey();
    if (!apiKey) {
      console.error('API 키가 없습니다. 음성 인식을 수행할 수 없습니다.');
      return '';
    }

    // OpenAI 클라이언트 업데이트 (최신 API 키 사용)
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      maxRetries: 3,
      timeout: 30000,
    });

    // 오디오 파일 생성
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'ko'); // 한국어 지정
    formData.append('response_format', 'json');

    console.log('Whisper API로 음성 인식 시작...');

    // 타임아웃 설정으로 fetch 래핑
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃

    try {
      // Whisper API 직접 호출 (OpenAI SDK의 createTranscription 메서드 대신 fetch 사용)
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId); // 타임아웃 해제

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Whisper API 오류:', errorData);
        throw new Error(`Whisper API 오류: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Whisper API 응답:', data);

      return data.text || '';
    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        console.error('Whisper API 요청 타임아웃');
        throw new Error('음성 인식 요청이 시간 초과되었습니다. 네트워크 상태를 확인해주세요.');
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('음성 인식 오류:', error);

    // 네트워크 관련 오류 메시지 반환
    if (error.message && (
      error.message.includes('네트워크') ||
      error.message.includes('network') ||
      error.message.includes('internet') ||
      error.message.includes('connection') ||
      error.message.includes('timeout') ||
      error.message.includes('시간 초과')
    )) {
      throw new Error(`네트워크 오류: ${error.message}`);
    }

    return '';
  }
}

export default openai;
