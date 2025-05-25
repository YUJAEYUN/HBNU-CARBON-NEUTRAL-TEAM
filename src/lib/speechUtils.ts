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

// 네트워크 연결 확인 함수
export const checkNetworkConnection = (): boolean => {
  // 항상 네트워크 연결이 있다고 가정 (네트워크 확인 로직 비활성화)
  return true;
};

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

  // 이전에 생성된 인스턴스가 있는지 확인하고 정리
  if (typeof window !== 'undefined' && (window as any).__speechRecognitionInstance) {
    try {
      const oldInstance = (window as any).__speechRecognitionInstance;
      oldInstance.onend = null; // 이벤트 핸들러 제거
      oldInstance.onerror = null; // 이벤트 핸들러 제거
      oldInstance.onresult = null; // 이벤트 핸들러 제거

      try {
        oldInstance.abort();
      } catch (abortError) {
        // 이미 종료된 경우 무시
      }

      console.debug('이전 음성 인식 인스턴스 정리됨');
      delete (window as any).__speechRecognitionInstance;
    } catch (e) {
      console.debug('이전 음성 인식 인스턴스 정리 실패:', e);
    }
  }

  try {
    const recognition = new SpeechRecognitionAPI() as SpeechRecognition;

    // 전역 변수에 인스턴스 저장 (나중에 정리하기 위해)
    if (typeof window !== 'undefined') {
      (window as any).__speechRecognitionInstance = recognition;
    }

    // 브라우저가 지원하는 언어 설정
    try {
      recognition.lang = 'ko-KR';  // 한국어 설정 시도
    } catch (error) {
      console.debug('한국어 설정 중 오류 발생, 영어로 대체합니다');
      try {
        recognition.lang = 'en-US';  // 영어로 대체
      } catch (langError) {
        console.debug('언어 설정 실패, 기본 언어 사용');
      }
    }

    // 기본 설정
    try {
      // 연속 인식 모드 비활성화 (안정성 향상)
      recognition.continuous = false;
      // 중간 결과 활성화 (실시간 피드백)
      recognition.interimResults = true;
    } catch (settingError) {
      console.debug('기본 설정 적용 실패');
    }

    // 추가 설정 (가능한 경우)
    try {
      // 대체 인식 결과 수 제한
      (recognition as any).maxAlternatives = 1;
    } catch (e) {
      // 지원하지 않는 브라우저는 무시
    }

    return recognition;
  } catch (initError) {
    console.error('음성 인식 객체 생성 실패:', initError);
    return null;
  }
};

// 텍스트를 음성으로 변환 (OpenAI TTS API 사용)
export const speakText = async (text: string, onEnd?: () => void): Promise<void> => {
  if (typeof window === 'undefined') return;

  // 네트워크 연결 확인
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.warn('네트워크 연결이 없습니다. 브라우저 내장 TTS를 사용합니다.');
    fallbackSpeakText(text, onEnd);
    return;
  }

  try {
    // 현재 말하고 있는 것이 있다면 중지
    stopSpeaking();

    // OpenAI TTS API 호출을 위한 함수 가져오기
    const { textToSpeech } = await import('./openai');

    // OpenAI TTS API 호출
    const audioBuffer = await textToSpeech(text);

    // 빈 버퍼가 반환된 경우 (OpenAI API 오류 발생)
    if (audioBuffer.byteLength === 0) {
      console.warn('OpenAI TTS API에서 빈 응답을 받았습니다. 브라우저 내장 TTS로 폴백합니다.');
      fallbackSpeakText(text, onEnd);
      return;
    }

    // 오디오 버퍼가 비어있는지 확인
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      console.warn('빈 오디오 버퍼가 반환되었습니다. 브라우저 내장 TTS로 폴백합니다.');
      fallbackSpeakText(text, onEnd);
      return;
    }

    console.log('오디오 버퍼 크기:', audioBuffer.byteLength, 'bytes');

    // ArrayBuffer를 Blob으로 변환 (gpt-4o-mini-tts는 WAV 형식으로 반환)
    const blob = new Blob([audioBuffer], { type: 'audio/wav' });

    // Blob URL 생성
    const url = URL.createObjectURL(blob);

    // 오디오 요소 생성 및 재생
    const audio = new Audio(url);

    // 오디오 로드 오류 처리
    audio.onerror = (e) => {
      console.error('오디오 로드 오류:', e);
      URL.revokeObjectURL(url);
      fallbackSpeakText(text, onEnd);
    };

    // 오디오 로드 완료 이벤트
    audio.onloadeddata = () => {
      console.log('오디오 로드 완료, 길이:', audio.duration, '초');
      console.log('gpt-4o-mini-tts 모델 음성 재생 중...');
    };

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

    // 오디오 재생 시도
    try {
      await audio.play();
    } catch (playError) {
      console.error('오디오 재생 오류:', playError);
      URL.revokeObjectURL(url);
      fallbackSpeakText(text, onEnd);
    }
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

  // 감정 표현을 위한 텍스트 전처리
  const processedText = addEmotionalMarkers(text);

  const utterance = new SpeechSynthesisUtterance(processedText);
  utterance.lang = 'ko-KR';  // 한국어 설정

  // 음성 목록 가져오기 (비동기 처리)
  let voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    // 음성이 아직 로드되지 않은 경우 이벤트 리스너 추가
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      setVoiceAndSpeak();
    };
  } else {
    setVoiceAndSpeak();
  }

  function setVoiceAndSpeak() {
    // 최적의 음성 선택 (여성 음성 우선)
    const preferredVoices = [
      // 한국어 음성 (있는 경우)
      voices.find(voice => voice.lang === 'ko-KR' && voice.name.includes('Female')),
      voices.find(voice => voice.lang === 'ko-KR'),
      // 영어 음성 (한국어가 없는 경우)
      voices.find(voice => voice.name.includes('Samantha')), // macOS 여성 음성
      voices.find(voice => voice.name.includes('Google') && voice.name.includes('Female')),
      voices.find(voice => voice.name.includes('Female')),
      // 기본 음성
      voices[0]
    ];

    // 사용 가능한 첫 번째 음성 선택
    const selectedVoice = preferredVoices.find(voice => voice !== undefined);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // 음성 특성 설정 (더 감정적인 표현을 위해 조정)
    utterance.rate = 1.1;    // 약간 빠른 속도
    utterance.pitch = 1.15;  // 약간 높은 음높이 (더 친근한 느낌)
    utterance.volume = 1.0;  // 최대 볼륨

    // 종료 이벤트 처리
    if (onEnd) {
      utterance.onend = onEnd;
    }

    // 음성 합성 시작
    window.speechSynthesis.speak(utterance);
  }
};

