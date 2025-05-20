"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Camera from '@/components/Camera';
import AnalysisResult from '@/components/AnalysisResult';
import { getUserImages } from '@/utils/api';

export default function RecyclingAnalysisPage() {
  const { user, isLoggedIn } = useAuth();
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [userImages, setUserImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // 카메라로 촬영한 이미지 분석 결과 처리
  const handleCaptureResult = (result: any) => {
    setAnalysisResult(result);
    // 분석 결과가 있으면 히스토리 새로고침
    if (result && isLoggedIn && user?.id) {
      loadUserImages();
    }
  };
  
  // 사용자의 이미지 히스토리 로드
  const loadUserImages = async () => {
    if (!isLoggedIn || !user?.id) return;
    
    try {
      setIsLoading(true);
      const images = await getUserImages(user.id, 10);
      setUserImages(images);
    } catch (error) {
      console.error('이미지 히스토리 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 히스토리 토글
  const toggleHistory = () => {
    const newShowHistory = !showHistory;
    setShowHistory(newShowHistory);
    
    if (newShowHistory && isLoggedIn && user?.id && userImages.length === 0) {
      loadUserImages();
    }
  };
  
  return (
    <div className="recycling-analysis-page container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">재활용 분석</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 카메라 및 분석 섹션 */}
        <div className="md:col-span-2">
          {!analysisResult ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">이미지 촬영</h2>
              <p className="mb-4 text-gray-600">
                재활용 분석을 위해 이미지를 촬영하세요. 분석할 물체가 잘 보이도록 촬영해주세요.
              </p>
              <Camera onCapture={handleCaptureResult} category="recycling" />
            </div>
          ) : (
            <div>
              <AnalysisResult result={analysisResult} />
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  새 이미지 분석하기
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* 히스토리 및 정보 섹션 */}
        <div className="md:col-span-1">
          {isLoggedIn ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">내 분석 히스토리</h2>
                <button
                  onClick={toggleHistory}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {showHistory ? '접기' : '보기'}
                </button>
              </div>
              
              {showHistory && (
                <div className="history-list">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner"></div>
                      <p className="mt-2 text-gray-500">히스토리 로드 중...</p>
                    </div>
                  ) : userImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {userImages.map((image) => (
                        <div 
                          key={image.image_id} 
                          className="history-item cursor-pointer"
                          onClick={() => {
                            // 이미지 클릭 시 해당 이미지의 분석 결과 로드 로직 추가 필요
                          }}
                        >
                          <img 
                            src={`http://localhost:8000/images/${image.image_id}/data`} 
                            alt={image.filename}
                            className="w-full h-24 object-cover rounded"
                          />
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {new Date(image.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      분석 히스토리가 없습니다.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">로그인 필요</h2>
              <p className="text-gray-600">
                분석 히스토리를 저장하고 확인하려면 로그인이 필요합니다.
              </p>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                onClick={() => {
                  // 로그인 페이지로 이동 로직 추가 필요
                }}
              >
                로그인하기
              </button>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">재활용 팁</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>플라스틱 용기는 내용물을 비우고 가볍게 헹궈주세요.</li>
              <li>라벨과 뚜껑은 가능한 분리해주세요.</li>
              <li>종이류는 테이프, 스테이플러 등을 제거해주세요.</li>
              <li>비닐류는 이물질을 제거하고 따로 모아주세요.</li>
              <li>유리병은 깨지지 않게 조심히 분리해주세요.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
