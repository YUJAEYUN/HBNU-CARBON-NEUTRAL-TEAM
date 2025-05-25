"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCamera, FaMapMarkerAlt } from 'react-icons/fa';
import { CertificationType, CERTIFICATION_TYPE_INFO } from '@/types/certification';

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
    <div className="flex flex-col h-screen bg-toss-gray-50">
      {/* 상단 헤더 - 토스 스타일 */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-toss-gray-200 sticky top-0 z-20">
        <button
          className="w-10 h-10 bg-toss-gray-100 rounded-full flex items-center justify-center hover:bg-toss-gray-200 transition-colors"
          onClick={() => router.back()}
        >
          <FaArrowLeft className="text-toss-gray-600 text-lg" />
        </button>
        <h1 className="text-xl font-bold text-toss-gray-900">사진 인증</h1>
        <div className="flex gap-2">
          <button
            className="w-10 h-10 bg-toss-gray-100 rounded-full flex items-center justify-center hover:bg-toss-gray-200 transition-colors"
            onClick={handleLocationClick}
          >
            <FaMapMarkerAlt className="text-toss-gray-600 text-lg" />
          </button>
          <button
            className="w-10 h-10 bg-toss-green/10 rounded-full flex items-center justify-center hover:bg-toss-green/20 transition-colors"
            onClick={handleCameraClick}
          >
            <FaCamera className="text-toss-green text-lg" />
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



      {/* 촬영 가이드 모달 - 토스 스타일 */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-5" onClick={() => setShowGuideModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-toss-3" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-center mb-6 text-toss-gray-900">인증방법</h2>
            <div className="bg-toss-gray-100 rounded-2xl w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📸</span>
            </div>
            <p className="text-center text-toss-gray-700 text-base mb-8">AI가 인식하기 쉽게 물체를 잘 놓아주세요!</p>
            <button
              className="w-full bg-toss-green text-white py-4 rounded-xl font-medium hover:bg-toss-green/90 transition-colors"
              onClick={() => setShowGuideModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 탄소중립 홍보 배너 - 토스 스타일 */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-r from-toss-green to-toss-green/80 rounded-2xl shadow-toss-2 p-6 relative overflow-hidden">
          <div className="absolute right-4 top-0 bottom-0 w-20 flex items-center justify-center opacity-20">
            <span className="text-6xl">🌱</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-2">탄소중립 챌린지</h3>
          <p className="text-white/90 text-sm mb-4">일상 속 작은 실천으로 지구를 지켜요!</p>
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full px-4 py-2 text-xs text-white font-medium">
              이번 주 참여자 1,234명
            </div>
          </div>
        </div>
      </div>

      {/* 카메라 뷰 */}
      <div className="flex-1 relative bg-toss-gray-900 rounded-t-2xl mx-5 overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
        {/* 카메라 플레이스홀더 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-toss-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FaCamera className="text-toss-gray-400 text-2xl" />
            </div>
            <p className="text-toss-gray-400 text-sm">카메라를 활성화하세요</p>
          </div>
        </div>
      </div>

      {/* 인증 카테고리 버튼 그리드 - 토스 스타일 */}
      <div className="px-5 py-6">
        <div className="bg-white rounded-2xl shadow-toss-2 border border-toss-gray-200 p-6">
          <h3 className="text-lg font-bold mb-4 text-toss-gray-900">인증 카테고리</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(CERTIFICATION_TYPE_INFO).map((typeInfo) => (
              <button
                key={typeInfo.id}
                className="flex flex-col items-center justify-center p-4 bg-toss-gray-50 hover:bg-toss-gray-100 rounded-xl transition-colors border border-toss-gray-200"
                onClick={() => handleCertificationSubmit(typeInfo.id)}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${typeInfo.color}20` }}
                >
                  <span className="text-3xl">{typeInfo.icon}</span>
                </div>
                <span className="text-sm font-medium text-toss-gray-700">{typeInfo.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
