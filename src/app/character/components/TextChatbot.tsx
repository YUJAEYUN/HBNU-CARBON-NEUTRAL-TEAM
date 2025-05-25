"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "@/lib/openai";
import axiosInstance from "@/lib/axios";

interface TextChatbotProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onClose: () => void;
}

export default function TextChatbot({
  chatMessages,
  setChatMessages,
  onClose
}: TextChatbotProps) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 채팅창이 열릴 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // 메시지 전송 처리
  const handleSendMessage = useCallback(async () => {
    if (!chatMessage.trim()) return;

    try {
      // 사용자 메시지 추가
      const userMessage: ChatMessage = { role: "user", content: chatMessage };
      const updatedMessages = [...chatMessages, userMessage];
      setChatMessages(updatedMessages);
      setChatMessage("");
      setChatLoading(true);

      // axiosInstance를 사용한 API 호출
      const response = await axiosInstance.post("/api/chat", {
        messages: updatedMessages
      });

      // 응답 메시지 추가
      if (response.data.message) {
        setChatMessages([...updatedMessages, response.data.message]);
      }
    } catch (error) {
      console.error("채팅 오류:", error);
      // 오류 메시지 추가
      setChatMessages([
        ...chatMessages,
        { role: "assistant", content: "죄송합니다. 대화 처리 중 오류가 발생했습니다." }
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatMessage, chatMessages, setChatMessages]);

  return (
    <motion.div
      className="fixed bottom-20 left-4 right-4 bg-white rounded-t-xl shadow-lg z-20 max-w-[375px] mx-auto"
      initial={{ y: 300 }}
      animate={{ y: 0 }}
      exit={{ y: 300 }}
    >
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <p className="font-bold text-primary-dark">대나무와 대화하기</p>
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
        {chatMessages.map((msg, idx) => {
          // 고유한 ID 생성 (메시지 내용과 인덱스 조합)
          const messageId = `${msg.role}-${msg.content.substring(0, 10)}-${idx}`;
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
      <div className="p-3 border-t border-gray-200 flex">
        <input
          type="text"
          className="flex-1 p-2 rounded-l-lg border border-gray-300 focus:outline-none"
          placeholder="메시지를 입력하세요..."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={chatLoading}
        />

        {/* 메시지 전송 버튼 */}
        <button
          className={`p-2 rounded-r-lg ${
            chatLoading
              ? 'bg-gray-400 text-white'
              : 'bg-primary text-white'
          }`}
          onClick={handleSendMessage}
          disabled={chatLoading}
        >
          전송
        </button>
      </div>
    </motion.div>
  );
}
