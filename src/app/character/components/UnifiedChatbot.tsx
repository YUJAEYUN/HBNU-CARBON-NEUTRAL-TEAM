"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaKeyboard, FaImage, FaPaperclip } from "react-icons/fa";
import { ChatMessage, TextMessage, ImageMessage } from "@/types/chat";
import axiosInstance from "@/lib/axios";
import Image from "next/image";

interface UnifiedChatbotProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatLoading: boolean;
  setChatLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isListening: boolean;
  isSpeaking: boolean;
  voiceMode: boolean;
  recognizedText: string;
  handleVoiceToggle: () => void;
  handleStopSpeaking: () => void;
  speakMessage: (content: string) => void;
  handleSendMessage: (messageText: string) => void;
  onClose: () => void;
}

export default function UnifiedChatbot({
  chatMessages,
  setChatMessages,
  chatLoading,
  setChatLoading,
  isListening,
  isSpeaking,
  voiceMode,
  recognizedText,
  handleVoiceToggle,
  handleStopSpeaking,
  speakMessage,
  handleSendMessage,
  onClose
}: UnifiedChatbotProps) {
  const [chatMessage, setChatMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 채팅창이 열릴 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // 텍스트 메시지 전송 처리
  const sendTextMessage = useCallback(() => {
    if (!chatMessage.trim()) return;
    handleSendMessage(chatMessage);
    setChatMessage("");
  }, [chatMessage, handleSendMessage]);

  // 이미지 파일 선택 처리
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 타입 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setSelectedImage(file);

    // 이미지 미리보기 URL 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // 이미지 업로드 취소
  const cancelImageUpload = useCallback(() => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setImageCaption("");
  }, []);

  // 이미지 메시지 전송
  const sendImageMessage = useCallback(() => {
    if (!imagePreviewUrl) return;

    // 이미지 메시지 생성 (실제로는 서버에 업로드하고 URL을 받아야 함)
    const newImageMessage: ImageMessage = {
      role: 'user',
      type: 'image',
      imageUrl: imagePreviewUrl,
      caption: imageCaption || '이미지'
    };

    // 메시지 목록에 추가
    setChatMessages(prev => [...prev, newImageMessage]);

    // 상태 초기화
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setImageCaption("");

    // 여기서 실제로는 이미지 분석 API 호출 등의 처리를 해야 함
    // 예시로 간단한 응답 추가
    setTimeout(() => {
      const responseMessage: TextMessage = {
        role: 'assistant',
        type: 'text',
        content: '이미지를 확인했습니다. 어떤 도움이 필요하신가요?'
      };
      setChatMessages(prev => [...prev, responseMessage]);
    }, 1000);

  }, [imagePreviewUrl, imageCaption, setChatMessages]);

  // 파일 선택 다이얼로그 열기
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
                  {/* 음성으로 읽기 버튼 (어시스턴트 메시지에만 표시) */}
                  {msg.role === 'assistant' && !isSpeaking && (
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
        {chatLoading && (
          <div className="bg-primary-light p-2 rounded-lg mb-2 max-w-[80%] flex">
            <div className="w-2 h-2 bg-primary rounded-full mr-1 animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      {/* 통합된 입력 영역 */}
      <div className="p-3 border-t border-gray-200">
        {/* 음성 인식 중일 때 인식된 텍스트 표시 */}
        {isListening && (
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
                말씀해주세요...
              </div>
            )}
          </div>
        )}

        {/* 이미지 미리보기 */}
        {imagePreviewUrl && (
          <div className="mb-3">
            <div className="relative w-full h-48 mb-2 overflow-hidden rounded border border-gray-300">
              <Image
                src={imagePreviewUrl}
                alt="이미지 미리보기"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded"
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                onClick={cancelImageUpload}
                title="이미지 취소"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
            <input
              type="text"
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none mb-2"
              placeholder="이미지 설명 추가 (선택사항)"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
            />
            <button
              className="w-full p-2 rounded-lg bg-primary text-white"
              onClick={sendImageMessage}
            >
              이미지 전송
            </button>
          </div>
        )}

        {/* 파일 입력 (숨김) */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageSelect}
        />

        {/* 구글 스타일 입력 UI */}
        {!imagePreviewUrl && (
          <div className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-2 shadow-sm">
            {/* 텍스트 입력 */}
            <input
              type="text"
              className="flex-1 border-none focus:outline-none bg-transparent"
              placeholder="메시지를 입력하세요..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isListening && sendTextMessage()}
              disabled={chatLoading || isListening}
            />

            {/* 이미지 업로드 버튼 */}
            <button
              className="p-2 text-gray-500 hover:text-gray-700"
              onClick={openFileDialog}
              title="이미지 업로드"
              disabled={chatLoading || isListening}
            >
              <FaImage />
            </button>

            {/* 음성 버튼 */}
            <button
              className={`p-2 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={handleVoiceToggle}
              disabled={chatLoading}
              title={isListening ? "음성 인식 중지 및 전송" : "음성으로 대화하기"}
            >
              {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>

            {/* 전송 버튼 */}
            <button
              className={`p-2 ${chatLoading ? 'text-gray-400' : 'text-primary hover:text-primary-dark'}`}
              onClick={sendTextMessage}
              disabled={chatLoading || isListening || !chatMessage.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
