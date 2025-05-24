"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { CertificationType, CERTIFICATION_TYPE_INFO } from '@/types/certification';

// 간단한 로딩 애니메이션 (CSS로 대체)
const LoadingSpinner = () => (
  <div className="w-24 h-24 mx-auto mb-4 relative">
    <div className="absolute inset-0 border-4 border-primary-light rounded-full animate-spin border-t-primary"></div>
    <div className="absolute inset-2 bg-primary-light rounded-full opacity-20"></div>
  </div>
);

// 인증 유형별 캐릭터 메시지
const getCharacterMessage = (type: CertificationType): string => {
  const messages = {
    tumbler: "텀블러 사용 최고!",
    container: "다회용기 짱!",
    receipt: "전자영수증 굿!",
    email: "이메일 정리 완벽!",
    refill: "리필 최고!",
    recycle: "분리배출 훌륭!",
    other: "잘했어요!"
  };
  return messages[type] || "잘했어요!";
};



interface CertificationAnimationProps {
  isVisible: boolean;
  certificationType: CertificationType;
  onComplete: () => void;
}

interface AnimationStage {
  stage: 'loading' | 'analyzing' | 'result' | 'character' | 'complete';
  progress: number;
}

export default function CertificationAnimation({
  isVisible,
  certificationType,
  onComplete
}: CertificationAnimationProps) {
  const [animationStage, setAnimationStage] = useState<AnimationStage>({
    stage: 'loading',
    progress: 0
  });

  const typeInfo = CERTIFICATION_TYPE_INFO[certificationType];

  // 애니메이션 시퀀스 관리
  useEffect(() => {
    if (!isVisible) return;

    const sequence = async () => {
      // 1단계: 로딩 (1.5초)
      setAnimationStage({ stage: 'loading', progress: 0 });
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2단계: 분석 중 (2초)
      setAnimationStage({ stage: 'analyzing', progress: 0 });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3단계: 결과 표시 (2.5초)
      setAnimationStage({ stage: 'result', progress: 0 });
      await new Promise(resolve => setTimeout(resolve, 2500));

      // 4단계: 캐릭터 칭찬 (2.5초)
      setAnimationStage({ stage: 'character', progress: 0 });
      await new Promise(resolve => setTimeout(resolve, 2500));

      // 5단계: 완료
      setAnimationStage({ stage: 'complete', progress: 100 });
      setTimeout(() => {
        // 커스텀 이벤트 발생 (캐릭터 페이지에서 데이터 새로고침을 위해)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('certificationUpdated'));
        }
        onComplete();
      }, 800);
    };

    sequence();
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* 로딩 단계 */}
          {animationStage.stage === 'loading' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <LoadingSpinner />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                이미지 업로드 중...
              </h3>
              <p className="text-gray-600">
                잠시만 기다려주세요
              </p>
            </motion.div>
          )}

          {/* 분석 단계 */}
          {animationStage.stage === 'analyzing' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <motion.div
                  className="w-full h-full rounded-full border-4 border-primary-light"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div
                  className="absolute inset-2 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${typeInfo.color}30` }}
                >
                  <span className="text-2xl">{typeInfo.icon}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                AI 분석 중...
              </h3>
              <p className="text-gray-600">
                {typeInfo.label} 인증을 확인하고 있어요
              </p>
            </motion.div>
          )}

          {/* 결과 단계 */}
          {animationStage.stage === 'result' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>

              <h3 className="text-xl font-bold text-green-600 mb-4">
                인증 성공!
              </h3>

              <div className="space-y-3 mb-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">탄소 절감량</p>
                  <p className="text-lg font-bold text-green-600">
                    {typeInfo.carbonReduction}kg CO₂
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">획득 포인트</p>
                  <p className="text-lg font-bold text-blue-600">
                    +{typeInfo.points}P
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 캐릭터 칭찬 단계 */}
          {animationStage.stage === 'character' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* 말풍선 */}
              <motion.div
                className="bg-white border-2 border-primary rounded-lg px-4 py-2 shadow-lg mb-4 mx-auto max-w-xs"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm font-medium text-primary text-center">
                  {getCharacterMessage(certificationType)}
                </p>
              </motion.div>

              <motion.div
                className="w-32 h-32 mx-auto mb-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Image
                  src="/mainCharacter.png"
                  alt="대나무 캐릭터"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </motion.div>


            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
