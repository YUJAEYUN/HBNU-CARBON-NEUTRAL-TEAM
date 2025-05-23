"use client";
import { useRef, useEffect } from "react";
import { FaVolumeUp } from "react-icons/fa";
import Image from "next/image";
import { ChatMessage } from "@/types/chat";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isSpeaking: boolean;
  speakMessage: (content: string) => void;
  voiceEnabled: boolean;
}

export default function ChatMessages({
  messages,
  isLoading,
  isSpeaking,
  speakMessage,
  voiceEnabled
}: ChatMessagesProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 p-3 overflow-y-auto"
      style={{ minHeight: '300px', maxHeight: 'calc(100% - 120px)' }}
    >
      {/* 음성 출력 상태 표시 (음성 기능이 활성화된 경우에만) */}
      {isSpeaking && voiceEnabled && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-lg text-center text-sm flex justify-between items-center">
          <span>🔊 대나무가 말하고 있어요...</span>
          <button
            className="bg-red-500 text-white rounded-full p-1 text-xs"
            onClick={() => {}} // 음성 중지 함수는 상위 컴포넌트에서 전달받아야 함
            title="음성 출력 중지"
          >
            <span>✕</span>
          </button>
        </div>
      )}

      {messages.map((msg, idx) => {
        // 고유한 ID 생성
        const messageId = `${msg.role}-${idx}`;

        return (
          <div
            key={messageId}
            className={`p-2 rounded-lg mb-2 max-w-[80%] ${
              msg.role === 'assistant'
                ? 'bg-primary-light mr-auto'
                : 'bg-gray-100 ml-auto'
            }`}
          >
            {/* 텍스트 메시지 */}
            {'type' in msg && msg.type === 'text' && (
              <>
                {/* 음성으로 읽기 버튼 (어시스턴트 메시지에만 표시, 음성 기능이 활성화된 경우에만) */}
                {msg.role === 'assistant' && !isSpeaking && voiceEnabled && (
                  <button
                    className="float-right ml-2 text-xs text-gray-500 hover:text-gray-700"
                    onClick={() => speakMessage(msg.content)}
                    title="음성으로 듣기"
                  >
                    <FaVolumeUp />
                  </button>
                )}
                <p className="text-sm">
                  {/* 음성 입력 태그 제거 */}
                  {msg.content.replace('🎤 ', '').replace('🇺🇸 ', '')}
                </p>
              </>
            )}

            {/* 이미지 메시지 */}
            {'type' in msg && msg.type === 'image' && (
              <div className="flex flex-col">
                <div className="relative w-full h-40 mb-2 overflow-hidden rounded">
                  <Image
                    src={msg.imageUrl}
                    alt={msg.caption || "이미지"}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded"
                  />
                </div>
                {msg.caption && (
                  <p className="text-xs text-gray-500 mt-1">{msg.caption}</p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* 로딩 표시 */}
      {isLoading && (
        <div className="bg-primary-light p-2 rounded-lg mb-2 max-w-[80%] flex">
          <div className="w-2 h-2 bg-primary rounded-full mr-1 animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
    </div>
  );
}
