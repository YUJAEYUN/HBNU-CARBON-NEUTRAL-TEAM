"use client";
import { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaImage, FaMicrophoneAlt } from "react-icons/fa";
import { useVoiceStore } from "@/store/voiceStore";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onVoiceToggle: () => Promise<string> | string; // 음성인식 결과를 반환하도록 변경
  onImageUpload: () => void;
  isListening: boolean;
  isLoading: boolean;
  recognizedText: string;
}

export default function ChatInput({
  onSendMessage,
  onVoiceToggle,
  onImageUpload,
  isListening,
  isLoading,
  recognizedText
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { useWhisperAPI, recording, isProcessingAudio, toggleRecording, stopRecording } = useVoiceStore();

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isListening) {
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t border-gray-200">
      {/* 음성 인식 중일 때 인식된 텍스트 표시 */}
      {(isListening || recording.isRecording || isProcessingAudio) && (
        <div className="mb-2 text-center text-sm text-gray-600 overflow-hidden">
          {recognizedText ? (
            <div className="animate-typing whitespace-nowrap overflow-hidden">
              {recognizedText.includes('[en]') ?
                <span className="text-blue-500">{recognizedText.replace('[en] ', '')}</span> :
                recognizedText}
            </div>
          ) : (
            <div className="text-gray-500">
              <span className="animate-pulse inline-block mr-1">●</span>
              {useWhisperAPI ?
                (recording.isRecording ? "녹음 중..." : isProcessingAudio ? "음성 처리 중..." : "Whisper API 준비 중...") :
                "말씀해주세요..."}
            </div>
          )}
        </div>
      )}

      {/* 구글 스타일 입력 UI */}
      <div className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-2 shadow-sm">
        {/* 텍스트 입력 */}
        <input
          type="text"
          className="flex-1 border-none focus:outline-none bg-transparent"
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || isListening || recording.isRecording || isProcessingAudio}
        />

        {/* 이미지 업로드 버튼 */}
        <button
          className="p-2 text-gray-500 hover:text-gray-700"
          onClick={onImageUpload}
          title="이미지 업로드"
          disabled={isLoading || isListening || recording.isRecording || isProcessingAudio}
        >
          <FaImage />
        </button>

        {/* 음성 버튼 */}
        {useWhisperAPI ? (
          // Whisper API 사용 시 녹음 버튼
          <button
            className={`p-2 ${recording.isRecording ? 'text-red-500 animate-pulse' : isProcessingAudio ? 'text-yellow-500 animate-pulse' : 'text-green-500 hover:text-green-700'}`}
            onClick={async () => {
              // 음성 인식 토글 (녹음 시작/중지)
              await onVoiceToggle();
              // 결과는 자동으로 메시지로 전송되므로 입력창에 설정하지 않음
            }}
            disabled={isLoading || isProcessingAudio}
            title={recording.isRecording ? "녹음 중지 및 변환" : isProcessingAudio ? "처리 중..." : "OpenAI Whisper로 음성 인식"}
          >
            {recording.isRecording ? <FaMicrophoneSlash /> : <FaMicrophoneAlt />}
          </button>
        ) : (
          // 브라우저 Web Speech API 사용 시 기존 버튼
          <button
            className={`p-2 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={async () => {
              // 음성 인식 토글 (시작/중지)
              await onVoiceToggle();
              // 결과는 자동으로 메시지로 전송되므로 입력창에 설정하지 않음
            }}
            disabled={isLoading}
            title={isListening ? "음성 인식 중지" : "음성으로 대화하기"}
          >
            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
        )}

        {/* 전송 버튼 */}
        <button
          className={`p-2 ${isLoading || !message.trim() ? 'text-gray-400' : 'text-primary hover:text-primary-dark'}`}
          onClick={handleSend}
          disabled={isLoading || isListening || recording.isRecording || isProcessingAudio || !message.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}
