"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaInfoCircle, FaComment, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

// 캐릭터 성장 단계 정보
const CHARACTER_STAGES = [
  { level: 1, name: "새싹", description: "탄소중립 여정의 시작", requiredPoints: 0 },
  { level: 2, name: "어린 대나무", description: "성장 중인 대나무", requiredPoints: 50 },
  { level: 3, name: "튼튼한 대나무", description: "건강하게 자란 대나무", requiredPoints: 150 },
  { level: 4, name: "대나무 숲", description: "주변에 영향을 주는 대나무", requiredPoints: 300 },
  { level: 5, name: "대나무 마스터", description: "탄소중립의 상징", requiredPoints: 500 },
];

export default function CharacterPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

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
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // 여기서 실제 챗봇 API 호출 구현
      alert(`메시지를 전송했습니다: ${chatMessage}`);
      setChatMessage("");
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
            {CHARACTER_STAGES.map((stage, index) => (
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

        {/* 활동량 표시 */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between mb-4">
            <button className="flex-1 py-2 px-4 text-center rounded-l-lg font-medium bg-primary text-white">오늘</button>
            <button className="flex-1 py-2 px-4 text-center font-medium bg-gray-100 text-gray-600">이번주</button>
            <button className="flex-1 py-2 px-4 text-center rounded-r-lg font-medium bg-gray-100 text-gray-600">이번달</button>
          </div>
        </div>

        {/* 오늘의 활동 결과 */}
        <div className="w-full max-w-xs bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-primary-dark font-bold mb-3">오늘의 활동 결과</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">도보 이용:</span>
              <span className="text-primary-dark font-medium">0.4kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">텀블러 사용:</span>
              <span className="text-primary-dark font-medium">0.3kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">전자영수증:</span>
              <span className="text-primary-dark font-medium">0.1kg</span>
            </div>
            <div className="flex justify-between border-t border-primary-medium pt-2 mt-2">
              <span className="text-primary-dark font-bold">총 절감량:</span>
              <span className="text-primary-dark font-bold">0.8kg CO₂</span>
            </div>
          </div>
        </div>
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
          <div className="h-64 p-3 overflow-y-auto">
            <div className="bg-primary-light p-2 rounded-lg mb-2 max-w-[80%]">
              <p className="text-sm">안녕하세요! 오늘 어떤 친환경 활동을 하셨나요?</p>
            </div>
          </div>
          <div className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              className="flex-1 p-2 rounded-l-lg border border-gray-300 focus:outline-none"
              placeholder="메시지를 입력하세요..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              className="bg-primary text-white p-2 rounded-r-lg"
              onClick={handleSendMessage}
            >
              전송
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

{/* 이번 주 활동 결과 */}
<div className="w-full max-w-xs bg-white rounded-xl p-4 shadow-sm">
  <h2 className="text-primary-dark font-bold mb-3">이번 주 활동 결과</h2>
  <div className="space-y-2">
    <div className="flex justify-between">
      <span className="text-gray-700">도보 이용:</span>
      <span className="text-primary-dark font-medium">10kg</span> {/* 이번 주 도보 이용 */}
    </div>
    <div className="flex justify-between">
      <span className="text-gray-700">텀블러 사용:</span>
      <span className="text-primary-dark font-medium">5kg</span> {/* 이번 주 텀블러 사용 */}
    </div>
    <div className="flex justify-between">
      <span className="text-gray-700">전자영수증:</span>
      <span className="text-primary-dark font-medium">0.8kg</span> {/* 이번 주 전자영수증 */}
    </div>
    <div className="flex justify-between border-t border-primary-medium pt-2 mt-2">
      <span className="text-primary-dark font-bold">총 절감량:</span>
      <span className="text-primary-dark font-bold">15.8kg CO₂</span> {/* 이번 주 총 절감량 */}
    </div>
  </div>
</div>