'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import CertificationAnimation from '@/components/CertificationAnimation';

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
  const [showCertificationAnimation, setShowCertificationAnimation] = useState(false);
  const [certificationInProgress, setCertificationInProgress] = useState(false);
  const [certificationResult, setCertificationResult] = useState<any>(null);
  const [certificationError, setCertificationError] = useState<string | null>(null);

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

  const handleUploadCertification = async () => {
    if (!imageFile || certificationInProgress) {
      return;
    }

    setCertificationInProgress(true);

    try {
      // 이미지를 Base64로 변환
      const imageBase64 = await convertFileToBase64(imageFile);

      // 텀블러 인증 API 호출
      const response = await fetch('/api/certification/tumbler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageBase64,
          receiptImage: receiptImageFile ? await convertFileToBase64(receiptImageFile) : null,
        }),
      });

      const result = await response.json();

      // API 호출 완료 후 결과 저장하고 애니메이션 시작
      setCertificationResult(result);
      setShowCertificationAnimation(true);

    } catch (error) {
      console.error('텀블러 인증 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setCertificationError(errorMessage);

      // 에러 발생 시에도 애니메이션 표시 (실패 애니메이션)
      setCertificationResult({
        success: false,
        verified: false,
        carbonReduction: 0,
        points: 0,
        confidence: 0,
        error: errorMessage,
        reason: '네트워크 오류 또는 서버 오류가 발생했습니다.'
      });
      setShowCertificationAnimation(true);
    }
  };

  // 파일을 Base64로 변환하는 함수
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // data:image/jpeg;base64, 부분을 제거하고 순수 base64만 반환
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 인증 애니메이션 완료 후 처리
  const handleAnimationComplete = () => {
    setShowCertificationAnimation(false);
    setCertificationInProgress(false);

    // 인증 결과에 따른 처리
    if (certificationError || (certificationResult && !certificationResult.success)) {
      // 인증 실패 시 상태 초기화
      setCertificationError(null);
      setCertificationResult(null);
      return;
    }

    if (certificationResult) {
      // 인증 성공 시 결과 저장
      const newCertification = {
        id: Date.now(),
        type: 'tumbler',
        title: '텀블러 인증',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        timeAgo: '방금 전',
        location: '내 위치',
        carbonReduction: certificationResult.carbonReduction || 0.3,
        verified: certificationResult.verified || true,
        status: certificationResult.verified ? '인증완료' : '검토중',
        points: certificationResult.points || 15,
        image: image,
        receiptImage: receiptImage,
        analysisResult: certificationResult.analysisResult,
      };

      // 로컬 스토리지에 저장
      try {
        const existing = localStorage.getItem('certifications');
        const certs = existing ? JSON.parse(existing) : [];
        localStorage.setItem('certifications', JSON.stringify([newCertification, ...certs]));

        // 캐릭터 페이지로 이동
        router.push('/character');
      } catch (error) {
        console.error('[Tumbler Upload] Error saving certification:', error);
        router.push('/character');
      }
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
        <h1 className="text-lg font-bold absolute left-1/2 transform -translate-x-1/2">텀블러 인증</h1>
        <div className="w-10"></div>
      </div>

      {/* 페이지 내용 */}
      <div className="flex-1 p-5 overflow-y-auto">
        {/* 탄소 절감량 정보 - 토스 스타일 카드 */}
        <div className="mb-6 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center mb-1">
              <span className="text-2xl mr-2">☕</span>
              <h2 className="text-lg font-bold text-gray-800">텀블러 사용 효과</h2>
            </div>
            <p className="text-gray-500 text-sm">일회용컵 대신 텀블러를 사용하면</p>
          </div>
          <div className="p-5 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">탄소 절감량</p>
                <p className="text-2xl font-bold text-primary mt-1">0.3kg</p>
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
                <p className="font-medium text-gray-800">텀블러 사용 사진 촬영</p>
                <p className="text-gray-500 text-sm mt-1">텀블러와 음료가 함께 보이도록 촬영해주세요.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">영수증 촬영 (선택)</p>
                <p className="text-gray-500 text-sm mt-1">영수증이 있다면 함께 촬영해주세요.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 인증 사진 업로드 섹션 - 토스 스타일 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">인증 사진 업로드</h3>

          {/* 텀블러 사진 업로드 */}
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
                  <p className="font-medium text-gray-800">텀블러 사진</p>
                  <p className="text-xs text-gray-500">{image ? '사진이 업로드되었습니다' : '필수 항목'}</p>
                </div>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${showImageBox ? 'rotate-180' : ''}`} />
            </div>

            {showImageBox && (
              <div className="p-4 bg-gray-50">
                {image ? (
                  <div className="relative">
                    <img src={image} alt="텀블러 인증 사진" className="w-full h-64 object-contain rounded-lg" />
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

          {/* 영수증 사진 업로드 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div
              className={`p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer ${receiptImage ? 'bg-green-50' : ''}`}
              onClick={() => setShowReceiptImageBox(!showReceiptImageBox)}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${receiptImage ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <span className="text-xl">🧾</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">영수증 사진</p>
                  <p className="text-xs text-gray-500">{receiptImage ? '사진이 업로드되었습니다' : '선택 항목'}</p>
                </div>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${showReceiptImageBox ? 'rotate-180' : ''}`} />
            </div>

            {showReceiptImageBox && (
              <div className="p-4 bg-gray-50">
                {receiptImage ? (
                  <div className="relative">
                    <img src={receiptImage} alt="영수증 인증 사진" className="w-full h-64 object-contain rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        className="bg-white bg-opacity-80 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-100"
                        onClick={() => receiptFileInputRef.current?.click()}
                      >
                        사진 변경
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => receiptFileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-3xl">🧾</span>
                    </div>
                    <p className="font-medium text-gray-700">영수증 업로드</p>
                    <p className="text-sm text-gray-500 mt-1">클릭하여 영수증 사진을 선택하세요</p>
                  </div>
                )}
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

      {/* 인증 애니메이션 */}
      <CertificationAnimation
        isVisible={showCertificationAnimation}
        certificationType="tumbler"
        onComplete={handleAnimationComplete}
        certificationResult={certificationResult}
      />
    </div>
  );
}