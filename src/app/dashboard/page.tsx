"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChartBar, FaUser } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { ActivitySection, ProfileSection } from "@/components/dashboard";

// 메인 대시보드 컴포넌트
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("activity"); // 'activity' 또는 'profile'
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  // 초기 로딩 후 localLoading 상태 업데이트
  useEffect(() => {
    if (!isLoading) {
      // 로딩이 완료되면 로컬 로딩도 완료
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 500); // 약간의 지연을 두어 UI가 갑자기 변경되는 것을 방지

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // 로딩 중일 때 로딩 화면 표시
  if (localLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 탭 네비게이션 - iOS 스타일 */}
      <div className="flex p-2 pt-1 pb-0 bg-white gap-2">
        <button
          className={`flex-1 py-3.5 px-3 rounded-xl text-center flex items-center justify-center ${
            activeTab === "activity" ? "bg-primary text-white" : "bg-white text-gray-700"
          }`}
          onClick={() => setActiveTab("activity")}
        >
          <div className="flex items-center justify-center whitespace-nowrap">
            <FaChartBar className="mr-1.5" />
            <span className="text-sm font-medium">탄소중립 활동</span>
          </div>
        </button>
        <button
          className={`flex-1 py-3.5 px-3 rounded-xl text-center flex items-center justify-center ${
            activeTab === "profile" ? "bg-primary text-white" : "bg-white text-gray-700"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <div className="flex items-center justify-center">
            <FaUser className="mr-1.5" />
            <span className="text-sm font-medium">내 정보</span>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {user ? (
          activeTab === "activity" ? (
            <ActivitySection user={user} />
          ) : (
            <ProfileSection user={user} handleLogout={handleLogout} />
          )
        ) : (
          <div className="flex-1 flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}
