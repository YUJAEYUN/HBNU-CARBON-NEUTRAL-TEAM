"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSpinner, FaCheck, FaTimes, FaRedo, FaCamera, FaMapMarkerAlt } from 'react-icons/fa';
import { CertificationType, CERTIFICATION_TYPE_INFO } from '@/types/certification';
import { motion, AnimatePresence } from 'framer-motion';

export default function CameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleCameraClick = () => {
    setShowGuideModal(true);
  };

  const handleLocationClick = () => {
    setShowLocationModal(true);
  };

  // 인증 페이지로 이동하는 함수
  const handleCertificationSubmit = (type: CertificationType) => {
    router.push(`/certification/${type}`);
  };



  return (
    <div className="flex flex-col h-full bg-white">
      {/* 상단 헤더 */}
      <div className="ios-header bg-white text-gray-800 z-20 relative">
        <button
          className="text-gray-800 text-base"
          onClick={() => router.back()}
        >
          뒤로
        </button>
        <h1 className="text-xl font-semibold">사진 인증</h1>
        <div className="flex gap-2">
          <button
            className="ios-icon-button w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg"
            onClick={handleLocationClick}
          >
            <FaMapMarkerAlt className="text-gray-800 text-lg" />
          </button>
          <button
            className="ios-icon-button w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg"
            onClick={handleCameraClick}
          >
            <FaCamera className="text-gray-800 text-lg" />
          </button>
        </div>
      </div>

      {/* 위치 정보 모달 (빈 흰색 창) */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowLocationModal(false)}>
          <div className="bg-white rounded-2xl w-[40%] max-w-sm p-4" onClick={(e) => e.stopPropagation()}>
            {/* 빈 내용 */}
          </div>
        </div>
      )}



      {/* 촬영 가이드 모달 */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowGuideModal(false)}>
          <div className="bg-white rounded-2xl w-[40%] max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-center mb-4">인증방법</h2>
            <div className="bg-gray-200 rounded-xl w-32 h-32 flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500 text-sm">이미지</span>
            </div>
            <p className="text-center text-gray-700 text-base mb-6">AI가 인식하기 쉽게 물체를 잘 놓아주세요!</p>
            <button
              className="w-full bg-primary text-white py-3 rounded-xl"
              onClick={() => setShowGuideModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 탄소중립 홍보 배너 */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md p-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center opacity-20">
            <span className="text-6xl">🌱</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">탄소중립 챌린지</h3>
          <p className="text-green-50 text-sm mb-2">일상 속 작은 실천으로 지구를 지켜요!</p>
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs text-white font-medium">
              이번 주 참여자 1,234명
            </div>
          </div>
        </div>
      </div>

      {/* 카메라 뷰 */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
      </div>

      {/* 인증 카테고리 버튼 그리드 - 토스 스타일 */}
      <div className="absolute inset-x-0 bottom-20 px-4 z-10">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">인증 카테고리</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(CERTIFICATION_TYPE_INFO).map((typeInfo) => (
              <button
                key={typeInfo.id}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => handleCertificationSubmit(typeInfo.id)}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${typeInfo.color}30` }}
                >
                  <span className="text-3xl">{typeInfo.icon}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{typeInfo.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
