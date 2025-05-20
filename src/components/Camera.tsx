"use client";

import { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { analyzeAndSaveImage } from '@/utils/api';

interface CameraProps {
  onCapture?: (result: any) => void;
  category?: string;
}

export default function Camera({ onCapture, category = 'recycling' }: CameraProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
        setError(null);
      }
    } catch (err) {
      console.error('카메라 접근 오류:', err);
      setError('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
    }
  };

  // 카메라 중지
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  // 이미지 캡처
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // 캔버스 크기를 비디오 크기에 맞춤
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // 비디오 프레임을 캔버스에 그림
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // 캔버스에서 이미지 데이터 추출
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        
        // 카메라 중지
        stopCamera();
        
        // 이미지를 Blob으로 변환하여 분석
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
            await analyzeAndSendImage(file);
          }
        }, 'image/jpeg');
      }
    }
  };

  // 이미지 분석 및 전송
  const analyzeAndSendImage = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // 사용자 ID 가져오기
      const userId = user?.id;
      
      // 백엔드로 이미지 전송 및 분석
      const result = await analyzeAndSaveImage(file, userId, category);
      
      // 분석 결과 콜백 함수로 전달
      if (onCapture) {
        onCapture(result);
      }
      
      setIsAnalyzing(false);
    } catch (err) {
      console.error('이미지 분석 오류:', err);
      setError('이미지 분석 중 오류가 발생했습니다.');
      setIsAnalyzing(false);
    }
  };

  // 컴포넌트 언마운트 시 카메라 중지
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="camera-component">
      {error && (
        <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="video-container relative">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className={`w-full rounded-lg ${isCameraOpen ? 'block' : 'hidden'}`}
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {capturedImage && (
          <div className="captured-image-container">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full rounded-lg"
            />
          </div>
        )}
        
        {isAnalyzing && (
          <div className="analyzing-overlay absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div className="text-white text-center">
              <div className="spinner mb-2"></div>
              <p>이미지 분석 중...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="camera-controls mt-4 flex justify-center">
        {!isCameraOpen && !capturedImage && !isAnalyzing && (
          <button 
            onClick={startCamera} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            카메라 열기
          </button>
        )}
        
        {isCameraOpen && !isAnalyzing && (
          <button 
            onClick={captureImage} 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            사진 촬영
          </button>
        )}
        
        {capturedImage && !isAnalyzing && (
          <button 
            onClick={() => {
              setCapturedImage(null);
              startCamera();
            }} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            다시 촬영
          </button>
        )}
      </div>
    </div>
  );
}
