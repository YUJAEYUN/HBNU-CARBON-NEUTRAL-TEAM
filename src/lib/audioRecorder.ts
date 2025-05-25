/**
 * 브라우저에서 오디오 녹음을 처리하는 유틸리티
 * OpenAI Whisper API와 함께 사용하기 위한 오디오 녹음 기능
 */

// 녹음 상태 타입
export interface RecordingState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioURL: string | null;
  error: string | null;
}

// 녹음 초기 상태
export const initialRecordingState: RecordingState = {
  isRecording: false,
  audioBlob: null,
  audioURL: null,
  error: null,
};

// MediaRecorder 인스턴스와 오디오 청크를 저장할 변수
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

/**
 * 마이크 접근 권한 요청 및 확인
 * @returns 마이크 접근 가능 여부
 */
export const requestMicrophonePermission = async (): Promise<boolean> => {
  try {
    // 브라우저 환경 확인
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('이 브라우저는 마이크 접근을 지원하지 않습니다.');
      return false;
    }

    // 마이크 접근 권한 요청
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    console.error('마이크 접근 권한 오류:', error);
    return false;
  }
};

/**
 * 오디오 녹음 시작
 * @param onStateChange 녹음 상태 변경 콜백
 */
export const startRecording = async (
  onStateChange: (state: RecordingState) => void
): Promise<void> => {
  try {
    // 브라우저 환경 확인
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      onStateChange({
        ...initialRecordingState,
        error: '이 브라우저는 오디오 녹음을 지원하지 않습니다.',
      });
      return;
    }

    // 이미 녹음 중인 경우 중지
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      stopRecording(onStateChange);
      return;
    }

    // 오디오 스트림 가져오기
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // 오디오 청크 초기화
    audioChunks = [];

    // MediaRecorder 설정
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm', // Whisper API와 호환되는 형식
    });

    // 데이터 수집 이벤트 핸들러
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    // 녹음 중지 이벤트 핸들러
    mediaRecorder.onstop = () => {
      // 스트림 트랙 중지
      stream.getTracks().forEach(track => track.stop());

      // 오디오 Blob 생성
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioURL = URL.createObjectURL(audioBlob);

      // 상태 업데이트
      onStateChange({
        isRecording: false,
        audioBlob,
        audioURL,
        error: null,
      });
    };

    // 오류 이벤트 핸들러
    mediaRecorder.onerror = (event) => {
      console.error('녹음 오류:', event);
      onStateChange({
        ...initialRecordingState,
        error: '녹음 중 오류가 발생했습니다.',
      });
    };

    // 녹음 시작
    mediaRecorder.start();
    
    // 상태 업데이트
    onStateChange({
      isRecording: true,
      audioBlob: null,
      audioURL: null,
      error: null,
    });

    console.log('오디오 녹음이 시작되었습니다.');
  } catch (error) {
    console.error('녹음 시작 오류:', error);
    onStateChange({
      ...initialRecordingState,
      error: '녹음을 시작할 수 없습니다. 마이크 접근 권한을 확인하세요.',
    });
  }
};

/**
 * 오디오 녹음 중지
 * @param onStateChange 녹음 상태 변경 콜백
 */
export const stopRecording = (
  onStateChange: (state: RecordingState) => void
): void => {
  if (!mediaRecorder || mediaRecorder.state !== 'recording') {
    console.warn('녹음 중이 아닙니다.');
    return;
  }

  try {
    mediaRecorder.stop();
    console.log('오디오 녹음이 중지되었습니다.');
  } catch (error) {
    console.error('녹음 중지 오류:', error);
    onStateChange({
      ...initialRecordingState,
      error: '녹음을 중지하는 중 오류가 발생했습니다.',
    });
  }
};
