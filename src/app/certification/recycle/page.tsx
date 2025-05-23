'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function RecycleCertificationPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    if (!imageFile) {
      alert('인증 이미지를 등록해주세요.');
      return;
    }
    const newCertification = {
      id: Date.now(),
      type: 'recycle',
      title: title.trim() || '전기전자폐기물 인증',
      date: date.trim() || new Date().toISOString().split('T')[0],
      location: location.trim() || '위치 정보 없음',
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      timeAgo: '방금 전',
      carbonReduction: Math.round(Math.random() * 30) / 100,
      verified: false,
      status: '검토중',
      points: Math.round(Math.random() * 20) + 5,
      image: image,
    };
    const existing = localStorage.getItem('certifications');
    const certs = existing ? JSON.parse(existing) : [];
    localStorage.setItem('certifications', JSON.stringify([newCertification, ...certs]));
    router.push('/certification');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 상단 헤더 */}
      <div className="ios-header bg-white text-gray-800 z-20 relative flex items-center h-14 px-4 border-b">
        <button
          className="text-gray-800 text-base mr-4"
          onClick={() => router.back()}
        >
          뒤로
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center">전기전자폐기물 인증</h1>
        <div className="w-10" />
      </div>
      {/* 페이지 내용 */}
      <div className="flex-1 p-4 overflow-y-auto min-h-[100vh]">
        {/* 날짜 */}
        <div className="mb-4">
          <label htmlFor="date" className="block text-lg font-semibold text-gray-800 mb-2">날짜</label>
          <input
            type="text"
            id="date"
            placeholder="예시: 25.xx.xx"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        {/* 위치 */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-lg font-semibold text-gray-800 mb-2">위치</label>
          <input
            type="text"
            id="location"
            placeholder="위치를 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        {/* 이미지 미리보기 */}
        <div className="w-3/4 aspect-square mx-auto bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden mb-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          {image ? (
            <img src={image} alt="인증 이미지 미리보기" className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-gray-500">사진 선택</span>
          )}
        </div>
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
      </div>
    </div>
  );
}
