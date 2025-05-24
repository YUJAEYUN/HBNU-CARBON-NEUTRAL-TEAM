'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import CertificationAnimation from '@/components/CertificationAnimation';

export default function OtherCertificationPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showImageBox, setShowImageBox] = useState(true);
  const [showDescBox, setShowDescBox] = useState(false);
  const [showCertificationAnimation, setShowCertificationAnimation] = useState(false);
  const [certificationInProgress, setCertificationInProgress] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
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

  const handleUploadCertification = () => {
    if (!imageFile || certificationInProgress) {
      return;
    }

    setCertificationInProgress(true);
    setShowCertificationAnimation(true);
  };

  // 인증 애니메이션 완료 후 처리
  const handleAnimationComplete = () => {
    setShowCertificationAnimation(false);
    setCertificationInProgress(false);

    // 인증 데이터 저장
    const newCertification = {
      id: Date.now(),
      type: 'other',
      title: title.trim() || '기타 탄소중립 활동 인증',
      desc: desc.trim(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      timeAgo: '방금 전',
      location: '내 위치',
      carbonReduction: 0.15,
      verified: false,
      status: '검토중',
      points: 15,
      image: image,
    };

    // 로컬 스토리지에 저장
    try {
      const existing = localStorage.getItem('certifications');
      const certs = existing ? JSON.parse(existing) : [];
      localStorage.setItem('certifications', JSON.stringify([newCertification, ...certs]));

      // 캐릭터 페이지로 이동
      router.push('/character');
    } catch (error) {
      console.error('[Other Upload] Error saving certification:', error);
      router.push('/character');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 상단 헤더 - 토스 스타일 */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm z-20 relative">
        <button
          className="text-gray-700 flex items-center"
          onClick={() => router.back()}
        >
          <FaArrowLeft className="mr-1" />
          <span>뒤로</span>
        </button>
        <h1 className="text-lg font-bold absolute left-1/2 transform -translate-x-1/2">기타 탄소중립 활동</h1>
        <div className="w-10"></div>
      </div>

      {/* 페이지 내용 */}
      <div className="flex-1 p-5 overflow-y-auto">
        {/* 탄소 절감량 정보 - 토스 스타일 카드 */}
        <div className="mb-6 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center mb-1">
              <span className="text-2xl mr-2">🌱</span>
              <h2 className="text-lg font-bold text-gray-800">탄소중립 활동 효과</h2>
            </div>
            <p className="text-gray-500 text-sm">다양한 탄소중립 활동을 통해</p>
          </div>
          <div className="p-5 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">탄소 절감량</p>
                <p className="text-2xl font-bold text-primary mt-1">0.15kg</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">획득 포인트</p>
                <p className="text-2xl font-bold text-primary mt-1">15P</p>
              </div>
            </div>
          </div>
        </div>

        {/* 인증 단계 안내 - 토스 스타일 */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">인증 방법</h3>
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <div className="flex items-start mb-4">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">탄소중립 활동 사진 촬영</p>
                <p className="text-gray-500 text-sm mt-1">탄소중립에 기여하는 활동 모습을 촬영해주세요.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">활동 설명 작성</p>
                <p className="text-gray-500 text-sm mt-1">어떤 활동을 했는지 간단히 설명해주세요.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 인증 사진 업로드 섹션 - 토스 스타일 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">인증 정보 입력</h3>

          {/* 탄소중립 활동 사진 업로드 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            <div
              className={`p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer ${image ? 'bg-green-50' : ''}`}
              onClick={() => setShowImageBox(!showImageBox)}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${image ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <span className="text-xl">📷</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">활동 사진</p>
                  <p className="text-xs text-gray-500">{image ? '사진이 업로드되었습니다' : '필수 항목'}</p>
                </div>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${showImageBox ? 'rotate-180' : ''}`} />
            </div>

            {showImageBox && (
              <div className="p-4 bg-gray-50">
                {image ? (
                  <div className="relative">
                    <img src={image} alt="탄소중립 활동 인증 사진" className="w-full h-64 object-contain rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        className="bg-white bg-opacity-80 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-100"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        사진 변경
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-3xl">📷</span>
                    </div>
                    <p className="font-medium text-gray-700">사진 업로드</p>
                    <p className="text-sm text-gray-500 mt-1">클릭하여 사진을 선택하세요</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 활동 설명 입력 - 토스 스타일 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            <div
              className={`p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer ${desc ? 'bg-green-50' : ''}`}
              onClick={() => setShowDescBox(!showDescBox)}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${desc ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <span className="text-xl">✏️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">활동 설명</p>
                  <p className="text-xs text-gray-500">{desc ? '설명이 입력되었습니다' : '선택 항목'}</p>
                </div>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${showDescBox ? 'rotate-180' : ''}`} />
            </div>

            {showDescBox && (
              <div className="p-4 bg-gray-50">
                <div className="relative">
                  <textarea
                    placeholder="어떤 탄소중립 활동을 했는지 설명해주세요"
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] text-gray-700"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">새로운 탄소중립 활동을 발굴하면 추가 포인트를 받을 수 있어요!</p>
              </div>
            )}
          </div>
        </div>

        {/* 인증 업로드 버튼 - 토스 스타일 */}
        <div className="sticky bottom-5 mt-4 pb-8">
          <button
            className={`w-full py-4 rounded-xl text-base font-bold shadow-md transition-all ${
              image && !certificationInProgress
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-400'
            } ${certificationInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleUploadCertification}
            disabled={!image || certificationInProgress}
          >
            {certificationInProgress ? '인증 중...' : '인증하기'}
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
      </div>

      {/* 인증 애니메이션 */}
      <CertificationAnimation
        isVisible={showCertificationAnimation}
        certificationType="other"
        onComplete={handleAnimationComplete}
      />
    </div>
  );
}
