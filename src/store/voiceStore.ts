import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  speakText,
  stopSpeaking
} from '@/lib/speechUtils';
import {
  startRecording,
  stopRecording,
  RecordingState,
  requestMicrophonePermission,
  convertAudioToText
} from '@/lib/recordingUtils';
import { transcribeAudio } from '@/lib/openai';

// 전역 타입 확장 (window.handleVoiceMessage 함수 정의)
declare global {
  interface Window {
    handleVoiceMessage?: (text: string) => void;
  }
}

// 음성 인식 상태 타입 정의
interface VoiceState {
  // 기본 상태
  isListening: boolean;
  isSpeaking: boolean;
  voiceMode: boolean;
  voiceEnabled: boolean; // 음성 기능 활성화 여부 (사용자 설정)
  recognizedText: string;
  finalRecognizedText: string; // 최종 인식 결과 (누적)

  // 음성 인식 객체 참조
  speechRecognition: any | null;

  // 오류 관리 상태
  errorCount: number; // 연속 오류 횟수
  lastErrorTime: number; // 마지막 오류 발생 시간
  hasNetworkError: boolean; // 네트워크 오류 발생 여부

  // 음성 인식 모드
  useWhisperAPI: boolean; // Whisper API 사용 여부

  // 녹음 상태
  recording: RecordingState; // 녹음 상태
  isProcessingAudio: boolean; // 오디오 처리 중 여부

