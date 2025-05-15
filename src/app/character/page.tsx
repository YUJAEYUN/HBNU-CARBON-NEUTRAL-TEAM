"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaInfoCircle, FaComment, FaFileAlt, FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { ChatMessage } from "@/lib/openai";
import axiosInstance from "@/lib/axios";
import { useVoiceStore } from "@/store/voiceStore";

// 캐릭터 성장 단계 정보
const CHARACTER_STAGES = [
  { level: 1, name: "새싹", description: "탄소중립 여정의 시작", requiredPoints: 0 },
  { level: 2, name: "어린 대나무", description: "성장 중인 대나무", requiredPoints: 50 },
  { level: 3, name: "튼튼한 대나무", description: "건강하게 자란 대나무", requiredPoints: 150 },
  { level: 4, name: "대나무 숲", description: "주변에 영향을 주는 대나무", requiredPoints: 300 },
  { level: 5, name: "대나무 마스터", description: "탄소중립의 상징", requiredPoints: 500 },
];

// 활동 결과 목업 데이터
const ACTIVITY_DATA = {
  daily: {
    title: "오늘의 활동 결과",
    items: [
      { label: "도보 이용", value: "0.4kg" },
      { label: "텀블러 사용", value: "0.3kg" },
      { label: "전자영수증", value: "0.1kg" }
    ],
    total: "0.8kg CO₂"
  },
  weekly: {
    title: "이번 주 활동 결과",
    items: [
      { label: "도보 이용", value: "10kg" },
      { label: "텀블러 사용", value: "5kg" },
      { label: "전자영수증", value: "0.8kg" }
    ],
    total: "15.8kg CO₂"
  },
  monthly: {
    title: "이번 달 활동 결과",
    items: [
      { label: "도보 이용", value: "25.5kg" },
      { label: "텀블러 사용", value: "12.3kg" },
      { label: "전자영수증", value: "3.2kg" },
      { label: "다회용기", value: "8.7kg" }
    ],
    total: "49.7kg CO₂"
  }
};

