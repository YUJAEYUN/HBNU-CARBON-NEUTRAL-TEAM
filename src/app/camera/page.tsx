'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCamera, FaRegImage } from "react-icons/fa";

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
    <main className="flex flex-col items-center justify-start min-h-screen bg-white relative p-4 pt-20 pb-32">
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

      {/* 안내 문구 박스 */}
      <div
        style={{
          background: '#E8F5E9',
          padding: '1rem',
          borderRadius: '24px',
          textAlign: 'center',
          border: 'none',
          boxShadow: '0 2px 8px rgba(255, 209, 220, 0.15)',
          maxWidth: '480px',
          width: '100%',
          margin: '0 auto',
        }}
        className="mb-4"
      >
        <p style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>
          탄소 중립을 위한 친환경 활동 사진을
        </p>
        <p style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>
          업로드하거나 촬영해 인증해 주세요.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', margin: 0, marginTop: '0.5em' }}>
          전자영수증, 텀블러 사용, 리필스테이션 등
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
          다양한 실천이 가능합니다.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', margin: 0, marginTop: '0.5em' }}>
          업로드한 사진은 AI가 자동으로 활동을 인식하고
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
          분류해 드립니다.
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-row gap-8 w-full justify-center mt-4 mb-6">
        <button
          className="flex flex-col items-center"
          onClick={handleCameraClick}
        >
          <div className="w-16 h-16 rounded-full bg-[#81C784] flex items-center justify-center mb-1">
            <FaCamera className="text-white text-2xl" />
          </div>
          <span className="text-xs text-gray-700">카메라 촬영</span>
        </button>
        <button
          className="flex flex-col items-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <FaRegImage className="text-gray-700 text-2xl" />
          </div>
          <span className="text-xs text-gray-700">이미지 업로드</span>
        </button>
      </div>

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
      <div className="w-64 h-96 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4 mx-auto overflow-hidden">
        {image ? (
          <img
            src={image}
            alt="인증 사진"
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-500">이미지를 선택해주세요</span>
        )}
      </div>

      {/* 인증 업로드 버튼 */}
      <button 
        className={`px-6 py-3 rounded-[24px] ${image ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-500'}`}
        disabled={!image}
      >
        인증 업로드
      </button>
    </main>
  );
}
