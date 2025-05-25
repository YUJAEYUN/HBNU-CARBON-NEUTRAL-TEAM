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

// 인증 유형별 캐릭터 메시지 (OpenAI 결과에 따라)
const getCharacterMessage = (type: CertificationType, certificationResult?: any): string => {
  const baseMessages = {
    tumbler: "텀블러 사용 최고!",
    container: "다회용기 짱!",
    receipt: "전자영수증 굿!",
    email: "이메일 정리 완벽!",
    refill: "리필 최고!",
    recycle: "분리배출 훌륭!",
    other: "잘했어요!"
  };

  // OpenAI 분석 결과에 따른 특별 메시지
  if (certificationResult?.analysisResult && !certificationResult.analysisResult.includes('목업')) {
    const confidence = certificationResult.confidence || 0;
    if (confidence >= 90) {
      return `완벽한 ${type === 'tumbler' ? '텀블러' : '인증'}! AI가 ${confidence}% 확신해요! 🎉`;
    } else if (confidence >= 80) {
      return `훌륭한 ${type === 'tumbler' ? '텀블러' : '인증'}! AI 분석 통과! ✨`;
    } else {
      return `좋아요! AI가 인증을 확인했어요! 👍`;
    }
  }

  return baseMessages[type] || "잘했어요!";
};



interface CertificationAnimationProps {
  isVisible: boolean;
  certificationType: CertificationType;
  onComplete: () => void;
  certificationResult?: {
    success: boolean;
    verified: boolean;
    carbonReduction: number;
    points: number;
    confidence?: number;
    analysisResult?: string;
    error?: string;
    reason?: string;
  };
}

interface AnimationStage {
  stage: 'loading' | 'analyzing' | 'result' | 'failed' | 'character' | 'complete';
  progress: number;
}

export default function CertificationAnimation({
  isVisible,
  certificationType,
  onComplete,
  certificationResult
}: CertificationAnimationProps) {
  const [animationStage, setAnimationStage] = useState<AnimationStage>({
    stage: 'loading',
    progress: 0
  });

  const typeInfo = CERTIFICATION_TYPE_INFO[certificationType];

  // 애니메이션 시퀀스 관리
  useEffect(() => {
    if (!isVisible || !certificationResult) return;

    const sequence = async () => {
      // 1단계: 로딩 (1.5초)
      setAnimationStage({ stage: 'loading', progress: 0 });
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2단계: 분석 중 (2초)
      setAnimationStage({ stage: 'analyzing', progress: 0 });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3단계: 결과 표시 - OpenAI 분석 결과에 따라 분기
      if (certificationResult.success === false || !certificationResult.verified) {
        // 실패 애니메이션
        setAnimationStage({ stage: 'failed', progress: 0 });
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        // 성공 애니메이션
        setAnimationStage({ stage: 'result', progress: 0 });
        await new Promise(resolve => setTimeout(resolve, 2500));

        // 4단계: 캐릭터 칭찬 (성공한 경우에만)
        setAnimationStage({ stage: 'character', progress: 0 });
        await new Promise(resolve => setTimeout(resolve, 2500));
      }

      // 5단계: 완료
      setAnimationStage({ stage: 'complete', progress: 100 });
      setTimeout(() => {
        // 성공한 경우에만 커스텀 이벤트 발생
        if (certificationResult.success && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('certificationUpdated'));
        }
        onComplete();
      }, 800);
    };

    sequence();
  }, [isVisible, onComplete, certificationResult]);

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
                OpenAI 분석 준비 중...
              </h3>
              <p className="text-gray-600">
                GPT-4o가 이미지를 분석할 준비를 하고 있어요
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
                {certificationResult ?
                  `OpenAI GPT-4o가 ${typeInfo.label} 인증을 분석하고 있어요` :
                  `${typeInfo.label} 인증을 확인하고 있어요`
                }
              </p>
              {certificationResult?.analysisResult && (
                <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  분석 진행 중...
                </div>
              )}
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
                {certificationResult?.analysisResult?.includes('목업') ?
                  '인증 성공! (테스트 모드)' :
                  'AI 인증 성공!'
                }
              </h3>

              {/* OpenAI 분석 결과 표시 */}
              {certificationResult?.analysisResult && !certificationResult.analysisResult.includes('목업') && (
                <div className="mb-4 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-blue-800 mb-1">AI 분석 결과</p>
                  <p>{certificationResult.analysisResult.split('REASON: ')[1]?.split('CARBON_REDUCTION:')[0]?.trim() || '분석 완료'}</p>
                </div>
              )}

              <div className="space-y-3 mb-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">탄소 절감량</p>
                  <p className="text-lg font-bold text-green-600">
                    {certificationResult?.carbonReduction || typeInfo.carbonReduction}kg CO₂
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">획득 포인트</p>
                  <p className="text-lg font-bold text-blue-600">
                    +{certificationResult?.points || typeInfo.points}P
                  </p>
                </div>
                {certificationResult?.confidence && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">신뢰도</p>
                    <p className="text-lg font-bold text-gray-600">
                      {certificationResult.confidence}%
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 실패 단계 */}
          {animationStage.stage === 'failed' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.div>

              <h3 className="text-xl font-bold text-red-600 mb-4">
                {certificationResult?.error?.includes('네트워크') ?
                  '네트워크 오류' :
                  'AI 인증 실패'
                }
              </h3>

              {/* OpenAI 분석 결과 표시 */}
              {certificationResult?.analysisResult && (
                <div className="mb-4 text-xs text-gray-600 bg-orange-50 p-3 rounded-lg">
                  <p className="font-medium text-orange-800 mb-1">AI 분석 결과</p>
                  <p>{certificationResult.analysisResult.split('REASON: ')[1]?.split('CARBON_REDUCTION:')[0]?.trim() || '분석 실패'}</p>
                </div>
              )}

              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">실패 사유</p>
                <p className="text-sm text-red-600">
                  {certificationResult?.reason || certificationResult?.error || "텀블러가 명확하게 보이지 않습니다."}
                </p>
                {certificationResult?.confidence && (
                  <p className="text-xs text-gray-500 mt-2">
                    AI 신뢰도: {certificationResult.confidence}%
                  </p>
                )}
              </div>

              <p className="text-gray-600 text-sm">
                다시 시도해주세요
              </p>
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
                  {getCharacterMessage(certificationType, certificationResult)}
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
