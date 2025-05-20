"use client";
import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaMicrophoneSlash, FaMicrophone, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { ChatMessage } from "@/lib/openai";

interface VoiceChatbotProps {
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  recognizedText: string;
  handleVoiceToggle: () => void;
  handleStopSpeaking: () => void;
  speakMessage: (content: string) => void;
  onClose: () => void;
}

export default function VoiceChatbot({
  chatMessages,
  chatLoading,
  isListening,
  isSpeaking,
  recognizedText,
  handleVoiceToggle,
  handleStopSpeaking,
  speakMessage,
  onClose
}: VoiceChatbotProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 채팅창이 열릴 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <motion.div
      className="fixed bottom-20 left-4 right-4 bg-white rounded-t-xl shadow-lg z-20 max-w-[375px] mx-auto"
      initial={{ y: 300 }}
      animate={{ y: 0 }}
      exit={{ y: 300 }}
    >
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <p className="font-bold text-primary-dark">대나무와 음성으로 대화하기</p>
        <button
          className="text-gray-500"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
      <div 
        ref={chatContainerRef}
        className="h-64 p-3 overflow-y-auto"
      >
        {/* 음성 출력 상태 표시 */}
        {isSpeaking && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-lg text-center text-sm flex justify-between items-center">
            <span>🔊 대나무가 말하고 있어요...</span>
            <button
              className="bg-red-500 text-white rounded-full p-1 text-xs"
              onClick={handleStopSpeaking}
              title="음성 출력 중지"
            >
              <FaVolumeMute />
            </button>
          </div>
        )}

        {chatMessages.map((msg, idx) => {
          // 고유한 ID 생성 (메시지 내용과 인덱스 조합)
          const messageId = `voice-${msg.role}-${msg.content.substring(0, 10)}-${idx}`;
          // 음성 입력 태그 제거 (모든 종류의 음성 입력 태그 처리)
          const displayContent = msg.content
            .replace('🎤 ', '')
            .replace('🇺🇸 ', '');

          return (
            <div
              key={messageId}
              className={`p-2 rounded-lg mb-2 max-w-[80%] ${
                msg.role === 'assistant'
                  ? 'bg-primary-light mr-auto'
                  : 'bg-gray-100 ml-auto'
              }`}
            >
              {/* 음성으로 읽기 버튼 (어시스턴트 메시지에만 표시) */}
              {msg.role === 'assistant' && !isSpeaking && (
                <button
                  className="float-right ml-2 text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    speakMessage(msg.content);
                  }}
                  title="음성으로 듣기"
                >
                  <FaVolumeUp />
                </button>
              )}
              <p className="text-sm">{displayContent}</p>
            </div>
          );
        })}
        {chatLoading && (
          <div className="bg-primary-light p-2 rounded-lg mb-2 max-w-[80%] flex">
            <div className="w-2 h-2 bg-primary rounded-full mr-1 animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-gray-200 flex justify-center items-center">
        {/* 인식된 텍스트 표시 (인식 중일 때만) */}
        {isListening && recognizedText && (
          <div className="flex-1 text-center text-sm text-gray-600 mx-2 max-w-[70%] overflow-hidden">
            <div className="animate-typing whitespace-nowrap overflow-hidden">
              {recognizedText.includes('[en]') ?
                <span className="text-blue-500">{recognizedText.replace('[en] ', '')}</span> :
                recognizedText}
            </div>
          </div>
        )}

        {/* 음성 인식 상태 표시 (인식 중이지만 텍스트가 없을 때) */}
        {isListening && !recognizedText && (
          <div className="flex-1 text-center text-sm text-gray-500 mx-2">
            <span className="animate-pulse inline-block mr-1">●</span>
            {recognizedText.includes('[en]')
              ? '영어로 인식 중...'
              : '말씀해주세요...'}
          </div>
        )}

        {/* 음성 인식 토글 버튼 */}
        <button
          className={`p-4 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'} text-white shadow-md transition-all duration-300 hover:scale-105`}
          onClick={handleVoiceToggle}
          disabled={chatLoading || isSpeaking}
          title={isListening ? "음성 인식 중지 및 전송" : "음성 인식 시작"}
        >
          {isListening ? <FaMicrophoneSlash className="text-2xl" /> : <FaMicrophone className="text-2xl" />}
        </button>

        {/* 음성 인식 안내 (인식 중이 아닐 때) */}
        {!isListening && (
          <div className="flex-1 text-center text-xs text-gray-500 mx-2">
            버튼을 눌러 대화를 시작하세요
          </div>
        )}
      </div>
    </motion.div>
  );
}
