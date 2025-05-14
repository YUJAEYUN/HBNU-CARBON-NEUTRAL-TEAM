"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaInfoCircle, FaComment, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { ChatMessage } from "@/lib/openai";
import axiosInstance from "@/lib/axios";

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
  const [chatMessage, setChatMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");

  // 채팅 관련 상태
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "안녕하세요! 저는 탄소중립을 도와주는 대나무예요 🌱 오늘은 어떤 친환경 활동을 하셨나요? 작은 실천도 정말 소중해요!" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 채팅창이 열릴 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (showChatbot && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [showChatbot, chatMessages]);

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

  // 챗봇 메시지 전송 처리
  const handleSendMessage = async () => {
    if (chatMessage.trim()) {
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
    }
  };

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

            {/* 챗봇 버튼 */}
            <motion.button
              className="absolute -right-8 -bottom-4 bg-white p-2 rounded-full shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowChatbot(!showChatbot)}
            >
              <FaComment className="text-primary text-xl" />
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

      {/* 챗봇 대화창 */}
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
              return (
                <div
                  key={messageId}
                  className={`p-2 rounded-lg mb-2 max-w-[80%] ${
                    msg.role === 'assistant'
                      ? 'bg-primary-light mr-auto'
                      : 'bg-gray-100 ml-auto'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
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
      )}
    </div>
  );
}