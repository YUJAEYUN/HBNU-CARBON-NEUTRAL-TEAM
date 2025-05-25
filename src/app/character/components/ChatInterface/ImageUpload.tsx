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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedCaption, setSuggestedCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 파일 선택 처리
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    reader.onloadend = async () => {
      const imageUrl = reader.result as string;
      setImagePreviewUrl(imageUrl);

      // 이미지 분석 시작 (분리배출 관련 항목 자동 감지)
      setIsAnalyzing(true);
      setSuggestedCaption("");

      // OpenAI의 이미지 분석 API 호출
      try {
        // 동적 임포트로 analyzeImage 함수 가져오기
        const { analyzeImage } = await import('@/lib/openai');

        // 이미지 분석 API 호출
        const analysisResult = await analyzeImage(imageUrl);

        // 분석 결과를 제안 캡션으로 설정
        setSuggestedCaption(analysisResult);
      } catch (error) {
        console.error('이미지 분석 오류:', error);
        setSuggestedCaption("분석 실패");
      } finally {
        setIsAnalyzing(false);
      }
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
          {isAnalyzing ? (
            <div className="w-full p-2 mb-2 text-center">
              <div className="flex justify-center items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">이미지 분석 중...</p>
            </div>
          ) : (
            <>
              {suggestedCaption && (
                <div className="mb-2 p-2 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-700">감지된 항목: <span className="font-medium">{suggestedCaption}</span></p>
                  <button
                    className="text-xs text-primary mt-1"
                    onClick={() => setImageCaption(suggestedCaption)}
                  >
                    이 항목으로 설정
                  </button>
                </div>
              )}
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none mb-2"
                placeholder="이미지 설명 추가 (선택사항)"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
              />
            </>
          )}
          <button
            className="w-full p-2 rounded-lg bg-primary text-white"
            onClick={handleSendImage}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? '분석 중...' : '이미지 전송'}
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
