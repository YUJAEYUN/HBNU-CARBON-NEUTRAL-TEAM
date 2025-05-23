// 녹음 상태 인터페이스
export interface RecordingState {
  isRecording: boolean;
  audioBlob?: Blob;
  audioUrl?: string;
  error?: string;
}

// 마이크 권한 요청 함수
export const requestMicrophonePermission = async (): Promise<boolean> => {
  try {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('미디어 장치 API가 지원되지 않습니다.');
      return false;
    }

    // 마이크 권한 요청
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    console.error('마이크 권한 요청 실패:', error);
    return false;
  }
};

// 녹음 관련 변수
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let recordingStream: MediaStream | null = null;

// 녹음 시작 함수
export const startRecording = (onStateChange: (state: RecordingState) => void): void => {
  // 이미 녹음 중인 경우 중지
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    stopRecording(onStateChange);
    return;
  }

  // 오디오 청크 초기화
  audioChunks = [];

  // 미디어 장치 API 지원 확인
  if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    onStateChange({
      isRecording: false,
      error: '이 브라우저는 녹음 기능을 지원하지 않습니다.'
    });
    return;
  }

  // 마이크 접근 요청
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      recordingStream = stream;

      // MediaRecorder 인스턴스 생성
      mediaRecorder = new MediaRecorder(stream);

      // 데이터 수집 이벤트 핸들러
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      // 녹음 중지 이벤트 핸들러
      mediaRecorder.onstop = () => {
        // 스트림 트랙 중지
        if (recordingStream) {
          recordingStream.getTracks().forEach(track => track.stop());
          recordingStream = null;
        }

        // 오디오 Blob 생성
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // 상태 업데이트
        onStateChange({
          isRecording: false,
          audioBlob,
          audioUrl
        });
      };

      // 오류 이벤트 핸들러
      mediaRecorder.onerror = (event) => {
        console.error('녹음 오류:', event);
        onStateChange({
          isRecording: false,
          error: '녹음 중 오류가 발생했습니다.'
        });
      };

      // 녹음 시작
      mediaRecorder.start();

      // 상태 업데이트
      onStateChange({
        isRecording: true
      });
    })
    .catch(error => {
      console.error('마이크 접근 오류:', error);
      
      let errorMessage = '마이크 접근에 실패했습니다.';
      
      // 권한 거부 오류 확인
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = '마이크 사용 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = '마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = '마이크에 접근할 수 없습니다. 다른 앱이 마이크를 사용 중인지 확인해주세요.';
      }
      
      onStateChange({
        isRecording: false,
        error: errorMessage
      });
    });
};

// 녹음 중지 함수
export const stopRecording = (onStateChange: (state: RecordingState) => void): void => {
  if (!mediaRecorder || mediaRecorder.state !== 'recording') {
    onStateChange({
      isRecording: false,
      error: '녹음 중이 아닙니다.'
    });
    return;
  }

  try {
    // 녹음 중지
    mediaRecorder.stop();
    
    // 상태 업데이트는 onstop 이벤트에서 처리됨
  } catch (error) {
    console.error('녹음 중지 오류:', error);
    
    // 스트림 트랙 중지 시도
    if (recordingStream) {
      recordingStream.getTracks().forEach(track => track.stop());
      recordingStream = null;
    }
    
    onStateChange({
      isRecording: false,
      error: '녹음 중지 중 오류가 발생했습니다.'
    });
  }
};

// 녹음된 오디오를 텍스트로 변환하는 함수 (OpenAI Whisper API 사용)
export const convertAudioToText = async (audioBlob: Blob): Promise<string> => {
  try {
    // OpenAI API 호출을 위한 함수 가져오기
    const { transcribeAudio } = await import('./openai');
    
    // Whisper API로 음성 인식
    const transcribedText = await transcribeAudio(audioBlob);
    return transcribedText || '';
  } catch (error) {
    console.error('음성 인식 오류:', error);
    throw error;
  }
};
