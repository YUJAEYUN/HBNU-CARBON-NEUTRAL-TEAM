"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useVoiceStore } from "@/store/voiceStore";
import Image from "next/image";

// 캐릭터 상태 타입 정의
export type CharacterState =
  | "idle"
  | "talking"
  | "listening"
  | "thinking"
  | "happy"
  | "confused";

interface CharacterAnimationProps {
  currentState?: CharacterState;
  onAnimationComplete?: () => void;
  imagePath?: string;
}

export default function CharacterAnimation({
  currentState = "idle",
  onAnimationComplete,
  imagePath = "/mainCharacter.png"
}: CharacterAnimationProps) {
  const { isListening, isSpeaking } = useVoiceStore();
  const [characterState, setCharacterState] = useState<CharacterState>("idle");

  // 음성 상태에 따라 캐릭터 상태 업데이트
  useEffect(() => {
    if (isSpeaking) {
      setCharacterState("talking");
    } else if (isListening) {
      setCharacterState("listening");
    } else {
      // 외부에서 전달된 상태가 있으면 사용, 없으면 idle
      setCharacterState(currentState);
    }
  }, [isSpeaking, isListening, currentState]);

  // 상태에 따른 애니메이션 변형 설정
  const getAnimationVariants = () => {
    switch (characterState) {
      case "talking":
        return {
          animate: {
            y: [0, -5, 0, -5, 0],
            rotate: [0, 2, 0, -2, 0],
            transition: {
              y: { repeat: Infinity, duration: 1, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 1, ease: "easeInOut" }
            }
          }
        };
      case "listening":
        return {
          animate: {
            x: [0, 5, 0, -5, 0],
            transition: {
              x: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
            }
          }
        };
      case "thinking":
        return {
          animate: {
            rotate: [0, 5, 0],
            transition: {
              rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }
          }
        };
      case "happy":
        return {
          animate: {
            scale: [1, 1.1, 1],
            y: [0, -10, 0],
            transition: {
              scale: { repeat: Infinity, duration: 0.8, ease: "easeInOut" },
              y: { repeat: Infinity, duration: 0.8, ease: "easeInOut" }
            }
          }
        };
      case "confused":
        return {
          animate: {
            rotate: [0, 10, -10, 0],
            transition: {
              rotate: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
            }
          }
        };
      case "idle":
      default:
        return {
          animate: {
            y: [0, -3, 0],
            transition: {
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }
          }
        };
    }
  };

  // 상태에 따른 생각 말풍선 표시
  const renderThoughtBubble = () => {
    if (characterState === "thinking") {
      return (
        <motion.div
          className="absolute top-[-40px] right-[-20px]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-green-100 rounded-full w-5 h-5 mb-1 ml-auto mr-5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.div
            className="bg-green-100 rounded-full w-8 h-8 ml-auto mr-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
          />
        </motion.div>
      );
    }
    return null;
  };

  // 상태에 따른 말풍선 표시
  const renderSpeechBubble = () => {
    if (characterState === "talking") {
      return (
        <motion.div
          className="absolute top-[-30px] right-[-10px] bg-white rounded-lg p-2 shadow-md"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex space-x-1"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            <span className="w-2 h-2 bg-primary rounded-full" />
            <span className="w-2 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      );
    }
    return null;
  };

  const variants = getAnimationVariants();

  return (
    <div className="character-container relative">
      {renderThoughtBubble()}
      {renderSpeechBubble()}

      <motion.div
        initial="initial"
        animate="animate"
        variants={variants}
        onAnimationComplete={onAnimationComplete}
        className="relative w-40 h-40 -mt-8"
      >
        <Image
          src={imagePath}
          alt="대나무 캐릭터"
          width={160}
          height={160}
          className="object-contain"
          priority
        />

        {/* 상태에 따른 눈 애니메이션 (이미지 위에 겹쳐서 표시) */}
        {characterState === "listening" && (
          <motion.div
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <div className="w-3 h-3 bg-black rounded-full" />
            <div className="w-3 h-3 bg-black rounded-full" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
