"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaInfoCircle, FaComment, FaFileAlt, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { CHARACTER_STAGES, ACTIVITY_DATA } from "@/data/characterData";

export default function CharacterPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");
  const [showStats, setShowStats] = useState(false);

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

  // 임시 캐릭터 렌더링 함수
  const renderTempCharacter = (level: number, isBlurred: boolean) => {
    return (
      <div className={`relative w-12 h-12 mx-auto ${isBlurred ? 'blur-sm' : ''}`}>
        {/* 대나무 줄기 */}
        <div className={`w-2 h-${6 + level} bg-[#8B4513] rounded-sm mx-auto`}></div>
        {/* 대나무 잎 */}
        <div 
          className={`w-${6 + level} h-${6 + level} bg-primary rounded-full absolute -top-3 left-1/2 transform -translate-x-1/2`}
        ></div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 */}
      <div className="w-full bg-primary py-4 px-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold text-white">나의 캐릭터</h1>
        <div className="flex space-x-2">
          <button
            className="text-white p-2 rounded-full"
            onClick={() => setShowStats(true)}
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
          <h3 className="font-bold text-primary-dark mb-3">캐릭터 성장 정보</h3>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {CHARACTER_STAGES.map((stage) => (
              <div 
                key={stage.level} 
                className={`text-center ${currentStage.level >= stage.level ? '' : 'opacity-70'}`}
              >
                {/* 레벨별 캐릭터 표시 - 간단한 버전 */}
                <div className="relative h-14 flex items-end justify-center">
                  <div className={`${currentStage.level < stage.level ? 'opacity-40' : ''}`}>
                    {/* 줄기 */}
                    <div 
                      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-${1 + stage.level/2} h-${6 + stage.level*2} bg-[#8B5A2B] rounded-sm`}
                    ></div>
                    
                    {/* 잎 - 레벨에 따라 크기와 개수 증가 */}
                    <div 
                      className={`absolute bottom-${6 + stage.level} left-1/2 transform -translate-x-1/2 w-${4 + stage.level*2} h-${4 + stage.level*2} bg-primary rounded-full`}
                    ></div>
                    
                    {/* 레벨 4부터 작은 잎 추가 */}
                    {stage.level >= 4 && (
                      <>
                        <div className="absolute bottom-6 left-0 w-3 h-3 bg-primary-medium rounded-full"></div>
                        <div className="absolute bottom-6 right-0 w-3 h-3 bg-primary-medium rounded-full"></div>
                      </>
                    )}
                    
                    {/* 레벨 5에서 꽃 추가 */}
                    {stage.level === 5 && (
                      <div className="absolute -top-1 -right-1 text-lg">🌸</div>
                    )}
                  </div>
                </div>
                <p className={`text-xs font-medium mt-1 ${currentStage.level < stage.level ? 'blur-sm' : ''}`}>
                  Lv.{stage.level}
                </p>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            {CHARACTER_STAGES.map((stage) => (
              <div
                key={stage.level}
                className={`p-2 rounded ${
                  currentStage.level >= stage.level 
                    ? 'bg-primary-light' 
                    : 'bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className={`font-medium ${currentStage.level < stage.level ? 'blur-sm' : ''}`}>
                    Lv.{stage.level} {stage.name}
                    {currentStage.level === stage.level && " (현재)"}
                  </p>
                  <p className={`text-xs text-primary-dark ${currentStage.level < stage.level ? 'blur-sm' : ''}`}>
                    {stage.requiredPoints}+
                  </p>
                </div>
                {currentStage.level < stage.level && (
                  <p className="text-xs text-center mt-1 text-gray-500">레벨 달성 시 공개</p>
                )}
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
            {/* 임시 대나무 캐릭터 */}
            <div className="relative">
              <div className={`w-8 h-${16 + currentStage.level * 4} bg-[#8B4513] rounded-md mx-auto`}></div>
              <div className={`w-${24 + currentStage.level * 4} h-${24 + currentStage.level * 4} bg-primary rounded-full absolute -top-16 left-1/2 transform -translate-x-1/2`}></div>
            </div>

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
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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

      {/* 활동 실적 모달 */}
      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4" onClick={() => setShowStats(false)}>
          <div className="bg-white rounded-xl w-full max-w-sm p-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">활동 실적</h2>
              <button onClick={() => setShowStats(false)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 총 누적 활동 실적 */}
              <div className="bg-primary-light p-4 rounded-lg">
                <h3 className="font-bold text-primary-dark mb-2">총 누적 절감량</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-dark">65.5kg</span>
                  <span className="text-sm text-primary-dark">CO₂</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">참여 시작: 2023년 2월 2일 (87일)</p>
                <p className="text-xs text-gray-600">연속 활동 12일 🔥</p>
              </div>
              
              {/* 활동 유형별 누적 */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">활동 유형별 누적</h3>
                <div className="space-y-2">
                  {[
                    { type: "도보 이용", count: 42, reduction: "25.5kg" },
                    { type: "텀블러 사용", count: 35, reduction: "12.3kg" },
                    { type: "전자영수증", count: 28, reduction: "3.2kg" },
                    { type: "다회용기", count: 18, reduction: "8.7kg" },
                    { type: "대중교통", count: 32, reduction: "15.8kg" }
                  ].map((activity, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-700">{activity.type}</span>
                        <span className="text-xs text-gray-500 ml-1">({activity.count}회)</span>
                      </div>
                      <span className="font-medium text-primary-dark">{activity.reduction}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 환경 기여도 */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">환경 기여도</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">나무 심기 효과</span>
                      <span className="font-medium text-primary-dark">3.2그루</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">전기 절약 효과</span>
                      <span className="font-medium text-primary-dark">42.5kWh</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '58%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">물 절약 효과</span>
                      <span className="font-medium text-primary-dark">125L</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
