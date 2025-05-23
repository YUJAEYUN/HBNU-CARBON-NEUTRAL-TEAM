import { create } from 'zustand';
import {
  initSpeechRecognition,
  startListening,
  stopListening,
  speakText,
  stopSpeaking
} from '@/lib/speechUtils';

interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  voiceMode: boolean;
  voiceEnabled: boolean; // 음성 기능 활성화 여부 (사용자 설정)
  recognizedText: string;
  finalRecognizedText: string; // 최종 인식 결과 (누적)
  speechRecognition: any;

  // 액션
  initialize: () => void;
  startVoiceRecognition: () => void; // 음성 인식 시작만 담당
  stopVoiceRecognition: () => string; // 음성 인식 중지 및 인식된 텍스트 반환
  stopSpeakingVoice: () => void;
  setVoiceMode: (active: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void; // 음성 기능 활성화/비활성화
  setRecognizedText: (text: string) => void;
  appendFinalText: (text: string) => void; // 최종 인식 결과 추가
  resetRecognizedText: () => void; // 인식 텍스트 초기화
  speakMessage: (content: string) => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  isListening: false,
  isSpeaking: false,
  voiceMode: false,
  voiceEnabled: typeof window !== 'undefined' ? localStorage.getItem('voiceEnabled') !== 'false' : true, // 기본값은 true, 로컬 스토리지에서 가져옴
  recognizedText: '',
  finalRecognizedText: '', // 최종 인식 결과 (누적)
  speechRecognition: null,

  initialize: () => {
    if (typeof window !== 'undefined') {
      const recognition = initSpeechRecognition();
      set({ speechRecognition: recognition });
    }
  },

  startVoiceRecognition: () => {
    // 음성 기능이 비활성화되어 있으면 아무 작업도 하지 않음
    if (!get().voiceEnabled) return;

    // 네트워크 연결 확인 (기본적인 확인)
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.error('네트워크 연결이 없습니다. 음성 인식을 시작할 수 없습니다.');
      set({
        recognizedText: '네트워크 연결이 없습니다. 연결 상태를 확인해주세요.',
        isListening: false
      });

      // 3초 후 메시지 초기화
      setTimeout(() => {
        set({ recognizedText: '' });
      }, 3000);

      return;
    }

    const { speechRecognition, isListening } = get();
    if (!speechRecognition) {
      console.warn('음성 인식 객체가 초기화되지 않았습니다. 다시 초기화합니다.');
      // 음성 인식 객체 재초기화 시도
      const newRecognition = initSpeechRecognition();
      if (!newRecognition) {
        console.error('음성 인식 초기화 실패');
        set({ recognizedText: '음성 인식 초기화에 실패했습니다. 브라우저 지원 여부를 확인해주세요.' });

        // 3초 후 메시지 초기화
        setTimeout(() => {
          set({ recognizedText: '' });
        }, 3000);

        return;
      }
      set({ speechRecognition: newRecognition });
    }

    // 이미 음성 인식 중이면 중지 후 재시작
    if (isListening) {
      console.log('이미 음성 인식 중입니다. 중지 후 재시작합니다.');
      stopListening(get().speechRecognition);
      // 약간의 지연 후 재시작
      setTimeout(() => {
        get().startVoiceRecognition();
      }, 300);
      return;
    }

    // 음성 인식 시작
    set({ isListening: true, voiceMode: true, recognizedText: '', finalRecognizedText: '' });

    try {
      startListening(
        get().speechRecognition, // 최신 객체 사용
        // 음성 인식 결과 처리
        (result) => {
          // 현재 인식 중인 텍스트 업데이트 (UI 표시용)
          set({ recognizedText: result.transcript });

          // 최종 결과인 경우 누적 텍스트에 추가
          if (result.isFinal) {
            const cleanText = result.transcript.replace('[en] ', '');
            get().appendFinalText(cleanText);
          }
        },
        // 오류 처리
        (error) => {
          console.error('음성 인식 오류:', error);

          // 오류 발생 시 상태 업데이트
          if (error.error === 'language-not-supported') {
            // 이 오류는 speechUtils.ts에서 처리됨
            console.warn('한국어 음성 인식이 지원되지 않아 영어로 시도합니다.');
            // 상태는 유지 (영어로 재시도 중)
          } else if (error.error === 'network') {
            console.error('네트워크 오류로 음성 인식 실패');
            // 네트워크 오류 발생 시 음성 인식 중지
            set({
              isListening: false,
              recognizedText: '네트워크 오류가 발생했습니다. 연결을 확인해주세요.'
            });

            // 3초 후 메시지 초기화
            setTimeout(() => {
              set({ recognizedText: '' });
            }, 3000);

            // 네트워크 오류 시 자동 재시도하지 않음 (무한 루프 방지)
          } else if (error.error === 'no-speech') {
            console.warn('음성이 감지되지 않았습니다.');
            // 상태 유지 (계속 듣는 중)
          } else {
            console.error('알 수 없는 음성 인식 오류:', error);
            set({ isListening: false });
          }
        },
        // 음성 인식 종료 처리
        () => {
          console.log('음성 인식 세션 종료됨');
          // 자동으로 종료되지 않도록 수정 (사용자가 명시적으로 중지해야 함)
          // 하지만 종료된 경우 재시작
          const { isListening } = get();
          if (isListening) {
            console.log('음성 인식이 종료되었지만 여전히 활성화 상태입니다. 재시작합니다.');
            setTimeout(() => {
              get().startVoiceRecognition();
            }, 300);
          }
        }
      );
    } catch (error) {
      console.error('음성 인식 시작 오류:', error);
      set({ isListening: false });
    }
  },

  stopVoiceRecognition: () => {
    const { speechRecognition, finalRecognizedText } = get();
    if (!speechRecognition) return '';

    stopListening(speechRecognition);
    set({ isListening: false });

    // 누적된 최종 텍스트 반환 (없으면 현재 인식 중인 텍스트 사용)
    const textToReturn = finalRecognizedText || get().recognizedText;

    // 디버깅 로그
    console.log(`음성 인식 최종 결과: "${textToReturn}"`);

    // 약간의 지연 후 상태 초기화 (UI 업데이트 시간 확보)
    setTimeout(() => {
      set({ recognizedText: '', finalRecognizedText: '' });
    }, 500);

    return textToReturn;
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
  }
}));
