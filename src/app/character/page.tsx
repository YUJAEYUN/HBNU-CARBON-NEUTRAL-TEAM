"use client";
import { useRouter } from "next/navigation";
import { FaInfoCircle, FaHome, FaComments, FaSeedling, FaUser } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

export default function CharacterPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 */}
      <div className="w-full bg-primary py-4 px-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold text-white">나무 키우기</h1>
        <button className="text-white p-2 rounded-full">
          <FaInfoCircle className="text-xl" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center p-4">
          {/* 캐릭터 이미지 */}
          <div className="w-48 h-48 bg-primary-light bg-opacity-30 rounded-full flex items-center justify-center mt-8 mb-6">
            <div className="relative">
              {/* 나무 줄기 */}
              <div className="w-8 h-20 bg-[#8B4513] rounded-md mx-auto"></div>
              {/* 나무 잎 */}
              <div className="w-32 h-32 bg-primary rounded-full absolute -top-16 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>

          {/* 레벨 표시 */}
          <p className="text-primary font-bold text-lg mb-2">Level 3</p>

          {/* 진행 바 */}
          <div className="w-full max-w-xs mb-2">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-primary h-4 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-8">다음 레벨까지 2kg 모으면 됨요</p>

          {/* 이번 주 활동 결과 */}
          <div className="w-full max-w-xs bg-primary-light bg-opacity-50 rounded-xl p-4">
            <h2 className="text-primary-dark font-bold mb-3">이번 주 활동 결과량</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">도보 이용:</span>
                <span className="text-primary-dark font-medium">0.4kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">카풀 참여:</span>
                <span className="text-primary-dark font-medium">1.2kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">텀블러 사용:</span>
                <span className="text-primary-dark font-medium">0.3kg</span>
              </div>
              <div className="flex justify-between border-t border-primary-medium pt-2 mt-2">
                <span className="text-primary-dark font-bold">총 절감량:</span>
                <span className="text-primary-dark font-bold">1.9kg CO₂</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