// 텍스트에 감정 표현을 위한 마커 추가
const addEmotionalMarkers = (text: string): string => {
  // 문장 끝에 따라 감정 표현 조정
  if (text.endsWith('?')) {
    // 질문은 높은 톤으로 끝나도록
    return text.replace(/\?$/, '??');
  } else if (text.endsWith('!')) {
    // 감탄은 강조
    return text.replace(/\!$/, '!!');
  } else if (text.includes('안녕') || text.includes('반가워')) {
    // 인사말은 친근하게
    return text + ' :)';
  }

  return text;
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
  if (!recognition) {
    if (onError) {
      onError({ error: 'recognition-not-initialized', message: '음성 인식 객체가 초기화되지 않았습니다.' });
    }
    return;
  }

  // 네트워크 연결 확인
  if (!checkNetworkConnection()) {
    if (onError) {
      onError({ error: 'network-error', message: '네트워크 연결이 없습니다. 음성 인식을 시작할 수 없습니다.' });
    }
    return;
  }

  // 음성 인식 결과 처리
  recognition.onresult = (event) => {
    try {
      // 이벤트 객체 유효성 검사
      if (!event || !event.results || event.results.length === 0) {
        console.debug('음성 인식 결과가 비어있습니다');
        return;
      }

      // 가장 최근의 인식 결과 가져오기
      const lastResultIndex = event.results.length - 1;

      // 결과 배열 유효성 검사
      if (!event.results[lastResultIndex] || event.results[lastResultIndex].length === 0) {
        console.debug('음성 인식 결과 배열이 비어있습니다');
        return;
      }

      // 트랜스크립트와 최종 여부 추출
      const transcript = event.results[lastResultIndex][0].transcript || '';
      const isFinal = !!event.results[lastResultIndex].isFinal;

      // 빈 결과 무시
      if (!transcript.trim()) {
        return;
      }

      // 언어 태그 추가 (영어로 인식 중인 경우 표시)
      let processedTranscript = transcript;
      if (recognition.lang === 'en-US') {
        // 영어로 인식 중임을 표시하는 태그 추가 (UI에서 사용)
        processedTranscript = `[en] ${transcript}`;
      }

      // 결과 콜백 호출
      if (onResult) {
        onResult({
          transcript: processedTranscript,
          isFinal: isFinal
        });
      }

      // 디버깅 로그 (최종 결과만 자세히 로깅)
      if (isFinal) {
        console.debug(`음성 인식 최종 결과: "${processedTranscript}"`);
      } else {
        console.debug('음성 인식 중간 결과 수신됨');
      }
    } catch (error) {
      console.debug('음성 인식 결과 처리 중 오류 발생');

      // 오류가 발생해도 인식 세션은 계속 유지
    }
  };

  // 오류 처리 개선
  recognition.onerror = (event) => {
    // 오류 객체 안전하게 처리
    if (!event) {
      console.debug('음성 인식 오류: 오류 객체가 없습니다');

      // 기본 오류 객체 생성
      if (onError) {
        onError({
          error: 'unknown-error',
          message: '알 수 없는 오류가 발생했습니다'
        });
      }
      return;
    }

    // 오류 유형 추출
    const errorType = event.error || '알 수 없는 오류';
    console.debug('음성 인식 오류 발생:', errorType);

    // 오류 유형별 처리
    switch (errorType) {
      case 'network':
        // 네트워크 오류 처리
        console.debug('네트워크 연결 문제로 음성 인식이 중단되었습니다');

        try {
          // 현재 세션 안전하게 종료
          recognition.abort();
        } catch (abortError) {
          // 이미 종료된 경우 무시
        }

        // 사용자 친화적인 오류 메시지 전달
        if (onError) {
          onError({
            error: 'network',
            message: '네트워크 연결을 확인해주세요',
            isTrusted: true
          });
        }
        break;

      case 'language-not-supported':
        // 언어 지원 오류 처리
        console.debug('현재 언어가 지원되지 않아 영어로 전환합니다');

        try {
          // 현재 세션 종료
          recognition.abort();

          // 언어 변경
          recognition.lang = 'en-US';

          // 약간의 지연 후 재시작
          setTimeout(() => {
            try {
              recognition.start();
              console.debug('영어로 음성 인식 재시작됨');

              // 사용자에게 언어 변경 알림
              if (onError) {
                onError({
                  error: 'language-changed',
                  message: '한국어가 지원되지 않아 영어로 전환되었습니다',
                  isTrusted: true
                });
              }
            } catch (restartError) {
              console.debug('언어 변경 후 재시작 실패');

              if (onError) {
                onError({
                  error: 'restart-failed',
                  message: '음성 인식 재시작에 실패했습니다',
                  isTrusted: true
                });
              }

              // 종료 콜백 호출
              if (onEnd) {
                onEnd();
              }
            }
          }, 300);
        } catch (error) {
          console.debug('언어 변경 실패');

          if (onError) {
            onError({
              error: 'language-change-failed',
              message: '언어 변경에 실패했습니다',
              isTrusted: true
            });
          }

          // 종료 콜백 호출
          if (onEnd) {
            onEnd();
          }
        }
        break;

      case 'no-speech':
        // 음성 감지 실패 처리
        console.debug('음성이 감지되지 않았습니다');

        if (onError) {
          onError({
            error: 'no-speech',
            message: '음성이 감지되지 않았습니다. 다시 말씀해주세요',
            isTrusted: true
          });
        }
        break;

      case 'aborted':
        // 사용자 또는 시스템에 의한 중단
        console.debug('음성 인식이 중단되었습니다');

        if (onError) {
          onError({
            error: 'aborted',
            message: '음성 인식이 중단되었습니다',
            isTrusted: true
          });
        }
        break;

      default:
        // 기타 오류 처리
        console.debug(`알 수 없는 음성 인식 오류: ${errorType}`);

        if (onError) {
          onError({
            error: errorType,
            message: '음성 인식 중 오류가 발생했습니다',
            originalEvent: event,
            isTrusted: true
          });
        }
        break;
    }

    // no-speech 오류는 자동으로 종료되지 않으므로 종료 콜백 호출하지 않음
    if (errorType !== 'no-speech' && onEnd) {
      onEnd();
    }
  };

  // 음성 인식 종료 처리
  recognition.onend = () => {
    // 디버그 메시지로 변경하여 일반 사용자에게 표시되지 않도록 함
    console.debug('음성 인식 세션 종료됨');

    // 종료 콜백 호출 (자동 재시작 없음)
    if (onEnd) {
      onEnd();
    }

    // 명시적으로 종료 상태 유지 (자동 재시작 방지)
    try {
      recognition.abort();
    } catch (error) {
      // 이미 종료된 경우 무시
    }
  };

  // 음성 인식 시작
  try {
    // 안전하게 이전 세션 종료
    try {
      // 이벤트 핸들러 임시 제거 (종료 이벤트 방지)
      const originalOnEnd = recognition.onend;
      recognition.onend = () => {}; // 빈 함수로 설정

      // 기존 세션 종료 시도
      recognition.abort();
      console.debug('기존 음성 인식 세션 정리');

      // 이벤트 핸들러 복원
      setTimeout(() => {
        recognition.onend = originalOnEnd;
      }, 50);
    } catch (abortError) {
      // 이미 종료된 경우 무시
    }

    // 약간의 지연 후 시작 (브라우저가 이전 세션을 완전히 정리할 시간을 줌)
    setTimeout(() => {
      try {
        // 음성 인식 시작 전 상태 확인
        let isStarting = true;

        // 시작 타임아웃 설정 (5초 후 자동 종료)
        const startTimeout = setTimeout(() => {
          if (isStarting) {
            console.debug('음성 인식 시작 타임아웃');
            isStarting = false;

            // 오류 콜백 호출
            if (onError) {
              onError({
                error: 'start-timeout',
                message: '음성 인식 시작 시간이 초과되었습니다.'
              });
            }

            // 종료 콜백 호출
            if (onEnd) {
              onEnd();
            }
          }
        }, 5000);

        // 음성 인식 시작
        recognition.start();
        console.debug('음성 인식 시작됨');

        // 시작 성공 시 타임아웃 해제
        isStarting = false;
        clearTimeout(startTimeout);
      } catch (startError: any) {
        // 오류 정보 추출
        const errorMessage = startError.message || '알 수 없는 오류';
        console.debug('음성 인식 시작 오류:', errorMessage);

        // 이미 시작된 경우 처리
        if (errorMessage.includes('already started')) {
          console.debug('음성 인식이 이미 실행 중입니다');

          // 재시작 시도
          try {
            // 현재 세션 종료
            recognition.abort();

            // 약간의 지연 후 다시 시작
            setTimeout(() => {
              try {
                recognition.start();
                console.debug('음성 인식 재시작 성공');
              } catch (restartError) {
                console.debug('음성 인식 재시작 실패');

                // 오류 콜백 호출
                if (onError) {
                  onError({
                    error: 'restart-failed',
                    message: '음성 인식 재시작에 실패했습니다.'
                  });
                }

                // 종료 콜백 호출
                if (onEnd) {
                  onEnd();
                }
              }
            }, 500);
          } catch (abortError) {
            console.debug('음성 인식 세션 종료 실패');

            // 오류 콜백 호출
            if (onError) {
              onError({
                error: 'abort-failed',
                message: '음성 인식 세션 종료에 실패했습니다.'
              });
            }

            // 종료 콜백 호출
            if (onEnd) {
              onEnd();
            }
          }
        } else {
          // 기타 시작 오류 처리
          if (onError) {
            onError({
              error: 'start-error',
              message: errorMessage
            });
          }

          // 종료 콜백 호출
          if (onEnd) {
            onEnd();
          }
        }
      }
    }, 100); // 지연 시간 (100ms)
  } catch (error) {
    console.debug('음성 인식 초기화 오류');

    // 오류 콜백 호출
    if (onError) {
      onError({
        error: 'init-error',
        message: '음성 인식 초기화에 실패했습니다.'
      });
    }

    // 종료 콜백 호출
    if (onEnd) {
      onEnd();
    }
  }
};

