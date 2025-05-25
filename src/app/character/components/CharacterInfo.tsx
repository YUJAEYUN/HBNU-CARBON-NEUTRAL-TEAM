"use client";
import { motion } from "framer-motion";
import { CHARACTER_STAGES, CharacterStage } from "../constants";

interface CharacterInfoProps {
  currentStage: CharacterStage;
  currentPoints: number;
  onClose: () => void;
}

export default function CharacterInfo({
  currentStage,
  currentPoints,
  onClose
}: CharacterInfoProps) {
  return (
    <motion.div
      className="absolute top-16 right-4 bg-white p-5 rounded-2xl shadow-toss-3 border border-toss-gray-200 z-10 w-[90%] max-w-xs"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3 className="font-bold text-toss-gray-900 mb-4">캐릭터 성장 정보</h3>
      <div className="space-y-3">
        {CHARACTER_STAGES.map((stage) => (
          <div
            key={stage.level}
            className={`p-3 rounded-xl ${
              currentStage.level >= stage.level
                ? 'bg-toss-green/10 border border-toss-green/20'
                : 'bg-toss-gray-50 border border-toss-gray-200'
            }`}
          >
            <div className="flex items-center">
              <span className={`text-4xl mr-3 ${currentStage.level >= stage.level ? '' : 'filter blur-sm'}`}>
                {stage.image}
              </span>
              <div>
                <p className={`font-medium text-toss-gray-900 ${currentStage.level >= stage.level ? '' : 'filter blur-sm'}`}>
                  Lv.{stage.level} {stage.name}
                  {currentStage.level === stage.level && " (현재)"}
                </p>
                <p className={`text-xs text-toss-green ${currentStage.level >= stage.level ? '' : 'filter blur-sm'}`}>
                  {stage.requiredPoints}+ 포인트
                </p>
              </div>
            </div>
            {currentStage.level < stage.level && (
              <p className="text-xs text-toss-gray-500 mt-2 ml-14">
                {stage.requiredPoints - currentPoints}포인트 더 모으면 볼 수 있어요
              </p>
            )}
          </div>
        ))}
      </div>
      <button
        className="mt-4 w-full py-2 text-sm text-toss-gray-600 bg-toss-gray-100 rounded-xl hover:bg-toss-gray-200 transition-colors"
        onClick={onClose}
      >
        닫기
      </button>
    </motion.div>
  );
}
