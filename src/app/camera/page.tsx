'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CameraPage() {
  const [image, setImage] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
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

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-white relative p-4 pt-20">
      {/* 상단: 뒤로가기 + 제목 */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <button
          className="text-2xl text-gray-700"
          onClick={() => router.back()}
        >
          {'<'}
        </button>
        <span className="text-lg font-semibold text-gray-800">사진 인증</span>
      </div>

      {/* 버튼 영역 */}
      {!image && (
        <div className="flex flex-row gap-4 mb-6 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={handleCameraClick}
          >
            카메라 촬영
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
            onClick={() => fileInputRef.current?.click()}
          >
            이미지 업로드
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
      {image && (
        <div className="w-64 h-64 border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
          <img
            src={image}
            alt="인증 사진"
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>
      )}

      {/* 인증 업로드 버튼 */}
      {image && (
        <button className="px-6 py-3 bg-green-600 text-white rounded-md">
          인증 업로드
        </button>
      )}
    </main>
  );
}
