"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FaComment } from "react-icons/fa";
import { CharacterStage } from "../constants";
import { useState, useEffect, useRef } from "react";
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
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [pointsGained, setPointsGained] = useState(0);
  const [animatedPoints, setAnimatedPoints] = useState(currentPoints);
  const [animatedProgress, setAnimatedProgress] = useState(progressPercentage);
  const prevPointsRef = useRef(currentPoints);

  // 초기값 설정
  useEffect(() => {
    setAnimatedPoints(currentPoints);
    setAnimatedProgress(progressPercentage);
  }, []);

  // 포인트 변화 감지 및 애니메이션
  useEffect(() => {
    if (currentPoints > prevPointsRef.current) {
      const gained = currentPoints - prevPointsRef.current;
      setPointsGained(gained);
      setShowPointsAnimation(true);
      setHoverState("happy");

      // 포인트 카운트업 애니메이션
      const startPoints = prevPointsRef.current;
      const endPoints = currentPoints;
      const duration = 1500; // 1.5초
      const startTime = Date.now();

      const animatePoints = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const currentAnimatedPoints = Math.round(startPoints + (endPoints - startPoints) * easeOutQuart);
        setAnimatedPoints(currentAnimatedPoints);

        if (progress < 1) {
          requestAnimationFrame(animatePoints);
        }
      };

      animatePoints();

      // 진행바 애니메이션
      setTimeout(() => {
        setAnimatedProgress(progressPercentage);
      }, 500);

      // 애니메이션 정리
      setTimeout(() => {
        setShowPointsAnimation(false);
        setHoverState("idle");
      }, 3000);
    }

    prevPointsRef.current = currentPoints;
  }, [currentPoints, progressPercentage]);

  return (
    <>
      {/* 포인트 증가 애니메이션 */}
      <AnimatePresence>
        {showPointsAnimation && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -50 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-xl font-bold">+{pointsGained}P</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 캐릭터 이미지 */}
      <motion.div
        className="w-56 h-56 bg-toss-green/10 rounded-full flex items-center justify-center mt-4 mb-6 relative"
        onMouseEnter={() => setHoverState("happy")}
        onMouseLeave={() => setHoverState("idle")}
        animate={showPointsAnimation ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.6 }}
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
            className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-toss-green text-white p-3 rounded-full shadow-toss-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onChatbotToggle}
          >
            <FaComment className="text-xl" />
          </motion.button>
        </div>
      </motion.div>

      {/* 레벨과 진행 바를 하나의 컴팩트한 컨테이너로 */}
      <div className="w-full max-w-xs">
        {/* 레벨 표시 */}
        <p className="text-toss-green font-bold text-center mb-3 text-lg">
          Lv.{currentStage.level} {currentStage.name}
        </p>

        {/* 진행 바 */}
        <div className="w-full bg-toss-gray-200 rounded-full h-3 mb-3 relative overflow-hidden">
          <motion.div
            className="bg-toss-green h-3 rounded-full"
            initial={{ width: `${animatedProgress}%` }}
            animate={{ width: `${animatedProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          {showPointsAnimation && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-toss-green to-toss-green/80 h-3 rounded-full opacity-50"
              initial={{ width: "0%" }}
              animate={{ width: `${animatedProgress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}
        </div>

        {/* 포인트 정보 */}
        <div className="flex justify-between items-center mb-6">
          <motion.p
            className="text-sm text-toss-gray-600 font-medium"
            animate={showPointsAnimation ? { scale: [1, 1.2, 1], color: ["#6B7684", "#22C55E", "#6B7684"] } : {}}
            transition={{ duration: 0.8 }}
          >
            {animatedPoints}P
          </motion.p>
          {nextStage && (
            <p className="text-sm text-toss-gray-600">다음: {nextStage.requiredPoints}P</p>
          )}
        </div>
      </div>

      {nextStage ? (
        <p className="text-toss-gray-600 text-sm text-center">
          다음 레벨까지 {pointsToNextLevel}포인트 더 모으면 됩니다
        </p>
      ) : (
        <p className="text-toss-green font-medium text-sm text-center">
          최고 레벨에 도달했습니다!
        </p>
      )}
    </>
  );
}