export default function CharacterPage() {
  const router = useRouter();
  const { isLoading } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");

  // 채팅 관련 상태
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "안녕하세요! 저는 탄소중립을 도와주는 대나무예요 🌱 오늘은 어떤 친환경 활동을 하셨나요? 작은 실천도 정말 소중해요!" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Zustand 스토어에서 음성 인식 관련 상태와 함수 가져오기
  const {
    isListening,
    isSpeaking,
    voiceMode,
    recognizedText,
    initialize,
    startVoiceRecognition,
    stopVoiceRecognition,
    stopSpeakingVoice: handleStopSpeaking, // 이름 변경하여 사용
    setVoiceMode,
    setRecognizedText, // 인식된 텍스트 설정 함수 추가
    speakMessage
  } = useVoiceStore();

  // 채팅창이 열릴 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (showChatbot && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [showChatbot, chatMessages]);

  // 음성 인식 초기화 (컴포넌트 마운트 시 한 번만 실행)
  useEffect(() => {
    initialize();

    // 컴포넌트 언마운트 시 정리는 필요 없음 (Zustand에서 관리)
  }, [initialize]);

  // 새 메시지가 추가될 때 TTS로 읽기
  useEffect(() => {
    // 마지막 메시지가 어시스턴트의 메시지이고, 음성 모드가 활성화되어 있을 때만 TTS 실행
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && voiceMode) {
      speakMessage(lastMessage.content);
    }
  }, [chatMessages, voiceMode, speakMessage]);

  // 챗봇 메시지 전송 처리 (useCallback으로 감싸서 의존성 문제 해결)
  const handleSendMessage = useCallback(async (messageText?: string) => {
    const textToSend = messageText || chatMessage;

    if (textToSend.trim()) {
      try {
        // 사용자 메시지 추가
        const userMessage: ChatMessage = { role: "user", content: textToSend };
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
    }
  }, [chatMessage, chatMessages, setChatMessages, setChatMessage, setChatLoading]);

  // 음성 인식 토글 핸들러
  const handleVoiceToggle = useCallback(() => {
    if (isListening) {
      // 음성 인식 중지 및 텍스트 전송
      const text = stopVoiceRecognition();
      if (text && text.trim()) {
        // [en] 태그 제거하고 음성입력 태그 추가
        const cleanText = text.replace('[en] ', '');

        // 영어로 인식된 경우 표시 (짧은 접두사 사용)
        const isEnglish = text.includes('[en]');
        // 토큰 수를 줄이기 위해 접두사를 최소화
        const messagePrefix = isEnglish ? '🇺🇸 ' : '🎤 ';

        // 메시지 전송 (토큰 수를 줄이기 위해 접두사 최소화)
        handleSendMessage(`${messagePrefix}${cleanText}`);
      }
    } else {
      // 음성 인식 시작 전 상태 표시
      setChatLoading(true);

      // 인식된 텍스트 초기화
      setRecognizedText('');

      // 음성 인식 시작 (약간의 지연으로 UI 업데이트 시간 확보)
      setTimeout(() => {
        startVoiceRecognition();
        setChatLoading(false);
      }, 100);
    }
  }, [isListening, startVoiceRecognition, stopVoiceRecognition, handleSendMessage, setChatLoading, setRecognizedText]);

  // 음성 대화창 열기 시 음성 모드 활성화
  useEffect(() => {
    if (showVoiceChat) {
      setVoiceMode(true);
    }
  }, [showVoiceChat, setVoiceMode]);

  // 음성 대화창 닫기 시 음성 인식 중지
  useEffect(() => {
    // 음성 대화창이 닫힐 때만 실행
    if (!showVoiceChat && isListening) {
      const text = stopVoiceRecognition();
      if (text && text.trim()) {
        // [en] 태그 제거하고 음성입력 태그 추가
        const cleanText = text.replace('[en] ', '');

        // 영어로 인식된 경우 표시 (짧은 접두사 사용)
        const isEnglish = text.includes('[en]');
        // 토큰 수를 줄이기 위해 접두사를 최소화
        const messagePrefix = isEnglish ? '🇺🇸 ' : '🎤 ';

        // 메시지 전송 (토큰 수를 줄이기 위해 접두사 최소화)
        handleSendMessage(`${messagePrefix}${cleanText}`);
      }
    }
  }, [showVoiceChat, isListening, stopVoiceRecognition, handleSendMessage]);

  // 현재 사용자 포인트 (실제로는 API에서 가져올 값)
  const currentPoints = 180;

  // 현재 캐릭터 단계 계산
  const currentStage = CHARACTER_STAGES.reduce((prev, curr) => {
    return currentPoints >= curr.requiredPoints ? curr : prev;
  }, CHARACTER_STAGES[0]);

  // 다음 단계 계산
  const nextStageIndex = CHARACTER_STAGES.findIndex(stage => stage.level === currentStage.level) + 1;
  const nextStage = nextStageIndex < CHARACTER_STAGES.length ? CHARACTER_STAGES[nextStageIndex] : null;

  // 다음 단계까지 남은 포인트
  const pointsToNextLevel = nextStage ? nextStage.requiredPoints - currentPoints : 0;

  // 진행률 계산
  const progressPercentage = nextStage
    ? ((currentPoints - currentStage.requiredPoints) / (nextStage.requiredPoints - currentStage.requiredPoints)) * 100
    : 100;

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 */}
      <div className="w-full bg-primary py-4 px-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold text-white">나의 캐릭터</h1>
        <div className="flex space-x-2">
          <button
            className="text-white p-2 rounded-full"
            onClick={() => router.push("/character/stats")}
          >
            <FaFileAlt className="text-xl" />
          </button>
          <button
            className="text-white p-2 rounded-full"
            onClick={() => setShowInfo(!showInfo)}
          >
            <FaInfoCircle className="text-xl" />
          </button>
        </div>
      </div>

      {/* 캐릭터 정보 팝업 */}
      {showInfo && (
        <motion.div
          className="absolute top-16 right-4 bg-white p-4 rounded-xl shadow-lg z-10 w-[90%] max-w-xs"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="font-bold text-primary-dark mb-2">캐릭터 성장 정보</h3>
          <div className="space-y-2">
            {CHARACTER_STAGES.map((stage) => (
              <div
                key={stage.level}
                className={`p-2 rounded ${currentStage.level >= stage.level ? 'bg-primary-light' : 'bg-gray-100'}`}
              >
                <p className="font-medium">
                  Lv.{stage.level} {stage.name}
                  {currentStage.level === stage.level && " (현재)"}
                </p>
                <p className="text-xs text-gray-600">{stage.description}</p>
                <p className="text-xs text-primary-dark">{stage.requiredPoints}+ 포인트</p>
              </div>
            ))}
          </div>
          <button
            className="mt-3 text-sm text-gray-500"
            onClick={() => setShowInfo(false)}
          >
            닫기
          </button>
        </motion.div>
      )}

      <div className="flex-1 flex flex-col items-center p-4">
        {/* 캐릭터 이미지 */}
        <motion.div
          className="w-48 h-48 bg-primary-light bg-opacity-30 rounded-full flex items-center justify-center mt-8 mb-6"
          animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <div className="relative">
            {/* 대나무 캐릭터 */}
            <div className="w-8 h-20 bg-[#8B4513] rounded-md mx-auto"></div>
            <div className="w-32 h-32 bg-primary rounded-full absolute -top-16 left-1/2 transform -translate-x-1/2"></div>

            {/* 텍스트 챗봇 버튼 */}
            <motion.button
              className="absolute -right-8 -bottom-4 bg-white p-2 rounded-full shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setShowChatbot(!showChatbot);
                if (showVoiceChat) setShowVoiceChat(false);
              }}
            >
              <FaComment className="text-primary text-xl" />
            </motion.button>

            {/* 음성 챗봇 버튼 */}
            <motion.button
              className="absolute -left-8 -bottom-4 bg-white p-2 rounded-full shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setShowVoiceChat(!showVoiceChat);
                if (showChatbot) setShowChatbot(false);
              }}
            >
              <FaMicrophone className={`text-xl ${voiceMode ? 'text-green-500' : 'text-blue-500'}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* 레벨 표시 */}
        <p className="text-primary font-bold text-lg mb-2">
          Lv.{currentStage.level} {currentStage.name}
        </p>

        {/* 진행 바 */}
        <div className="w-full max-w-xs mb-2">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-primary h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {nextStage ? (
          <p className="text-gray-600 text-sm mb-8">
            다음 레벨까지 {pointsToNextLevel}포인트 더 모으면 됩니다
          </p>
        ) : (
          <p className="text-primary-dark font-medium text-sm mb-8">
            최고 레벨에 도달했습니다!
          </p>
        )}

        {/* 활동량 표시 - 탭 버튼 */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between mb-4">
            <button
              className={`flex-1 py-2 px-4 text-center rounded-l-lg font-medium ${activeTab === "daily" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => setActiveTab("daily")}
            >
              오늘
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === "weekly" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => setActiveTab("weekly")}
            >
              이번주
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center rounded-r-lg font-medium ${activeTab === "monthly" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => setActiveTab("monthly")}
            >
              이번달
            </button>
          </div>
        </div>

        {/* 활동 결과 - 선택된 탭에 따라 다른 내용 표시 */}
        <motion.div
          className="w-full max-w-xs ios-card p-4"
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-gray-800 font-bold mb-3">{ACTIVITY_DATA[activeTab].title}</h2>
          <div className="space-y-2">
            {ACTIVITY_DATA[activeTab].items.map((item) => (
              <div key={`${activeTab}-${item.label}`} className="flex justify-between">
                <span className="text-gray-700">{item.label}:</span>
                <span className="text-primary-dark font-medium">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="text-primary-dark font-bold">총 절감량:</span>
              <span className="text-primary-dark font-bold">{ACTIVITY_DATA[activeTab].total}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 텍스트 챗봇 대화창 */}
      {showChatbot && (
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
              onClick={() => setShowChatbot(false)}
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
              onClick={() => handleSendMessage()}
              disabled={chatLoading}
            >
              전송
            </button>
          </div>
        </motion.div>
      )}

      {/* 음성 챗봇 대화창 */}
      {showVoiceChat && (
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
              onClick={() => setShowVoiceChat(false)}
            >
              닫기
            </button>
          </div>
          <div className="h-64 p-3 overflow-y-auto">
            {/* 음성 인식 상태 표시 - 제거 (하단에 표시) */}

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
              <div className="flex-1 text-center text-sm text-gray-600 mx-2 max-w-[70%] truncate">
                {recognizedText.includes('[en]') ?
                  <span className="text-blue-500">{recognizedText.replace('[en] ', '')}</span> :
                  recognizedText}
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
      )}
    </div>
  );
}