// 음성 인식 중지
export const stopListening = (recognition: SpeechRecognition | null): void => {
  if (!recognition) return;

  try {
    // 이벤트 핸들러 임시 비활성화
    const originalHandlers = {
      onend: recognition.onend,
      onerror: recognition.onerror
    };

    // 빈 핸들러로 설정하여 이벤트 무시
    recognition.onend = () => {};
    recognition.onerror = () => {};

    // 중지 시도
    try {
      // 정상적인 중지 시도
      recognition.stop();
      console.debug('음성 인식 중지 요청됨');
    } catch (stopError) {
      console.debug('음성 인식 중지 실패, 강제 종료 시도');

      // 중지 실패 시 강제 종료
      try {
        recognition.abort();
        console.debug('음성 인식 강제 종료됨');
      } catch (abortError) {
        console.debug('음성 인식 강제 종료 실패');
      }
    }

    // 원래 이벤트 핸들러 복원 (약간의 지연 후)
    setTimeout(() => {
      try {
        if (originalHandlers.onend) {
          recognition.onend = originalHandlers.onend;
        }
        if (originalHandlers.onerror) {
          recognition.onerror = originalHandlers.onerror;
        }
      } catch (restoreError) {
        console.debug('이벤트 핸들러 복원 실패');
      }
    }, 200);
  } catch (error) {
    console.debug('음성 인식 중지 중 예상치 못한 오류 발생');

    // 최후의 수단으로 인스턴스 재설정 시도
    if (typeof window !== 'undefined' && (window as any).__speechRecognitionInstance) {
      try {
        delete (window as any).__speechRecognitionInstance;
        console.debug('음성 인식 인스턴스 강제 제거됨');
      } catch (resetError) {
        console.debug('음성 인식 인스턴스 제거 실패');
      }
    }
  }
};

// 답변 길이 제한 함수
export const limitResponseLength = (text: string, maxWords: number = 30): string => {
  // 이모지 제거 (토큰 수 절약) - ES5 호환 정규식 사용
  const textWithoutEmoji = text.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');

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
