'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa';
import CertificationAnimation from '@/components/CertificationAnimation';

export default function RefillCertificationPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showImageBox, setShowImageBox] = useState(true);
  const [showLocationBox, setShowLocationBox] = useState(false);
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
      type: 'refill',
      title: '리필스테이션 인증',
      location: location.trim() || '내 위치',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      timeAgo: '방금 전',
      carbonReduction: 0.18,
      verified: false,
      status: '검토중',
      points: 18,
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
      console.error('[Refill Upload] Error saving certification:', error);
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
        <h1 className="text-lg font-bold absolute left-1/2 transform -translate-x-1/2">리필스테이션 인증</h1>
        <div className="w-10"></div>
      </div>

      {/* 페이지 내용 */}
      <div className="flex-1 p-5 overflow-y-auto">
        {/* 탄소 절감량 정보 - 토스 스타일 카드 */}
        <div className="mb-6 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center mb-1">
              <span className="text-2xl mr-2">🧴</span>
              <h2 className="text-lg font-bold text-gray-800">리필스테이션 사용 효과</h2>
            </div>
            <p className="text-gray-500 text-sm">일회용 용기 대신 리필스테이션을 이용하면</p>
          </div>
          <div className="p-5 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">탄소 절감량</p>
                <p className="text-2xl font-bold text-primary mt-1">0.18kg</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">획득 포인트</p>
                <p className="text-2xl font-bold text-primary mt-1">18P</p>
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
                <p className="font-medium text-gray-800">리필스테이션 사용 사진 촬영</p>
                <p className="text-gray-500 text-sm mt-1">리필스테이션 사용 모습이나 리필한 제품을 촬영해주세요.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">위치 정보 입력</p>
                <p className="text-gray-500 text-sm mt-1">리필스테이션을 이용한 장소를 입력해주세요.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 인증 사진 업로드 섹션 - 토스 스타일 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">인증 정보 입력</h3>

          {/* 리필스테이션 사진 업로드 */}
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
                  <p className="font-medium text-gray-800">리필스테이션 사진</p>
                  <p className="text-xs text-gray-500">{image ? '사진이 업로드되었습니다' : '필수 항목'}</p>
                </div>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${showImageBox ? 'rotate-180' : ''}`} />
            </div>

            {showImageBox && (
              <div className="p-4 bg-gray-50">
                {image ? (
                  <div className="relative">
                    <img src={image} alt="리필스테이션 인증 사진" className="w-full h-64 object-contain rounded-lg" />
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

          {/* 위치 입력 - 토스 스타일 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            <div
              className={`p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer ${location ? 'bg-green-50' : ''}`}
              onClick={() => setShowLocationBox(!showLocationBox)}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${location ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <FaMapMarkerAlt className={`text-lg ${location ? 'text-green-600' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">위치 정보</p>
                  <p className="text-xs text-gray-500">{location ? location : '선택 항목'}</p>
                </div>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${showLocationBox ? 'rotate-180' : ''}`} />
            </div>

            {showLocationBox && (
              <div className="p-4 bg-gray-50">
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    placeholder="리필스테이션 위치를 입력하세요"
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">리필스테이션을 이용한 매장이나 장소를 입력해주세요.</p>
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
        certificationType="refill"
        onComplete={handleAnimationComplete}
      />
    </div>
  );
}