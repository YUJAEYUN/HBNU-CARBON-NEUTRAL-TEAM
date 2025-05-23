"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSpinner, FaCheck, FaTimes, FaRedo, FaCamera, FaMapMarkerAlt } from 'react-icons/fa';
import { CertificationType, CERTIFICATION_TYPE_INFO } from '@/types/certification';
import { motion, AnimatePresence } from 'framer-motion';

interface CertificationAnalysisResult {
  success: boolean;
  message?: string;
  confidence?: number;
}

export default function CameraPage() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<CertificationAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<CertificationType>('other');
  const [showTypeList, setShowTypeList] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [selectedTypeForModal, setSelectedTypeForModal] = useState<CertificationType | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const selectedTypeInfo = CERTIFICATION_TYPE_INFO[selectedType];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleCameraClick = () => {
    setShowGuideModal(true);
  };

  const handleLocationClick = () => {
    setShowLocationModal(true);
  };

  const handleStartCapture = () => {
    setShowGuideModal(false);
    setIsCapturing(true);
  };

  const toggleTypeList = () => setShowTypeList(!showTypeList);
  const handleSelectType = (type: CertificationType) => {
    setSelectedType(type);
    setShowTypeList(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value);

  // 카테고리 버튼 UI로 변경하여 관련 함수 제거

  const uploadImage = async () => {
    if (!imageFile) return;

    const certTitle = title.trim() || `${selectedTypeInfo.label} 인증`;
    const certLocation = location.trim() || '위치 정보 없음';

    setIsLoading(true);
    setError(null);

    try {
      const result: CertificationAnalysisResult = {
        success: true,
        message: '이미지가 성공적으로 분석되었습니다.',
        confidence: 0.95,
      };
      setAnalysisResult(result);

      if (result.success) {
        const newCertification = {
          id: Date.now(),
          type: selectedType,
          title: certTitle,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          timeAgo: '방금 전',
          location: certLocation,
          carbonReduction: selectedTypeInfo.carbonReduction || Math.round(Math.random() * 30) / 100,
          verified: false,
          status: '검토중',
          points: selectedTypeInfo.points || Math.round(Math.random() * 20) + 5,
          image: image || '/certification/tumbler.jpg',
        };

        const existing = localStorage.getItem('certifications');
        const certs = existing ? JSON.parse(existing) : [];
        localStorage.setItem('certifications', JSON.stringify([newCertification, ...certs]));

        setTimeout(() => router.push('/certification'), 3000);
      }
    } catch (err) {
      console.error('이미지 업로드 오류:', err);
      setError(err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setImage(null);
    setImageFile(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleRetake = () => {
    setIsCapturing(false);
  };

  const handleSubmit = () => {
    // TODO: 이미지 저장 및 서버 전송 로직 구현
    router.push('/certification');
  };

  // 인증 방법 모달 내용 생성 함수
  const renderMethodModalContent = () => {
    if (!selectedTypeForModal) return null;

    const typeInfo = CERTIFICATION_TYPE_INFO[selectedTypeForModal];

    // 각 인증 유형별 인증 방법 설명
    const methodDescriptions: Record<CertificationType, { steps: string[], tips: string[] }> = {
      'tumbler': {
        steps: [
          '텀블러를 사용한 음료 구매 후 영수증과 함께 촬영해주세요.',
          '텀블러와 음료가 함께 보이도록 촬영해주세요.',
          '가게 이름이나 위치가 보이면 더 좋습니다.'
        ],
        tips: [
          '일회용컵 대신 텀블러를 사용하면 약 12g의 탄소 배출량을 줄일 수 있어요!',
          '텀블러 사용 시 많은 카페에서 할인 혜택을 제공합니다.'
        ]
      },
      'container': {
        steps: [
          '다회용기에 음식을 포장한 모습을 촬영해주세요.',
          '가게 이름이나 위치가 보이도록 함께 촬영하면 좋습니다.',
          '영수증이 있다면 함께 촬영해주세요.'
        ],
        tips: [
          '일회용 용기 대신 다회용기를 사용하면 약 25g의 탄소 배출량을 줄일 수 있어요!',
          '다회용기 사용 시 일부 가게에서는 할인 혜택을 제공합니다.'
        ]
      },
      'receipt': {
        steps: [
          '전자영수증 사용 화면을 캡처하거나 촬영해주세요.',
          '영수증 정보(가게명, 날짜, 금액)가 잘 보이도록 해주세요.'
        ],
        tips: [
          '종이영수증 1장 대신 전자영수증을 사용하면 약 5g의 탄소 배출량을 줄일 수 있어요!',
          '전자영수증은 분실 걱정 없이 관리할 수 있어 편리합니다.'
        ]
      },
      'email': {
        steps: [
          '삭제한 이메일 목록 또는 휴지통 화면을 캡처해주세요.',
          '삭제한 이메일 개수가 보이도록 해주세요.'
        ],
        tips: [
          '불필요한 이메일 50개를 삭제하면 약 3g의 탄소 배출량을 줄일 수 있어요!',
          '정기적인 이메일 정리는 디지털 탄소발자국을 줄이는 좋은 방법입니다.'
        ]
      },
      'refill': {
        steps: [
          '리필스테이션 사용 모습을 촬영해주세요.',
          '리필한 제품과 용기가 함께 보이도록 해주세요.',
          '가게 이름이나 위치가 보이면 더 좋습니다.'
        ],
        tips: [
          '리필스테이션을 이용하면 약 18g의 탄소 배출량을 줄일 수 있어요!',
          '리필 제품은 일반 제품보다 가격이 저렴한 경우가 많습니다.'
        ]
      },
      'recycle': {
        steps: [
          '전자제품 분리배출 모습을 촬영해주세요.',
          '배출한 제품의 종류가 식별 가능하도록 촬영해주세요.',
          '분리수거함이나 수거 장소가 함께 보이면 좋습니다.'
        ],
        tips: [
          '전자제품을 올바르게 분리배출하면 약 30g의 탄소 배출량을 줄일 수 있어요!',
          '배터리는 반드시 분리하여 배출해야 합니다.'
        ]
      },
      'other': {
        steps: [
          '탄소중립에 기여하는 활동 모습을 촬영해주세요.',
          '활동 내용을 잘 알 수 있도록 상세히 촬영해주세요.'
        ],
        tips: [
          '일상 속 작은 실천이 모여 큰 변화를 만듭니다!',
          '새로운 탄소중립 활동을 발굴하면 추가 포인트를 받을 수 있어요.'
        ]
      }
    };

    const methodInfo = methodDescriptions[selectedTypeForModal];

    return (
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: `${typeInfo.color}30` }}
          >
            <span className="text-2xl">{typeInfo.icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{typeInfo.label} 인증</h3>
            <p className="text-sm text-gray-500">인증 방법을 확인해보세요</p>
          </div>
        </div>

        <div className="mb-5">
          <h4 className="font-semibold text-gray-700 mb-2">인증 방법</h4>
          <ol className="list-decimal pl-5 space-y-2">
            {methodInfo.steps.map((step, index) => (
              <li key={index} className="text-gray-600">{step}</li>
            ))}
          </ol>
        </div>

        <div className="mb-5 bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-green-700 mb-2">알아두세요!</h4>
          <ul className="list-disc pl-5 space-y-2">
            {methodInfo.tips.map((tip, index) => (
              <li key={index} className="text-green-600">{tip}</li>
            ))}
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium"
            onClick={() => setShowMethodModal(false)}
          >
            취소
          </button>
          <button
            className="flex-1 py-3 bg-primary text-white rounded-xl font-medium"
            onClick={() => {
              setShowMethodModal(false);
              router.push(`/certification/${selectedTypeForModal}`);
            }}
          >
            인증하러 가기
          </button>
        </div>
      </div>
    );
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

      {/* 인증 방법 모달 */}
      {showMethodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 max-w-md mx-auto"
             style={{ width: "100%", left: 0, right: 0, margin: "0 auto" }}
             onClick={() => setShowMethodModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            {renderMethodModalContent()}
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
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full ${isCapturing ? 'block' : 'hidden'}`}
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
                onClick={() => {
                  setSelectedType(typeInfo.id);
                  setSelectedTypeForModal(typeInfo.id);
                  setShowMethodModal(true);
                }}
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
