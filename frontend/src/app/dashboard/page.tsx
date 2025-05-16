"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChartBar, FaUser, FaSignOutAlt, FaChevronRight, FaLeaf } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("activity"); // 'activity' 또는 'profile'
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 탭 메뉴 */}
      <div className="flex w-full">
        <button
          className={`flex-1 py-4 px-4 text-center font-medium ${
            activeTab === "activity"
              ? "bg-primary text-white"
              : "bg-white text-gray-600"
          }`}
          onClick={() => setActiveTab("activity")}
        >
          <div className="flex items-center justify-center">
            <FaChartBar className="mr-2" />
            <span>나의 탄소중립 활동</span>
          </div>
        </button>
        <button
          className={`flex-1 py-4 px-4 text-center font-medium ${
            activeTab === "profile"
              ? "bg-primary text-white"
              : "bg-white text-gray-600"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <div className="flex items-center justify-center">
            <FaUser className="mr-2" />
            <span>내 정보</span>
          </div>
        </button>
      </div>

      {user ? (
        <div className="flex-1 overflow-y-auto">
          {activeTab === "activity" ? (
            <ActivityTab user={user} />
          ) : (
            <ProfileTab user={user} handleLogout={handleLogout} />
          )}
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}

// 활동 탭 컴포넌트
function ActivityTab({ user }: { user: any }) {
  return (
    <div className="p-4">
      {/* 총 절감량 */}
      <div className="bg-primary-light rounded-xl p-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-primary-dark mb-1">총 절감량:</p>
            <p className="text-2xl font-bold text-primary-dark">22.8kg CO<sub>2</sub></p>
            <p className="text-xs text-gray-600 mt-1">참여 시작: 2023년 2월 2일 (87일)</p>
            <p className="text-xs text-gray-600">연속 활동 12일 🔥</p>
          </div>
          <div className="bg-white p-2 rounded-full">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/village.png" alt="캐릭터" className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* 주간 탄소중립 추이 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <h3 className="text-primary-dark font-bold mb-3">주간 탄소중립 추이</h3>
        <div className="h-32 flex items-end justify-between px-2">
          {[15, 25, 20, 18, 35].map((height, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-8 bg-primary rounded-t-md"
                style={{ height: `${height * 2}px` }}
              ></div>
              <p className="text-xs text-gray-500 mt-1">월{index + 1}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 활동 분석 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <h3 className="text-primary-dark font-bold mb-3">활동 분석</h3>
        <div className="flex">
          <div className="w-1/2">
            <div className="w-24 h-24 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="#E8F5E9" />
                <path d="M50 10 A40 40 0 0 1 90 50 L50 50 Z" fill="#4CAF50" />
                <path d="M50 10 A40 40 0 0 0 10 50 L50 50 Z" fill="#81C784" />
              </svg>
            </div>
          </div>
          <div className="w-1/2">
            <div className="mb-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary rounded-sm mr-2"></div>
                <p className="text-xs text-gray-700">식사 선택: 42%</p>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-medium rounded-sm mr-2"></div>
                <p className="text-xs text-gray-700">기타 활동: 35%</p>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-sm mr-2"></div>
                <p className="text-xs text-gray-700">전자제품 사용: 23%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 획득한 뱃지 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-primary-dark font-bold mb-3">획득한 뱃지</h3>
        <div className="flex justify-between">
          {[
            { color: "#FFD700", icon: "⚡" },
            { color: "#C0C0C0", icon: "🌱" },
            { color: "#CD7F32", icon: "🚶" },
            { color: "#4CAF50", icon: "♻️" },
            { color: "#FF9800", icon: "🌍" }
          ].map((badge, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: badge.color }}
            >
              <span className="text-lg">{badge.icon}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 프로필 탭 컴포넌트
function ProfileTab({ user, handleLogout }: { user: any; handleLogout: () => void }) {
  return (
    <div className="p-4">
      {/* 프로필 정보 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mr-4">
            <FaUser className="text-primary-dark text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{user.nickname || "김대학"}</h3>
            <p className="text-sm text-gray-600">{user.school || "환경대학교"} • {user.grade || "1학년"}</p>
            <button
              className="mt-2 px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-1 text-xs" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      {/* 내 나무 성장도 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-primary-dark font-bold">내 나무 성장도: Lv.3 (75%)</h3>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
        </div>
        <p className="text-xs text-gray-600">다음 레벨까지 2.5kg CO₂ 절감 필요</p>
      </div>

      {/* 탄소중립 현황 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <h3 className="text-primary-dark font-bold mb-3">탄소중립 현황</h3>
        <div className="mb-3">
          <p className="text-sm text-gray-700">이번 주 절감량: 3.2kg CO₂</p>
          <p className="text-sm text-gray-700 mt-1">지난 달 대비: <span className="text-primary">+12% 증가</span></p>
        </div>
      </div>

      {/* 메뉴 항목들 */}
      <div className="space-y-2">
        <button className="w-full bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
          <span className="text-gray-800">설정 내역 자세히 보기</span>
          <FaChevronRight className="text-gray-400" />
        </button>
        <button className="w-full bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
          <span className="text-gray-800">친구 초대하기</span>
          <FaChevronRight className="text-gray-400" />
        </button>
        <button className="w-full bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
          <span className="text-gray-800">환경 보호 팁 보기</span>
          <FaChevronRight className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
