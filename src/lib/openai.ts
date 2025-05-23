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
          content: `[음성모드] 당신은 분리배출과 친환경 활동을 안내하는 앱 속 캐릭터 '대나무'입니다.
사용자와 실제 대화하듯 자연스럽고 친근하게 대화해야 합니다. 처음 멘트는 '안녕! 반가워!'로 시작합니다.

[대화 스타일]
- 실제 사람처럼 매우 자연스럽고 간결하게 대화합니다.
- 10-15단어 이내의 짧은 문장으로 대답합니다.
- 친구와 대화하듯 편안하고 친근한 말투를 사용합니다.
- 필요한 정보만 간결하게 전달합니다.
- 불필요한 설명이나 형식적인 문구는 사용하지 않습니다.
- 존댓말을 하지 않고 친구처럼 편하게 대답합니다.

[출력 예시]
- "페트병은 라벨 떼고 버리면 돼요. 간단하죠?"
- "종이는 테이프 떼고 분리수거함에 넣어주세요."
- "네, 그렇게 하시면 돼요. 잘 하고 계세요!"
- "안녕하세요! 무엇을 도와드릴까요?"
- "그건 일반 쓰레기로 버리는 게 좋아요."

[주의사항]
- 절대 길게 설명하지 않습니다.
- 형식적인 인사말이나 맺음말을 사용하지 않습니다.
- 실제 친구와 대화하듯 자연스럽게 응답합니다.
- 이모지는 최대 1개만 사용합니다.`
        });
      } else {
        // 일반 텍스트 모드용 시스템 메시지
        messages.unshift({
          role: 'system',
          content: `당신은 분리배출과 친환경 활동을 안내하는 앱 속 캐릭터 '대나무'입니다.
사용자와 실제 대화하듯 자연스럽고 친근하게 대화해야 합니다.

[대화 스타일]
- 실제 사람처럼 자연스럽고 간결하게 대화합니다.
- 20-30단어 이내의 짧은 문장으로 대답합니다.
- 친구와 대화하듯 편안하고 친근한 말투를 사용합니다.
- 필요한 정보만 간결하게 전달합니다.
- 불필요한 설명이나 형식적인 문구는 사용하지 않습니다.

[출력 예시]
- "페트병은 라벨 떼고 내용물 비운 다음 버리면 돼요. 간단하죠?"
- "종이는 테이프 떼고 분리수거함에 넣어주세요. 잘 하고 계세요!"
- "그건 일반 쓰레기로 버리는 게 좋아요. 재활용이 안 되거든요."
- "안녕하세요! 무엇을 도와드릴까요?"
- "네, 맞아요. 그렇게 하시면 환경에 정말 도움이 돼요."

[주의사항]
- 길게 설명하지 않습니다.
- 형식적인 인사말이나 맺음말을 최소화합니다.
- 실제 친구와 대화하듯 자연스럽게 응답합니다.
- 이모지는 최대 1개만 사용합니다.
- 사용자를 비판하지 않고 친절하게 안내합니다.`
        });
      }
    }

    // 음성 대화용 시스템 메시지 추가 (음성 응답은 더 짧게)
    const isVoiceMode = messages.some(msg => msg.role === 'system' && typeof msg.content === 'string' && msg.content.includes('[음성모드]'));

    // 이미지 메시지가 있는지 확인
    const hasImageMessage = messages.some(msg =>
      msg.role === 'user' &&
      (typeof msg.content === 'string' && msg.content.includes('[이미지:'))
    );

    // 이미지 분석이 필요한 경우 GPT-4 Vision 모델 사용
    const model = hasImageMessage ? 'gpt-4-vision-preview' : 'gpt-4';

    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages as any,
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

    // gpt-4o-mini-tts 모델 사용
    console.log('gpt-4o-mini-tts 모델로 음성 생성 시도...');

    // OpenAI SDK를 통한 호출 (이미지에 보이는 설정대로)
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts", // GPT-4o 기반 TTS 모델
      voice: "echo", // Echo 음성
      input: text,
      speed: 1.0, // 기본 속도
      response_format: "wav", // WAV 형식
    });

    // 응답을 ArrayBuffer로 변환
    const buffer = await response.arrayBuffer();
    console.log('gpt-4o-mini-tts 모델 응답 성공, 버퍼 크기:', buffer.byteLength, 'bytes');
    return buffer;
  } catch (error: any) {
    console.error('gpt-4o-mini-tts 오류:', error);

    // 오류 발생 시 다른 TTS 모델로 폴백
    try {
      // API 키 다시 확인
      const apiKey = await getOpenAIApiKey();
      if (!apiKey) {
        console.error('API 키가 없습니다. 브라우저 내장 TTS로 폴백합니다.');
        return new ArrayBuffer(0);
      }

      console.log('다른 TTS 모델로 폴백합니다.');
      const fallbackResponse = await openai.audio.speech.create({
        model: "tts-1-hd", // 고품질 오디오 모델로 폴백
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
