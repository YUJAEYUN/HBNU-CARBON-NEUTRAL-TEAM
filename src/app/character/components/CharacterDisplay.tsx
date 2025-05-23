"use client";
import { motion } from "framer-motion";
import { FaComment } from "react-icons/fa";
import { CharacterStage } from "../constants";
import { useState } from "react";
import CharacterAnimation from "./CharacterAnimation";

interface CharacterDisplayProps {
  currentStage: CharacterStage;
  currentPoints: number;
  nextStage: CharacterStage | null;
  progressPercentage: number;
  pointsToNextLevel: number;
  onChatbotToggle: () => void;
}

export default function CharacterDisplay({
  currentStage,
  currentPoints,
  nextStage,
  progressPercentage,
  pointsToNextLevel,
  onChatbotToggle
}: CharacterDisplayProps) {
  const [hoverState, setHoverState] = useState<"idle" | "happy" | "confused">("idle");

  return (
    <>
      {/* 캐릭터 이미지 */}
      <motion.div
        className="w-56 h-56 bg-primary-light bg-opacity-30 rounded-full flex items-center justify-center mt-4 mb-3 relative"
        onMouseEnter={() => setHoverState("happy")}
        onMouseLeave={() => setHoverState("idle")}
      >
        <div className="relative -mt-8">
          {/* 캐릭터 애니메이션 */}
          <div className="flex flex-col items-center justify-center">
            <CharacterAnimation
              currentState={hoverState}
              imagePath="/mainCharacter.png"
            />
          </div>

          {/* 통합 챗봇 버튼 */}
          <motion.button
            className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white p-3 rounded-full shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onChatbotToggle}
          >
            <FaComment className="text-primary text-xl" />
          </motion.button>
        </div>
      </motion.div>

      {/* 레벨과 진행 바를 하나의 컴팩트한 컨테이너로 */}
      <div className="w-full max-w-xs">
        {/* 레벨 표시 */}
        <p className="text-primary font-bold text-center mb-1">
          Lv.{currentStage.level} {currentStage.name}
        </p>

        {/* 진행 바 */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* 포인트 정보 */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs text-gray-500">{currentPoints}P</p>
          {nextStage && (
            <p className="text-xs text-gray-500">다음: {nextStage.requiredPoints}P</p>
          )}
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
    </>
  );
}
