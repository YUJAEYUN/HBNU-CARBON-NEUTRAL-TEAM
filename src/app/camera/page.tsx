'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSpinner, FaCheck, FaTimes, FaRedo, FaChevronDown, FaCamera } from 'react-icons/fa';
import { CertificationType, CERTIFICATION_TYPE_INFO } from '@/types/certification';

// 인증 분석 결과 타입 정의
interface CertificationAnalysisResult {
  success: boolean;
  message?: string;
  confidence?: number;
}
import { motion, AnimatePresence } from 'framer-motion';

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
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 선택된 인증 유형 정보
  const selectedTypeInfo = CERTIFICATION_TYPE_INFO[selectedType];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      // 새 이미지가 선택되면 이전 분석 결과와 에러 초기화
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleCameraClick = () => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      alert('데스크탑 환경에서는 카메라 촬영이 지원되지 않습니다.');
      return;
    }
    cameraInputRef.current?.click();
  };

  // 카테고리 선택 토글
  const toggleTypeList = () => {
    setShowTypeList(!showTypeList);
  };

  // 카테고리 선택 처리
  const handleSelectType = (type: CertificationType) => {
    setSelectedType(type);
    setShowTypeList(false);
  };

  // 제목 입력 처리
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 위치 입력 처리
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  // 이미지를 업로드하고 인증 등록하는 함수 (로컬 스토리지 사용)
  const uploadImage = async () => {
    if (!imageFile) return;

    // 제목이 없으면 기본 제목 설정
    const certTitle = title.trim() || `${selectedTypeInfo.label} 인증`;
    // 위치가 없으면 기본 위치 설정
    const certLocation = location.trim() || '위치 정보 없음';

    setIsLoading(true);
    setError(null);

    try {
      // 로컬에서 이미지 분석 시뮬레이션 (항상 성공)
      const result: CertificationAnalysisResult = {
        success: true,
        message: '이미지가 성공적으로 분석되었습니다.',
        confidence: 0.95
      };
      setAnalysisResult(result);

      // 분석 성공 시 인증 등록
      if (result.success) {
        // 새 인증 데이터 생성
        const newCertification = {
          id: Date.now(), // 고유 ID 생성
          type: selectedType,
          title: certTitle,
          date: new Date().toISOString().split('T')[0], // 현재 날짜
          time: new Date().toTimeString().split(' ')[0].substring(0, 5), // 현재 시간
          timeAgo: "방금 전",
          location: certLocation,
          carbonReduction: selectedTypeInfo.carbonReduction || Math.round(Math.random() * 30) / 100, // 탄소 감소량
          verified: false,
          status: "검토중",
          points: selectedTypeInfo.points || Math.round(Math.random() * 20) + 5, // 포인트
          image: image || "/certification/tumbler.jpg" // 이미지 URL
        };

        // 로컬 스토리지에서 기존 인증 목록 가져오기
        const existingCertifications = localStorage.getItem('certifications');
        let certifications = existingCertifications ? JSON.parse(existingCertifications) : [];

        // 새 인증을 목록 맨 앞에 추가
        certifications = [newCertification, ...certifications];

        // 로컬 스토리지에 저장
        localStorage.setItem('certifications', JSON.stringify(certifications));

        // 3초 후 인증 페이지로 이동
        setTimeout(() => {
          router.push('/certification');
        }, 3000);
      }
    } catch (err) {
      console.error('이미지 업로드 오류:', err);
      setError(err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 다시 시도하기
  const handleRetry = () => {
    setImage(null);
    setImageFile(null);
    setAnalysisResult(null);
    setError(null);
    // 제목과 위치는 유지 (사용자가 입력한 정보 보존)
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-white relative">
      {/* 상단: iOS 스타일 헤더 */}
      <div className="ios-header sticky top-0 z-10 w-full">
        <button
          className="ios-back-button"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          <FaArrowLeft className="mr-1" />
          <span>뒤로</span>
        </button>
        <h1 className="text-center text-lg font-semibold">사진 인증</h1>
        <div className="w-10"></div> {/* 균형을 위한 빈 공간 */}
      </div>

      <div className="w-full max-w-md px-4 pt-4 flex-1 flex flex-col items-center">

      {/* 카테고리 선택 영역 */}
      <div className="w-full max-w-md mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">인증 카테고리 선택</h3>
        <div className="relative">
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-md"
            onClick={toggleTypeList}
          >
            <div className="flex items-center">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                style={{ backgroundColor: selectedTypeInfo.color }}
              >
                {selectedTypeInfo.icon}
              </span>
              <div>
                <div className="font-medium">{selectedTypeInfo.label}</div>
                <div className="text-xs text-gray-500">{selectedTypeInfo.description}</div>
              </div>
            </div>
            <FaChevronDown className={`text-gray-400 transition-transform ${showTypeList ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showTypeList && (
              <motion.div
                className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg py-1 border border-gray-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {Object.values(CERTIFICATION_TYPE_INFO).map((typeInfo) => (
                  <button
                    key={typeInfo.id}
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                    onClick={() => handleSelectType(typeInfo.id)}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                      style={{ backgroundColor: typeInfo.color }}
                    >
                      {typeInfo.icon}
                    </span>
                    <div>
                      <div className="font-medium">{typeInfo.label}</div>
                      <div className="text-xs text-gray-500">{typeInfo.description}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 제목 입력 */}
      <div className="w-full max-w-md mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          인증 제목 (선택)
        </label>
        <input
          type="text"
          id="title"
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder={`${selectedTypeInfo.label} 인증`}
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      {/* 위치 입력 */}
      <div className="w-full max-w-md mb-6">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          위치 (선택)
        </label>
        <input
          type="text"
          id="location"
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="위치 정보"
          value={location}
          onChange={handleLocationChange}
        />
      </div>

      {/* 버튼 영역 - iOS 스타일 */}
      {!image && !isLoading && (
        <div className="flex flex-col w-full gap-3 mb-6 mt-4">
          <button
            className="w-full py-3 bg-primary text-white rounded-xl font-medium flex items-center justify-center"
            onClick={handleCameraClick}
          >
            <FaCamera className="mr-2" />
            <span>카메라로 촬영하기</span>
          </button>
          <button
            className="w-full py-3 bg-gray-100 text-gray-800 rounded-xl font-medium flex items-center justify-center border border-gray-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <span>사진 앨범에서 선택</span>
          </button>
        </div>
      )}

      {/* 숨겨진 input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      {/* 이미지 미리보기 - iOS 스타일 */}
      {image && !analysisResult && (
        <div className="w-full aspect-square border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 bg-gray-50">
          <img
            src={image}
            alt="인증 사진"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* 로딩 상태 - iOS 스타일 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 w-full">
          <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
            <div className="animate-spin text-primary text-2xl">
              <FaSpinner />
            </div>
          </div>
          <p className="text-gray-700 font-medium">이미지를 분석 중입니다...</p>
          <p className="text-gray-500 text-sm mt-1">잠시만 기다려주세요</p>
        </div>
      )}

      {/* 에러 메시지 - iOS 스타일 */}
      {error && (
        <div className="bg-red-50 rounded-xl p-5 shadow-sm mb-6 w-full">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-100 text-red-600">
              <FaTimes className="text-2xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-red-700">오류 발생</h3>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="w-full py-3 bg-white border border-red-300 text-red-500 rounded-xl font-medium flex items-center justify-center"
            >
              <FaRedo className="mr-2" />
              <span>다시 시도하기</span>
            </button>
          </div>
        </div>
      )}

      {/* 분석 결과 - iOS 스타일 */}
      {analysisResult && (
        <div className={`w-full rounded-xl p-5 shadow-sm mb-6 ${
          analysisResult.success ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              analysisResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {analysisResult.success ? <FaCheck className="text-2xl" /> : <FaTimes className="text-2xl" />}
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {analysisResult.success ? '인증 성공!' : '인증 실패'}
            </h3>
            <p className="text-gray-600 mb-4">
              {analysisResult.message || (analysisResult.success ? '이미지가 성공적으로 분석되었습니다.' : '이미지 분석에 실패했습니다.')}
            </p>

            {analysisResult.success && (
              <>
                <div className="grid grid-cols-3 gap-3 w-full mt-2 mb-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">인증 유형</p>
                    <p className="font-medium">{selectedTypeInfo.label}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">탄소 절감량</p>
                    <p className="font-medium">{selectedTypeInfo.carbonReduction}kg</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">획득 포인트</p>
                    <p className="font-medium">{selectedTypeInfo.points}P</p>
                  </div>
                </div>

                <div className="mt-2 text-center text-sm text-gray-500">
                  잠시 후 인증 목록 페이지로 이동합니다...
                </div>
              </>
            )}

            {!analysisResult.success && (
              <button
                onClick={handleRetry}
                className="w-full py-3 mt-4 bg-white border border-red-300 text-red-500 rounded-xl font-medium flex items-center justify-center"
              >
                <FaRedo className="mr-2" />
                <span>다시 시도하기</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 이미지 미리보기 (분석 결과가 있을 때) - iOS 스타일 */}
      {image && analysisResult && (
        <div className="w-full aspect-square border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 bg-gray-50">
          <img
            src={image}
            alt="인증 사진"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* 인증 업로드 버튼 - iOS 스타일 */}
      {image && !isLoading && !analysisResult && !error && (
        <div className="flex flex-col w-full gap-3">
          <button
            className="w-full py-3 bg-primary text-white rounded-xl font-medium flex items-center justify-center"
            onClick={uploadImage}
          >
            <FaCheck className="mr-2" />
            <span>인증 업로드</span>
          </button>
          <button
            className="w-full py-3 bg-gray-100 text-gray-800 rounded-xl font-medium flex items-center justify-center border border-gray-300"
            onClick={handleRetry}
          >
            <span>다시 찍기</span>
          </button>
        </div>
      )}
      </div>
    </main>
  );
}
