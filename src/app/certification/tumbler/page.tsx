'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';

export default function TumblerCertificationPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptImageFile, setReceiptImageFile] = useState<File | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptCameraInputRef = useRef<HTMLInputElement>(null);
  const receiptFileInputRef = useRef<HTMLInputElement>(null);
  const [showImageBox, setShowImageBox] = useState(false);
  const [showReceiptImageBox, setShowReceiptImageBox] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleReceiptImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptImage(URL.createObjectURL(file));
      setReceiptImageFile(file);
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

  const handleScreenshotUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleReceiptCameraClick = () => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      alert('데스크탑 환경에서는 카메라 촬영이 지원되지 않습니다.');
      return;
    }
    receiptCameraInputRef.current?.click();
  };

  const handleReceiptScreenshotUploadClick = () => {
    receiptFileInputRef.current?.click();
  };

  const handleUploadCertification = () => {
    if (!imageFile) {
      alert('인증 이미지를 등록해주세요.');
      console.log('[Tumbler Upload] 인증 이미지 파일 없음');
      return;
    }

    const newCertification = {
      id: Date.now(),
      type: 'tumbler', // 텀블러 카테고리 ID
      title: title.trim() || '텀블러 인증', // 입력 제목 또는 기본값
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      timeAgo: '방금 전', // 실제 구현에서는 경과 시간 계산 필요
      location: '위치 정보 없음', // 필요에 따라 위치 정보 추가
      carbonReduction: Math.round(Math.random() * 30) / 100, // 임시 탄소 절감량
      verified: false,
      status: '검토중', // 초기 상태
      points: Math.round(Math.random() * 20) + 5, // 임시 포인트
      image: image, // 미리보기 URL (실제로는 파일 업로드 후 URL 사용)
      receiptImage: receiptImage, // 영수증 미리보기 URL
      // 실제 서버 업로드 시 imageFile, receiptImageFile 사용
    };

    console.log('[Tumbler Upload] Saving certification:', newCertification);

    const existing = localStorage.getItem('certifications');
    const certs = existing ? JSON.parse(existing) : [];
    
    console.log('[Tumbler Upload] Existing certifications:', certs);

    localStorage.setItem('certifications', JSON.stringify([newCertification, ...certs]));
    
    console.log('[Tumbler Upload] Certifications after saving:', JSON.parse(localStorage.getItem('certifications') || '[]'));

    // 메인 인증 페이지로 이동
    router.push('/certification');
    console.log('[Tumbler Upload] Navigating to /certification');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 상단 헤더 */}
      <div className="ios-header bg-white text-gray-800 z-20 relative">
        <button
          className="text-gray-800 text-base"
          onClick={() => router.back()}
        >
          뒤로
        </button>
        <h1 className="text-xl font-semibold">텀블러 인증</h1>
        <div className="flex gap-2 w-10">
          {/* 우측 여백 */}
        </div>
      </div>

      {/* 페이지 내용 */}
      <div className="flex-1 p-4 overflow-y-auto min-h-[110vh]">
        {/* 탄소 절감량 정보 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">탄소 절감량</h2>
          <p className="text-gray-600">텀블러 사용으로 인해 <span className="font-bold text-primary">0.3kg</span>의 탄소를 절감했습니다.</p>
        </div>
        {/* 탄소중립활동 인증 네모 박스 */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <span className="text-base font-semibold text-gray-800">탄소중립활동 인증하기</span>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm active:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              선택
            </button>
            <button
              className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full border border-gray-200 shadow-sm active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-transform"
              onClick={() => setShowImageBox((prev) => !prev)}
            >
              <FaChevronDown className={`text-gray-600 text-lg transition-transform duration-200 ${showImageBox ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        {/* 선택된 이미지 미리보기 창 (토글) */}
        {showImageBox && (
          <div className="w-3/4 aspect-square mx-auto bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
            {image ? (
              <img src={image} alt="인증 이미지 미리보기" className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-gray-500">사진 선택</span>
            )}
          </div>
        )}
        {/* 영수증 인증하기 네모 박스 */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <span className="text-base font-semibold text-gray-800">영수증 인증하기</span>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm active:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => receiptFileInputRef.current?.click()}
            >
              선택
            </button>
            <button
              className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full border border-gray-200 shadow-sm active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-transform"
              onClick={() => setShowReceiptImageBox((prev) => !prev)}
            >
              <FaChevronDown className={`text-gray-600 text-lg transition-transform duration-200 ${showReceiptImageBox ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        {/* 영수증 이미지 미리보기 창 (토글) */}
        {showReceiptImageBox && (
          <div className="w-3/4 aspect-square mx-auto bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden cursor-pointer mb-6" onClick={() => receiptFileInputRef.current?.click()}>
            {receiptImage ? (
              <img src={receiptImage} alt="영수증 이미지 미리보기" className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-gray-500">영수증 사진 선택</span>
            )}
          </div>
        )}

        {/* 인증 업로드 버튼 */}
        <div className="mt-4 pb-8">
          <button
            className="w-full bg-primary text-white py-3 rounded-xl text-base font-semibold"
            onClick={handleUploadCertification}
          >
            인증 업로드
          </button>
        </div>

        {/* 숨겨진 파일 입력 필드 */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* 숨겨진 영수증 파일 입력 필드 */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={receiptCameraInputRef}
          onChange={handleReceiptImageChange}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          ref={receiptFileInputRef}
          onChange={handleReceiptImageChange}
          className="hidden"
        />

        {/* 기타 텀블러 인증 관련 내용 */}
        {/* <p>텀블러 인증 페이지 내용</p> */}

      </div>
    </div>
  );
} 