  // 액션
  initialize: () => void;
  startVoiceRecognition: () => void; // 음성 인식 시작
  stopVoiceRecognition: () => string; // 음성 인식 중지 및 인식된 텍스트 반환
  toggleVoiceRecognition: () => void; // 음성 인식 시작/중지 토글
  stopSpeakingVoice: () => void;
  setVoiceMode: (active: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void; // 음성 기능 활성화/비활성화
  setRecognizedText: (text: string) => void;
  appendFinalText: (text: string) => void; // 최종 인식 결과 추가
  resetRecognizedText: () => void; // 인식 텍스트 초기화
  speakMessage: (content: string) => void;

  // 오류 관리 액션
  handleNetworkError: () => void;
  clearError: () => void;

  // OpenAI Whisper API 관련 액션
  setUseWhisperAPI: (use: boolean) => void; // Whisper API 사용 여부 설정
  startRecording: () => void; // 오디오 녹음 시작
  stopRecording: () => Promise<string>; // 오디오 녹음 중지 및 텍스트 변환
  toggleRecording: () => void; // 녹음 시작/중지 토글
}

export const useVoiceStore = create<VoiceState>()(
  devtools(
    persist(
      (set, get) => ({
        // 기본 상태 초기화
        isListening: false,
        isSpeaking: false,
        voiceMode: false,
        voiceEnabled: typeof window !== 'undefined' ? localStorage.getItem('voiceEnabled') !== 'false' : true, // 기본값은 true
        recognizedText: '',
        finalRecognizedText: '', // 최종 인식 결과 (누적)
        speechRecognition: null,

        // 오류 처리 관련 상태 초기화
        errorCount: 0,
        lastErrorTime: 0,
        hasNetworkError: false,

        // 녹음 관련 상태 초기화
        recording: {
          isRecording: false,
          audioBlob: undefined,
          audioUrl: undefined,
          error: undefined
        },
        isProcessingAudio: false,

  initialize: () => {
    if (typeof window === 'undefined') return;

    // 네트워크 상태 모니터링 설정 (비활성화)
    const handleOnline = () => {
      console.log('네트워크 연결 이벤트 감지 (무시됨)');
      // 네트워크 연결 이벤트 무시
    };

    const handleOffline = () => {
      console.log('네트워크 연결 끊김 이벤트 감지 (무시됨)');
      // 네트워크 연결 끊김 이벤트 무시
    };

    // 페이지 이동 시 음성 인식 세션 종료
    const handleBeforeUnload = () => {
      // 디버그 메시지를 console.debug로 변경하여 일반 사용자에게 표시되지 않도록 함
      console.debug('페이지 이동 감지: 음성 인식 세션 종료');
      if (get().isListening) {
        get().stopVoiceRecognition();
      }
    };

    // 이벤트 리스너 등록 (네트워크 이벤트는 비활성화)
    // window.addEventListener('online', handleOnline);
    // window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Next.js 라우터 이벤트 리스너 등록 (페이지 이동 감지)
    if (typeof window !== 'undefined') {
      try {
        // Pages Router (next/router) 이벤트 등록 시도
        import('next/router').then((router) => {
          // 라우터 변경 시작 이벤트에 커스텀 핸들러 등록
          router.default.events.on('routeChangeStart', (url: string) => {
            // 현재 URL과 이동할 URL이 다른 경우에만 처리
            const currentPath = window.location.pathname;
            const newPath = url.split('?')[0]; // 쿼리 파라미터 제거

            if (currentPath !== newPath) {
              console.debug('라우터 변경 감지:', currentPath, '->', newPath);

              // 음성 인식 중인 경우에만 종료 처리
              if (get().isListening) {
                console.debug('음성 인식 세션 종료 (페이지 이동)');
                get().stopVoiceRecognition();
              }
            }
          });

          console.log('Next.js Pages Router 이벤트 등록 성공');
        }).catch(err => {
          console.warn('Next.js Pages Router 이벤트 등록 실패:', err);
        });

        // App Router (next/navigation) 이벤트 등록 시도
        try {
          // App Router는 이벤트 시스템이 다르므로 다른 방식으로 처리
          // 현재 App Router에서는 직접적인 이벤트 리스너가 없어 MutationObserver 사용
          const observer = new MutationObserver((mutations) => {
            // URL 변경 감지 시 음성 인식 세션 종료
            // 실제 URL 변경이 있는 경우에만 처리하도록 개선
            const currentUrl = window.location.href;

            // 이전 URL과 현재 URL이 다른 경우에만 처리
            if ((window as any).__lastUrl && (window as any).__lastUrl !== currentUrl) {
              console.debug('실제 URL 변경 감지:', (window as any).__lastUrl, '->', currentUrl);

              // 음성 인식 중인 경우에만 종료 처리
              if (get().isListening) {
                console.debug('음성 인식 세션 종료 (페이지 이동)');
                get().stopVoiceRecognition();
              }
            }

            // 현재 URL 저장
            (window as any).__lastUrl = currentUrl;
          });

          // body 요소 관찰 시작 (페이지 변경 감지)
          // 관찰 범위를 줄여 불필요한 감지 최소화
          observer.observe(document.body, {
            childList: true,
            subtree: false,
            attributes: false
          });

          console.log('App Router 페이지 변경 감지 설정 완료');

          // 정리 함수에서 observer 해제하기 위해 전역 변수에 저장
          (window as any).__voiceStoreObserver = observer;
        } catch (appRouterError) {
          console.warn('App Router 페이지 변경 감지 설정 실패:', appRouterError);
        }
      } catch (error) {
        console.warn('Next.js 라우터 이벤트 등록 실패:', error);
      }
    }

    // 마이크 권한 확인
    requestMicrophonePermission().then(hasPermission => {
      if (hasPermission) {
        console.log('마이크 권한이 허용되었습니다.');
      } else {
        console.warn('마이크 권한이 거부되었습니다.');
        set({
          recognizedText: '마이크 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.',
          errorCount: get().errorCount + 1
        });

        // 3초 후 메시지 초기화
        setTimeout(() => {
          set({ recognizedText: '' });
        }, 3000);
      }
    }).catch(error => {
      console.error('마이크 권한 확인 오류:', error);
    });

    // 컴포넌트 언마운트 시 정리 함수 반환
    return () => {
      // 네트워크 이벤트 리스너는 비활성화됨
      // window.removeEventListener('online', handleOnline);
      // window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Next.js 라우터 이벤트 리스너 제거
      try {
        // Pages Router 이벤트 제거
        // 이벤트 핸들러가 익명 함수로 변경되어 제거가 어려우므로
        // 새로운 라우터 인스턴스에서는 이벤트가 자동으로 정리됨
        console.debug('Next.js Pages Router 이벤트는 자동으로 정리됩니다');

        // App Router MutationObserver 제거
        if (typeof window !== 'undefined' && (window as any).__voiceStoreObserver) {
          (window as any).__voiceStoreObserver.disconnect();
          delete (window as any).__voiceStoreObserver;
          console.log('App Router 페이지 변경 감지 해제 완료');
        }
      } catch (error) {
        console.warn('Next.js 라우터 이벤트 제거 실패:', error);
      }

      // 음성 인식 세션 종료
      if (get().isListening) {
        get().stopVoiceRecognition();
      }
    };
  },

  startVoiceRecognition: () => {
    // 음성 기능이 비활성화되어 있으면 아무 작업도 하지 않음
    if (!get().voiceEnabled) return;

    // 오류 횟수가 너무 많으면 일시적으로 비활성화
    const { errorCount, lastErrorTime } = get();
    const now = Date.now();
    const errorThreshold = 5; // 최대 오류 허용 횟수
    const errorTimeWindow = 60000; // 1분 내 오류 횟수 체크

    if (errorCount > errorThreshold && (now - lastErrorTime) < errorTimeWindow) {
      console.warn(`오류가 너무 많이 발생했습니다. (${errorCount}회) 잠시 후 다시 시도해주세요.`);
      set({
        recognizedText: '오류가 너무 많이 발생했습니다. 잠시 후 다시 시도해주세요.',
        errorCount: 0 // 오류 카운트 초기화
      });

      // 3초 후 메시지 초기화
      setTimeout(() => {
        set({ recognizedText: '' });
      }, 3000);

      return;
    }

    // 이미 녹음 중이면 중지
    if (get().recording.isRecording) {
      console.log('이미 녹음 중입니다. 중지합니다.');
      get().stopVoiceRecognition();
      return;
    }

    // 녹음 시작
    set({
      isListening: true,
      voiceMode: true,
      recognizedText: '말씀해주세요... (녹음 중)',
      finalRecognizedText: ''
    });

    try {
      // 녹음 시작 함수 호출
      startRecording((recordingState) => {
        // 녹음 상태 업데이트
        set({
          recording: recordingState,
          isListening: recordingState.isRecording
        });

        // 오류 처리
        if (recordingState.error) {
          console.error('녹음 오류:', recordingState.error);

          set({
            isListening: false,
            errorCount: get().errorCount + 1,
            lastErrorTime: Date.now(),
            recognizedText: `녹음 오류: ${recordingState.error}`
          });

          // 3초 후 메시지 초기화
          setTimeout(() => {
            set({ recognizedText: '' });
          }, 3000);
        }
      });
    } catch (error) {
      console.error('음성 인식 시작 오류:', error);
      set({ isListening: false });
    }
  },

  stopVoiceRecognition: () => {
    // 녹음 중이 아니면 빈 문자열 반환
    if (!get().recording.isRecording) return '';

    // 녹음 중지 전 상태 업데이트
    set({
      recognizedText: '녹음 처리 중...',
      isProcessingAudio: true
    });

    // 녹음 중지
    stopRecording((recordingState) => {
      set({
        recording: recordingState,
        isListening: false
      });
    });

    // 오디오 처리 결과 반환
    return ''; // 실제 텍스트는 stopRecording 후 별도로 처리
  },

  stopSpeakingVoice: () => {
    stopSpeaking();
    set({ isSpeaking: false });
  },

  setVoiceMode: (active) => {
    set({ voiceMode: active });
  },

  setVoiceEnabled: (enabled) => {
    // 로컬 스토리지에 설정 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('voiceEnabled', enabled.toString());
    }
    set({ voiceEnabled: enabled });
  },

  setRecognizedText: (text) => {
    set({ recognizedText: text });
  },

  appendFinalText: (text) => {
    const { finalRecognizedText } = get();
    // 공백 추가하여 텍스트 누적
    const newText = finalRecognizedText ? `${finalRecognizedText} ${text}` : text;
    set({ finalRecognizedText: newText });
  },

  resetRecognizedText: () => {
    set({ recognizedText: '', finalRecognizedText: '' });
  },

  speakMessage: (content) => {
    // 음성 기능이 비활성화되어 있으면 아무 작업도 하지 않음
    if (!get().voiceEnabled) return;

    set({ isSpeaking: true });
    speakText(content, () => {
      set({ isSpeaking: false });
    });
  },

  // OpenAI Whisper API 관련 메서드
  setUseWhisperAPI: (use) => {
    // 로컬 스토리지에 설정 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('useWhisperAPI', use.toString());
    }
    set({ useWhisperAPI: use });

    // Whisper API 사용 시 Web Speech API 중지
    if (use && get().isListening) {
      get().stopVoiceRecognition();
    }
  },

  startRecording: () => {
    // 음성 기능이 비활성화되어 있으면 아무 작업도 하지 않음
    if (!get().voiceEnabled) return;

    // 마이크 권한 확인
    requestMicrophonePermission().then(hasPermission => {
      if (!hasPermission) {
        set({
          recognizedText: '마이크 접근 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.'
        });

        // 3초 후 메시지 초기화
        setTimeout(() => {
          set({ recognizedText: '' });
        }, 3000);

        return;
      }

      // 녹음 시작
      startRecording((recordingState) => {
        set({
          recording: recordingState,
          recognizedText: recordingState.isRecording ? '말씀해주세요... (녹음 중)' : '',
          isListening: recordingState.isRecording
        });

        // 오류 처리
        if (recordingState.error) {
          set({
            recognizedText: `녹음 오류: ${recordingState.error}`,
            isListening: false
          });

          // 3초 후 메시지 초기화
          setTimeout(() => {
            set({ recognizedText: '' });
          }, 3000);
        }
      });
    });
  },

  stopRecording: async () => {
    // 녹음 중이 아니면 빈 문자열 반환
    if (!get().recording.isRecording) return '';

    // 녹음 중지 전 상태 업데이트
    set({ recognizedText: '녹음 처리 중...' });

    // 녹음 중지
    stopRecording((recordingState) => {
      set({
        recording: recordingState,
        isListening: false
      });
    });

    // 오디오 처리 중 상태로 설정
    set({ isProcessingAudio: true });

    try {
      // 네트워크 연결 확인
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        set({
          recognizedText: '네트워크 연결이 없습니다. 연결 상태를 확인해주세요.',
          isProcessingAudio: false,
          hasNetworkError: true
        });

        // 3초 후 메시지 초기화
        setTimeout(() => {
          set({ recognizedText: '', hasNetworkError: false });
        }, 3000);

        return '';
      }

      // 녹음된 오디오가 있는지 확인
      const audioBlob = get().recording.audioBlob;
      if (!audioBlob) {
        set({
          recognizedText: '녹음된 오디오가 없습니다.',
          isProcessingAudio: false
        });

        // 3초 후 메시지 초기화
        setTimeout(() => {
          set({ recognizedText: '' });
        }, 3000);

        return '';
      }

      // 상태 업데이트
      set({ recognizedText: 'OpenAI Whisper로 음성 인식 중...' });

      try {
        // Whisper API로 음성 인식
        const transcribedText = await transcribeAudio(audioBlob);

        // 인식 결과 처리
        if (transcribedText) {
          // 인식 결과 표시
          set({
            recognizedText: `인식된 텍스트: ${transcribedText}`,
            finalRecognizedText: transcribedText,
            isProcessingAudio: false,
            errorCount: 0 // 성공 시 오류 카운트 초기화
          });

          // 약간의 지연 후 상태 초기화 (UI 업데이트 시간 확보)
          setTimeout(() => {
            set({ recognizedText: '', finalRecognizedText: '' });
          }, 2000);

          return transcribedText;
        } else {
          // 인식 실패
          set({
            recognizedText: '음성 인식에 실패했습니다. 다시 시도해주세요.',
            isProcessingAudio: false
          });

          // 3초 후 메시지 초기화
          setTimeout(() => {
            set({ recognizedText: '' });
          }, 3000);

          return '';
        }
      } catch (apiError: any) {
        // 네트워크 관련 오류 처리
        if (apiError.message && (
          apiError.message.includes('네트워크') ||
          apiError.message.includes('network') ||
          apiError.message.includes('internet') ||
          apiError.message.includes('connection') ||
          apiError.message.includes('timeout') ||
          apiError.message.includes('시간 초과')
        )) {
          // 네트워크 오류 상태 업데이트
          set({
            recognizedText: `네트워크 오류: ${apiError.message}`,
            isProcessingAudio: false,
            hasNetworkError: true,
            errorCount: get().errorCount + 1
          });

          // 3초 후 메시지 초기화
          setTimeout(() => {
            set({ recognizedText: '' });
          }, 3000);

          return '';
        }

        // 기타 API 오류
        throw apiError;
      }
    } catch (error: any) {
      console.error('음성 인식 처리 오류:', error);

      // 오류 카운트 증가
      const newErrorCount = get().errorCount + 1;

      set({
        recognizedText: '음성 인식 처리 중 오류가 발생했습니다.',
        isProcessingAudio: false,
        errorCount: newErrorCount,
        lastErrorTime: Date.now()
      });

      // 3초 후 메시지 초기화
      setTimeout(() => {
        set({ recognizedText: '' });
      }, 3000);

      return '';
    }
  },

  toggleRecording: () => {
    // 음성 기능이 비활성화되어 있으면 아무 작업도 하지 않음
    if (!get().voiceEnabled) return;

    // 오디오 처리 중이면 무시
    if (get().isProcessingAudio) return;

    // 녹음 중이면 중지, 아니면 시작
    if (get().recording.isRecording) {
      get().stopRecording();
    } else {
      get().startRecording();
    }
  },

  // 음성 인식 토글 (녹음 시작/중지)
  toggleVoiceRecognition: () => {
    // 음성 기능이 비활성화되어 있으면 아무 작업도 하지 않음
    if (!get().voiceEnabled) return;

    // 오디오 처리 중이면 무시
    if (get().isProcessingAudio) return;

    const { recording } = get();
    if (recording.isRecording) {
      // 녹음 중지 및 텍스트 변환 처리
      get().stopVoiceRecognition();

      // 녹음된 오디오가 있는지 확인
      setTimeout(async () => {
        const audioBlob = get().recording.audioBlob;
        if (!audioBlob) {
          console.warn('녹음된 오디오가 없습니다.');
          set({
            isProcessingAudio: false,
            recognizedText: '녹음된 오디오가 없습니다.'
          });

          // 3초 후 메시지 초기화
          setTimeout(() => {
            set({ recognizedText: '' });
          }, 3000);

          return;
        }

        try {
          // 상태 업데이트
          set({ recognizedText: '음성을 텍스트로 변환 중...' });

          // 오디오를 텍스트로 변환
          const transcribedText = await convertAudioToText(audioBlob);

          if (transcribedText) {
            // 인식 결과 표시
            set({
              recognizedText: `인식된 텍스트: ${transcribedText}`,
              finalRecognizedText: transcribedText,
              isProcessingAudio: false
            });

            // 약간의 지연 후 상태 초기화 (UI 업데이트 시간 확보)
            setTimeout(() => {
              set({ recognizedText: '', finalRecognizedText: '' });
            }, 2000);

            // 인식된 텍스트로 메시지 생성
            const formattedText = `🎤 ${transcribedText}`;

            // 채팅 메시지 전송 (외부 함수에서 처리)
            if (window.handleVoiceMessage && typeof window.handleVoiceMessage === 'function') {
              window.handleVoiceMessage(formattedText);
            }
          } else {
            // 인식 실패
            set({
              recognizedText: '음성 인식에 실패했습니다. 다시 시도해주세요.',
              isProcessingAudio: false
            });

            // 3초 후 메시지 초기화
            setTimeout(() => {
              set({ recognizedText: '' });
            }, 3000);
          }
        } catch (error) {
          console.error('음성 인식 처리 오류:', error);

          set({
            recognizedText: '음성 인식 처리 중 오류가 발생했습니다.',
            isProcessingAudio: false,
            errorCount: get().errorCount + 1,
            lastErrorTime: Date.now()
          });

          // 3초 후 메시지 초기화
          setTimeout(() => {
            set({ recognizedText: '' });
          }, 3000);
        }
      }, 500);
    } else {
      // 녹음 시작
      get().startVoiceRecognition();
    }
  },

  // 네트워크 오류 처리 (완화된 버전)
  handleNetworkError: () => {
    console.log('네트워크 오류 처리 함수 호출됨 (무시됨)');

    // 네트워크 오류 처리 비활성화 - 오류 카운트만 증가시키고 실제 동작은 하지 않음
    const { errorCount } = get();
    set({
      errorCount: errorCount + 1,
      lastErrorTime: Date.now()
    });

    // 메시지 표시하지 않음 (네트워크 오류 무시)
  },

  // 새로 추가된 함수: 오류 상태 초기화
  clearError: () => {
    set({
      errorCount: 0,
      hasNetworkError: false,
      recognizedText: ''
    });
  }
      }),
      {
        name: 'voice-recognition-storage',
        partialize: (state) => ({
          voiceEnabled: state.voiceEnabled,
          useWhisperAPI: state.useWhisperAPI
        })
      }
    )
  )
);
