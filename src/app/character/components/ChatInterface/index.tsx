"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChatMessage, TextMessage, ImageMessage } from "@/types/chat";
import { useVoiceStore } from "@/store/voiceStore";
import { FaVolumeUp, FaVolumeMute, FaMicrophone, FaMicrophoneAlt } from "react-icons/fa";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ImageUpload from "./ImageUpload";

interface ChatInterfaceProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatLoading: boolean;
  setChatLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isListening: boolean;
  isSpeaking: boolean;
  recognizedText: string;
  handleVoiceToggle: () => Promise<string> | string;
  handleStopSpeaking: () => void;
  speakMessage: (content: string) => void;
  handleSendMessage: (messageText: string) => void;
  onClose: () => void;
}

export default function ChatInterface({
  chatMessages,
  setChatMessages,
  chatLoading,
  setChatLoading,
  isListening,
  isSpeaking,
  recognizedText,
  handleVoiceToggle,
  handleStopSpeaking,
  speakMessage,
  handleSendMessage,
  onClose
}: ChatInterfaceProps) {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const {
    voiceEnabled,
    setVoiceEnabled,
    useWhisperAPI,
    setUseWhisperAPI,
    toggleRecording
  } = useVoiceStore();

  // 이미지 메시지 전송
  const handleSendImage = useCallback((imageUrl: string, caption: string) => {
    // 이미지 업로드 UI 닫기
    setShowImageUpload(false);

    // 상위 컴포넌트의 이미지 전송 함수 호출
    handleSendMessage(`[이미지: ${caption || '이미지'}]`);
  }, [handleSendMessage]);

  return (
    <motion.div
      className="absolute bottom-24 left-4 right-4 bg-white rounded-t-xl shadow-lg z-20 mx-auto"
      initial={{ y: 300 }}
      animate={{ y: 0 }}
      exit={{ y: 300 }}
      style={{
        maxHeight: 'calc(100% - 180px)',
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100% - 32px)',
        maxWidth: '343px'
      }}
    >
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <p className="font-bold text-primary-dark">대나무와 대화하기</p>
        <div className="flex items-center space-x-3">
          {/* 음성 기능 온오프 토글 버튼 */}
          <button
            className={`p-2 rounded-full ${voiceEnabled ? 'text-primary' : 'text-gray-400'}`}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            title={voiceEnabled ? "음성 기능 끄기" : "음성 기능 켜기"}
          >
            {voiceEnabled ? <FaVolumeUp size={18} /> : <FaVolumeMute size={18} />}
          </button>

          <button
            className="text-gray-500"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>

      {/* 이미지 업로드 UI */}
      {showImageUpload ? (
        <ImageUpload
          onSendImage={handleSendImage}
          onCancel={() => setShowImageUpload(false)}
        />
      ) : (
        <>
          {/* 채팅 메시지 표시 */}
          <ChatMessages
            messages={chatMessages}
            isLoading={chatLoading}
            isSpeaking={isSpeaking}
            speakMessage={speakMessage}
            voiceEnabled={voiceEnabled}
          />

          {/* 채팅 입력 UI */}
          <ChatInput
            onSendMessage={handleSendMessage}
            onVoiceToggle={handleVoiceToggle}
            onImageUpload={() => setShowImageUpload(true)}
            isListening={isListening}
            isLoading={chatLoading}
            recognizedText={recognizedText}
          />
        </>
      )}
    </motion.div>
  );
}
