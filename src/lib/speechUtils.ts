// 브라우저 음성 인식 API 타입 정의
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
  onend: () => void;
}

// 브라우저 음성 합성 API 타입 정의
interface SpeechSynthesisUtterance extends EventTarget {
  text: string;
  lang: string;
  voice: SpeechSynthesisVoice | null;
  volume: number;
  rate: number;
  pitch: number;
  onend: () => void;
  onerror: (event: any) => void;
}

interface SpeechSynthesisVoice {
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
}

// 음성 인식 결과 저장 타입
export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

// 음성 인식 초기화
export const initSpeechRecognition = (): SpeechRecognition | null => {
  if (typeof window === 'undefined') return null;

  // 브라우저 호환성 처리
  const SpeechRecognitionAPI = (window as any).SpeechRecognition ||
                              (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionAPI) {
    console.error('음성 인식이 이 브라우저에서 지원되지 않습니다.');
    return null;
  }

  const recognition = new SpeechRecognitionAPI() as SpeechRecognition;

  // 브라우저가 지원하는 언어 확인 (기본값은 한국어)
  try {
    recognition.lang = 'ko-KR';  // 한국어 설정 시도
  } catch (error) {
    console.warn('한국어 설정 중 오류 발생, 영어로 대체합니다:', error);
    recognition.lang = 'en-US';  // 영어로 대체
  }

  recognition.continuous = true;  // 연속 인식 모드 활성화
  recognition.interimResults = true;  // 중간 결과 활성화

  // 네트워크 오류 발생 시 자동 재시도 횟수 제한
  recognition.maxAlternatives = 1; // 대체 인식 결과 수 제한

  return recognition;
};

// 텍스트를 음성으로 변환 (OpenAI TTS API 사용)
export const speakText = async (text: string, onEnd?: () => void): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    // 현재 말하고 있는 것이 있다면 중지
    stopSpeaking();

    // OpenAI TTS API 호출을 위한 함수 가져오기
    const { textToSpeech } = await import('./openai');

    // OpenAI TTS API 호출
    const audioBuffer = await textToSpeech(text);

    // ArrayBuffer를 Blob으로 변환
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });

    // Blob URL 생성
    const url = URL.createObjectURL(blob);

    // 오디오 요소 생성 및 재생
    const audio = new Audio(url);

    // 재생 완료 이벤트 처리
    if (onEnd) {
      audio.onended = () => {
        // Blob URL 해제
        URL.revokeObjectURL(url);
        onEnd();
      };
    } else {
      audio.onended = () => {
        // Blob URL 해제
        URL.revokeObjectURL(url);
      };
    }

    // 오디오 재생
    await audio.play();
  } catch (error) {
    console.error('음성 합성 오류:', error);

    // 오류 발생 시 브라우저 내장 TTS로 폴백
    fallbackSpeakText(text, onEnd);
  }
};

// 브라우저 내장 TTS로 폴백 (OpenAI TTS 실패 시)
const fallbackSpeakText = (text: string, onEnd?: () => void): void => {
  if (typeof window === 'undefined') return;

  if (!('speechSynthesis' in window)) {
    console.error('음성 합성이 이 브라우저에서 지원되지 않습니다.');
    return;
  }

  // 현재 말하고 있는 것이 있다면 중지
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';  // 한국어 설정

  // 한국어 음성 찾기
  const voices = window.speechSynthesis.getVoices();
  const koreanVoice = voices.find(voice => voice.lang.includes('ko'));
  if (koreanVoice) {
    utterance.voice = koreanVoice;
  }

  // 음성 특성 설정
  utterance.rate = 1.0;  // 속도 (0.1 ~ 10)
  utterance.pitch = 1.0; // 음높이 (0 ~ 2)
  utterance.volume = 1.0; // 볼륨 (0 ~ 1)

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
};

// 음성 출력 중지
export const stopSpeaking = (): void => {
  if (typeof window === 'undefined') return;

  if (!('speechSynthesis' in window)) {
    console.error('음성 합성이 이 브라우저에서 지원되지 않습니다.');
    return;
  }

  window.speechSynthesis.cancel();
};

