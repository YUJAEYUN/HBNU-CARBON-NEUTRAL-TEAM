'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSpinner, FaCheck, FaTimes, FaRedo } from 'react-icons/fa';
import { analyzeImage, CertificationAnalysisResult } from '@/utils/api';

export default function CameraPage() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<CertificationAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  // 이미지를 FastAPI 백엔드로 업로드하는 함수
  const uploadImage = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);

    try {
      // API 유틸리티 함수를 사용하여 이미지 분석
      const result = await analyzeImage(imageFile);
      setAnalysisResult(result);

      // 분석 성공 시 3초 후 인증 페이지로 이동
      if (result.success) {
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
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-white relative p-4 pt-20">
      {/* 상단: 뒤로가기 + 제목 */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <button
          className="text-2xl text-gray-700"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          <FaArrowLeft />
        </button>
        <span className="text-lg font-semibold text-gray-800">사진 인증</span>
      </div>

      {/* 버튼 영역 */}
      {!image && !isLoading && (
        <div className="flex flex-row gap-4 mb-6 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
            onClick={handleCameraClick}
          >
            <span>카메라 촬영</span>
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <span>이미지 업로드</span>
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

      {/* 이미지 미리보기 */}
      {image && !analysisResult && (
        <div className="w-64 h-64 border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
          <img
            src={image}
            alt="인증 사진"
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-8">
          <div className="animate-spin text-primary text-4xl mb-4">
            <FaSpinner />
          </div>
          <p className="text-gray-600">이미지를 분석 중입니다...</p>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4 mb-4 w-full max-w-md">
          <div className="flex items-center">
            <FaTimes className="text-red-500 mr-2" />
            <p>{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="mt-3 bg-white border border-red-300 text-red-500 px-4 py-2 rounded-md w-full flex items-center justify-center gap-2"
          >
            <FaRedo className="text-sm" />
            <span>다시 시도하기</span>
          </button>
        </div>
      )}

      {/* 분석 결과 */}
      {analysisResult && (
        <div className={`w-full max-w-md p-4 rounded-lg mt-4 mb-4 ${
          analysisResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            <div className={`p-3 rounded-full mr-3 ${
              analysisResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {analysisResult.success ? <FaCheck /> : <FaTimes />}
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                {analysisResult.success ? '인증 성공!' : '인증 실패'}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {analysisResult.message || (analysisResult.success ? '이미지가 성공적으로 분석되었습니다.' : '이미지 분석에 실패했습니다.')}
              </p>

              {analysisResult.success && (
                <>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-white p-2 rounded-md">
                      <p className="text-xs text-gray-500">인증 유형</p>
                      <p className="font-medium">{analysisResult.certification_type || '일반'}</p>
                    </div>
                    <div className="bg-white p-2 rounded-md">
                      <p className="text-xs text-gray-500">탄소 절감량</p>
                      <p className="font-medium">{analysisResult.carbon_reduction || 0}kg</p>
                    </div>
                    <div className="bg-white p-2 rounded-md">
                      <p className="text-xs text-gray-500">획득 포인트</p>
                      <p className="font-medium">{analysisResult.points || 0}P</p>
                    </div>
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    잠시 후 인증 목록 페이지로 이동합니다...
                  </div>
                </>
              )}

              {!analysisResult.success && (
                <button
                  onClick={handleRetry}
                  className="mt-3 bg-white border border-red-300 text-red-500 px-4 py-2 rounded-md w-full flex items-center justify-center gap-2"
                >
                  <FaRedo className="text-sm" />
                  <span>다시 시도하기</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 이미지 미리보기 (분석 결과가 있을 때) */}
      {image && analysisResult && (
        <div className="w-64 h-64 border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
          <img
            src={image}
            alt="인증 사진"
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>
      )}

      {/* 인증 업로드 버튼 */}
      {image && !isLoading && !analysisResult && !error && (
        <div className="flex gap-3">
          <button
            className="px-6 py-3 bg-gray-400 text-white rounded-md"
            onClick={handleRetry}
          >
            다시 찍기
          </button>
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-md"
            onClick={uploadImage}
          >
            인증 업로드
          </button>
        </div>
      )}
    </main>
  );
}
