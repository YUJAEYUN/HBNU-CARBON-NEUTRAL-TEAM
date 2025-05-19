"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserImages, getImageInfo } from '@/utils/api';
import AnalysisResult from '@/components/AnalysisResult';

export default function HistoryPage() {
  const { user, isLoggedIn } = useAuth();
  const [userImages, setUserImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 사용자의 이미지 히스토리 로드
  const loadUserImages = async () => {
    if (!isLoggedIn || !user?.id) {
      setError('이미지 히스토리를 보려면 로그인이 필요합니다.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const images = await getUserImages(user.id, 50);
      setUserImages(images);
      
      if (images.length === 0) {
        setError('분석 히스토리가 없습니다.');
      }
    } catch (error) {
      console.error('이미지 히스토리 로드 오류:', error);
      setError('이미지 히스토리를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 이미지 상세 정보 로드
  const loadImageDetails = async (imageId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const imageInfo = await getImageInfo(imageId);
      setSelectedImage(imageInfo);
    } catch (error) {
      console.error('이미지 상세 정보 로드 오류:', error);
      setError('이미지 상세 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 컴포넌트 마운트 시 이미지 히스토리 로드
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      loadUserImages();
    }
  }, [isLoggedIn, user]);
  
  return (
    <div className="history-page container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">내 분석 히스토리</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 이미지 목록 */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">분석 이미지</h2>
            
            {isLoading && !selectedImage ? (
              <div className="text-center py-4">
                <div className="spinner"></div>
                <p className="mt-2 text-gray-500">이미지 로드 중...</p>
              </div>
            ) : userImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {userImages.map((image) => (
                  <div 
                    key={image.image_id} 
                    className={`history-item cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedImage && selectedImage.image.image_id === image.image_id 
                        ? 'border-blue-500' 
                        : 'border-transparent'
                    }`}
                    onClick={() => loadImageDetails(image.image_id)}
                  >
                    <img 
                      src={`http://localhost:8000/images/${image.image_id}/data`} 
                      alt={image.filename}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2 bg-gray-50">
                      <div className="text-xs text-gray-500 truncate">
                        {new Date(image.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs font-medium truncate">
                        {image.category || '분류 없음'}
                      </div>
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
        </div>
        
        {/* 선택된 이미지 상세 정보 */}
        <div className="md:col-span-2">
          {isLoading && selectedImage ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="spinner"></div>
              <p className="mt-2 text-gray-500">이미지 상세 정보 로드 중...</p>
            </div>
          ) : selectedImage ? (
            <AnalysisResult result={selectedImage.analysis} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">
                왼쪽에서 이미지를 선택하면 상세 정보가 표시됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
