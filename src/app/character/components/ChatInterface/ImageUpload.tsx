"use client";
import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onSendImage: (imageUrl: string, caption: string) => void;
  onCancel: () => void;
}

export default function ImageUpload({
  onSendImage,
  onCancel
}: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 파일 선택 처리
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 타입 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setSelectedImage(file);

    // 이미지 미리보기 URL 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 이미지 전송
  const handleSendImage = () => {
    if (!imagePreviewUrl) return;
    onSendImage(imagePreviewUrl, imageCaption);
  };

  // 파일 선택 다이얼로그 열기
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-3">
      {/* 이미지 미리보기 */}
      {imagePreviewUrl ? (
        <div className="mb-3">
          <div className="relative w-full h-48 mb-2 overflow-hidden rounded border border-gray-300">
            <Image
              src={imagePreviewUrl}
              alt="이미지 미리보기"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded"
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              onClick={onCancel}
              title="이미지 취소"
            >
              <span className="text-xs">✕</span>
            </button>
          </div>
          <input
            type="text"
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none mb-2"
            placeholder="이미지 설명 추가 (선택사항)"
            value={imageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
          />
          <button
            className="w-full p-2 rounded-lg bg-primary text-white"
            onClick={handleSendImage}
          >
            이미지 전송
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary hover:border-primary transition-colors"
            onClick={openFileDialog}
          >
            이미지를 선택하거나 여기에 드래그하세요
          </button>
        </div>
      )}

      {/* 파일 입력 (숨김) */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageSelect}
      />
    </div>
  );
}