// 음성 인식 시작 (결과를 바로 처리하지 않고 반환)
export const startListening = (
  recognition: SpeechRecognition | null,
  onResult?: (result: SpeechRecognitionResult) => void,
  onError?: (error: any) => void,
  onEnd?: () => void
): void => {
  if (!recognition) return;

  // 음성 인식 결과 처리
  recognition.onresult = (event) => {
    // 가장 최근의 인식 결과 가져오기
    const lastResultIndex = event.results.length - 1;
    const transcript = event.results[lastResultIndex][0].transcript;
    const isFinal = event.results[lastResultIndex].isFinal;

    // 언어 태그 추가 (영어로 인식 중인 경우 표시)
    let processedTranscript = transcript;
    if (recognition.lang === 'en-US') {
      // 영어로 인식 중임을 표시하는 태그 추가 (UI에서 사용)
      processedTranscript = `[en] ${transcript}`;
    }

    // 모든 결과 처리 (최종 결과와 중간 결과 모두)
    if (onResult) {
      onResult({
        transcript: processedTranscript,
        isFinal: isFinal
      });
    }

    // 디버깅 로그
    console.log(`음성 인식 결과: "${processedTranscript}" (최종: ${isFinal})`);
  };

  // 오류 처리 개선
  recognition.onerror = (event) => {
    console.error('음성 인식 오류:', event.error);

    // 네트워크 오류 처리
    if (event.error === 'network') {
      console.warn('네트워크 연결 문제로 음성 인식이 중단되었습니다.');

      // 현재 인식 세션 중지
      try {
        recognition.abort();
      } catch (abortError) {
        console.error('음성 인식 중단 실패:', abortError);
      }

      // 오류 콜백 호출
      if (onError) {
        onError({
          ...event,
          additionalInfo: '네트워크 연결을 확인해주세요. 음성 인식이 중단되었습니다.'
        });
      }

      // 종료 콜백 호출
      if (onEnd) {
        onEnd();
      }

      return; // 여기서 함수 종료
    }

    // language-not-supported 오류 처리
    if (event.error === 'language-not-supported') {
      console.warn('한국어 음성 인식이 지원되지 않습니다. 다른 언어로 시도합니다.');

      // 현재 인식 세션 중지
      try {
        recognition.abort();
      } catch (abortError) {
        console.error('음성 인식 중단 실패:', abortError);
      }

      // 언어 변경
      recognition.lang = 'en-US'; // 영어로 시도

      // 약간의 지연 후 재시작 (브라우저가 이전 세션을 완전히 정리할 시간을 줌)
      setTimeout(() => {
        try {
          recognition.start();
          console.log('영어로 음성 인식 재시작');
          return; // 오류 콜백 호출하지 않고 리턴
        } catch (e) {
          console.error('대체 언어로 재시도 실패:', e);
          // 재시도 실패 시 오류 콜백 호출
          if (onError) {
            onError({...event, additionalInfo: '대체 언어 시도 실패'});
          }
        }
      }, 300);
      return; // 여기서 함수 종료
    }

    // 기타 오류 처리
    if (onError) {
      onError(event);
    }
  };

  // 음성 인식 종료 처리
  recognition.onend = () => {
    console.log('음성 인식 세션 종료됨');

    // 종료 콜백 호출 (자동 재시작 없음)
    if (onEnd) {
      onEnd();
    }
  };

  // 음성 인식 시작
  try {
    // 이미 실행 중인지 확인하는 방법이 없으므로 안전하게 처리
    try {
      // 먼저 abort로 모든 진행 중인 인식 세션 종료
      recognition.abort();
      console.log('기존 음성 인식 세션 중단');
    } catch (abortError) {
      // abort 실패는 무시 (이미 실행 중이 아닐 수 있음)
    }

    // 약간의 지연 후 시작 (브라우저가 이전 세션을 완전히 정리할 시간을 줌)
    setTimeout(() => {
      try {
        // 네트워크 연결 확인 (navigator.onLine은 완벽하지 않지만 기본적인 확인 가능)
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          console.error('네트워크 연결이 없습니다. 음성 인식을 시작할 수 없습니다.');
          if (onError) {
            onError({
              error: 'network',
              message: '네트워크 연결이 없습니다. 음성 인식을 시작할 수 없습니다.'
            });
          }
          if (onEnd) {
            onEnd();
          }
          return;
        }

        recognition.start();
        console.log('음성 인식 시작됨');
      } catch (startError: any) {
        console.error('음성 인식 시작 오류:', startError);

        // 이미 시작된 경우 처리
        if (startError.message && startError.message.includes('already started')) {
          console.warn('음성 인식이 이미 실행 중입니다. 재시작을 시도합니다.');
          try {
            recognition.abort();
            setTimeout(() => {
              recognition.start();
              console.log('음성 인식 재시작 성공');
            }, 300);
          } catch (restartError) {
            console.error('음성 인식 재시작 실패:', restartError);
            if (onError) {
              onError(restartError);
            }
          }
        } else if (onError) {
          onError(startError);
        }
      }
    }, 100);
  } catch (error) {
    console.error('음성 인식 초기화 오류:', error);
    if (onError) {
      onError(error);
    }
  }
};

// 음성 인식 중지
export const stopListening = (recognition: SpeechRecognition | null): void => {
  if (!recognition) return;

  try {
    // onend 이벤트 핸들러를 임시로 비활성화하여 자동 재시작 방지
    const originalOnEnd = recognition.onend;
    recognition.onend = () => {}; // 빈 함수로 설정

    // 음성 인식 중지 전에 네트워크 상태 확인
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.warn('네트워크 연결이 없습니다. 음성 인식을 강제 종료합니다.');
      try {
        // 강제 종료 시도
        recognition.abort();
      } catch (abortError) {
        console.error('음성 인식 강제 종료 실패:', abortError);
      }
    } else {
      // 정상적인 중지 시도
      recognition.stop();
      console.log('음성 인식 중지됨');
    }

    // 원래 onend 핸들러 복원 (필요한 경우)
    setTimeout(() => {
      if (originalOnEnd) {
        recognition.onend = originalOnEnd;
      }
    }, 100);
  } catch (error) {
    console.error('음성 인식 중지 오류:', error);

    // 오류 발생 시 강제 종료 시도
    try {
      recognition.abort();
      console.log('음성 인식 강제 종료됨');
    } catch (abortError) {
      console.error('음성 인식 강제 종료 실패:', abortError);
    }
  }
};

// 답변 길이 제한 함수
export const limitResponseLength = (text: string, maxWords: number = 30): string => {
  // 이모지 제거 (토큰 수 절약)
  const textWithoutEmoji = text.replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '');

  const words = textWithoutEmoji.split(' ');
  if (words.length <= maxWords) return textWithoutEmoji;

  // 문장 중간에 끊기지 않도록 마침표나 쉼표를 찾아 적절히 자름
  let truncated = words.slice(0, maxWords).join(' ');

  // 마지막 문장이 완성되지 않았다면 마침표 추가
  if (!truncated.endsWith('.') && !truncated.endsWith('?') && !truncated.endsWith('!')) {
    truncated += '...';
  }

  return truncated;
};
