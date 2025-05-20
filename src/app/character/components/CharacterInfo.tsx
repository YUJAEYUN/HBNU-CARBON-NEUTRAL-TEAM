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
            className={`p-2 rounded ${
              currentStage.level >= stage.level 
                ? 'bg-primary-light' 
                : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <span className={`text-5xl mr-3 ${currentStage.level >= stage.level ? '' : 'filter blur-sm'}`}>
                {stage.image}
              </span>
              <div>
                <p className={`font-medium ${currentStage.level >= stage.level ? '' : 'filter blur-sm'}`}>
                  Lv.{stage.level} {stage.name}
                  {currentStage.level === stage.level && " (현재)"}
                </p>
                <p className={`text-xs text-primary-dark ${currentStage.level >= stage.level ? '' : 'filter blur-sm'}`}>
                  {stage.requiredPoints}+ 포인트
                </p>
              </div>
            </div>
            {currentStage.level < stage.level && (
              <p className="text-xs text-gray-500 mt-1 ml-16">
                {stage.requiredPoints - currentPoints}포인트 더 모으면 볼 수 있어요
              </p>
            )}
          </div>
        ))}
      </div>
      <button
        className="mt-3 text-sm text-gray-500"
        onClick={onClose}
      >
        닫기
      </button>
    </motion.div>
  );
}
