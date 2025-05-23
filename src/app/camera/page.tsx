"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSpinner, FaCheck, FaTimes, FaRedo, FaChevronDown, FaCamera, FaMapMarkerAlt } from 'react-icons/fa';
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
  const [showCategoryModal, setShowCategoryModal] = useState(false);
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

  const handleGoToCert = () => setShowCategoryModal(true);
  const handleSelectTypeModal = (type: CertificationType) => {
    setSelectedType(type);
    setShowCategoryModal(false);
  };

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

      {/* 중앙 인증하러가기 버튼 */}
      <div className="absolute inset-0 flex items-center justify-center z-10 -mt-20">
        <div className="w-[90%] relative">
          <button
            className="w-full flex items-center justify-center p-2 bg-primary text-white rounded-2xl text-sm h-9"
            onClick={() => setShowCategoryModal(!showCategoryModal)}
          >
            <div className="flex items-center">
              <span>인증하러가기</span>
            </div>
            <FaChevronDown className={`text-white transition-transform absolute right-3 ${showCategoryModal ? 'rotate-180' : ''}`} />
          </button>
          {showCategoryModal && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="py-1">
                {Object.values(CERTIFICATION_TYPE_INFO).map((typeInfo) => (
                  <button
                    key={typeInfo.id}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-sm"
                    onClick={() => {
                      setSelectedType(typeInfo.id);
                      setShowCategoryModal(false);
                      if (typeInfo.id === 'tumbler') {
                        router.push('/certification/tumbler');
                      }
                      if (typeInfo.id === 'container') {
                        router.push('/certification/container');
                      }
                      if (typeInfo.id === 'email') {
                        router.push('/certification/email');
                      }
                      if (typeInfo.id === 'receipt') {
                        router.push('/certification/receipt');
                      }
                      if (typeInfo.id === 'refill') {
                        router.push('/certification/refill');
                      }
                      if (typeInfo.id === 'recycle') {
                        router.push('/certification/recycle');
                      }
                      if (typeInfo.id === 'other') {
                        router.push('/certification/other');
                      }
                    }}
                  >
                    <span className="mr-2">{typeInfo.icon}</span>
                    {typeInfo.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
