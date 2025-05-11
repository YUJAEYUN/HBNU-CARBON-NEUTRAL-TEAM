"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChartBar, FaUser, FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import Tooltip from "../../components/Tooltip";

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
          className={`flex-1 py-4 px-4 text-center font-medium transition-all duration-200 ${
            activeTab === "activity"
              ? "bg-primary text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("activity")}
        >
          <div className="flex items-center justify-center">
            <FaChartBar className="mr-2" />
            <span>나의 탄소중립 활동</span>
          </div>
        </button>
        <button
          className={`flex-1 py-4 px-4 text-center font-medium transition-all duration-200 ${
            activeTab === "profile"
              ? "bg-primary text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-50"
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
function ActivityTab({ user }: Readonly<{ user: any }>) {
  // 현재 날짜 기준으로 연속 활동일 계산
  const calculateStreakDays = () => {
    // 실제 앱에서는 사용자의 활동 데이터를 기반으로 계산
    // 여기서는 현재 날짜를 기준으로 모의 데이터 생성
    const randomStreak = Math.floor(Math.random() * 20) + 5; // 5~24일 사이의 랜덤 값
    return randomStreak;
  };

  // 참여 시작일 이후 경과일 계산
  const calculateDaysSinceStart = () => {
    const startDate = new Date('2025-05-01');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 주간 탄소중립 데이터
  const weeklyData = [
    { id: 'mon', day: '월', value: 15, reduction: '1.2kg' },
    { id: 'tue', day: '화', value: 25, reduction: '2.0kg' },
    { id: 'wed', day: '수', value: 20, reduction: '1.6kg' },
    { id: 'thu', day: '목', value: 18, reduction: '1.4kg' },
    { id: 'fri', day: '금', value: 35, reduction: '2.8kg' },
    { id: 'sat', day: '토', value: 30, reduction: '2.4kg' },
    { id: 'sun', day: '일', value: 22, reduction: '1.8kg' }
  ];

  // 뱃지 데이터
  const badges = [
    { id: 'energy', color: "#FFD700", icon: "⚡", name: "에너지 절약왕", description: "전력 소비를 30% 줄인 사용자에게 주어지는 뱃지" },
    { id: 'plant', color: "#C0C0C0", icon: "🌱", name: "식물 지킴이", description: "10그루 이상의 나무를 심은 사용자에게 주어지는 뱃지" },
    { id: 'walk', color: "#CD7F32", icon: "🚶", name: "걷기 마스터", description: "일주일 동안 매일 5,000보 이상 걸은 사용자에게 주어지는 뱃지" },
    { id: 'recycle', color: "#4CAF50", icon: "♻️", name: "재활용 챔피언", description: "한 달 동안 100kg 이상의 재활용품을 분리수거한 사용자에게 주어지는 뱃지" },
    { id: 'earth', color: "#FF9800", icon: "🌍", name: "지구 수호자", description: "탄소 배출량을 50kg 이상 줄인 사용자에게 주어지는 뱃지" }
  ];

  const streakDays = calculateStreakDays();
  const daysSinceStart = calculateDaysSinceStart();

  return (
    <div className="p-4">
      {/* 총 절감량 */}
      <div className="bg-primary-light rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-primary-dark mb-1 font-medium">총 절감량:</p>
            <p className="text-2xl font-bold text-primary-dark">22.8kg CO<sub>2</sub></p>
            <p className="text-xs text-gray-600 mt-1">참여 시작: 2025년 5월 1일 ({daysSinceStart}일)</p>
            <p className="text-xs text-gray-600">연속 활동 {streakDays}일 🔥</p>
          </div>
          <div className="bg-white p-2 rounded-full shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/village.png" alt="캐릭터" className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* 주간 탄소중립 추이 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-primary-dark font-bold mb-3">주간 탄소중립 추이</h3>
        <div className="h-32 flex items-end justify-between px-2">
          {weeklyData.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <Tooltip
                content={`탄소 감축량: ${item.reduction}`}
                width="max-w-[120px]"
              >
                <div
                  className="w-8 bg-primary rounded-t-md cursor-pointer hover:bg-primary-dark transition-colors"
                  style={{ height: `${item.value * 2}px` }}
                ></div>
              </Tooltip>
              <p className="text-xs text-gray-500 mt-1 font-medium">{item.day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 활동 분석 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-primary-dark font-bold mb-3">활동 분석</h3>
        <div className="flex">
          <div className="w-1/2">
            <div className="w-28 h-28 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <circle cx="50" cy="50" r="40" fill="#E8F5E9" />
                <path d="M50 10 A40 40 0 0 1 90 50 L50 50 Z" fill="#4CAF50" className="hover:opacity-80 transition-opacity duration-300" />
                <path d="M50 10 A40 40 0 0 0 10 50 L50 50 Z" fill="#81C784" className="hover:opacity-80 transition-opacity duration-300" />
                <path d="M50 50 A40 40 0 0 0 90 50 L50 50 Z" fill="#E0E0E0" className="hover:opacity-80 transition-opacity duration-300" />
                <circle cx="50" cy="50" r="20" fill="white" className="opacity-0" />
              </svg>
            </div>
          </div>
          <div className="w-1/2">
            <div className="space-y-3">
              <Tooltip content="식사 선택을 통해 탄소 배출량을 42% 줄였습니다." width="max-w-[180px]">
                <div className="flex items-center p-1.5 rounded-md transition-all duration-200 hover:bg-green-50 cursor-pointer">
                  <div className="w-3 h-3 bg-primary rounded-sm mr-2"></div>
                  <p className="text-xs text-gray-700 font-medium">식사 선택: 42%</p>
                </div>
              </Tooltip>

              <Tooltip content="기타 활동을 통해 탄소 배출량을 35% 줄였습니다." width="max-w-[180px]">
                <div className="flex items-center p-1.5 rounded-md transition-all duration-200 hover:bg-green-50 cursor-pointer">
                  <div className="w-3 h-3 bg-primary-medium rounded-sm mr-2"></div>
                  <p className="text-xs text-gray-700 font-medium">기타 활동: 35%</p>
                </div>
              </Tooltip>

              <Tooltip content="전자제품 사용을 줄여 탄소 배출량을 23% 줄였습니다." width="max-w-[180px]">
                <div className="flex items-center p-1.5 rounded-md transition-all duration-200 hover:bg-gray-100 cursor-pointer">
                  <div className="w-3 h-3 bg-gray-300 rounded-sm mr-2"></div>
                  <p className="text-xs text-gray-700 font-medium">전자제품 사용: 23%</p>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* 획득한 뱃지 */}
      <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-primary-dark font-bold mb-3">획득한 뱃지</h3>
        <div className="flex justify-between">
          {badges.map((badge) => (
            <Tooltip
              key={badge.id}
              content={`${badge.name}: ${badge.description}`}
              width="max-w-[180px]"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 shadow-sm"
                style={{ backgroundColor: badge.color }}
              >
                <span className="text-2xl">{badge.icon}</span>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}

// 프로필 탭 컴포넌트
function ProfileTab({ user, handleLogout }: Readonly<{ user: any; handleLogout: () => void }>) {
  return (
    <div className="p-4">
      {/* 프로필 정보 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mr-4 shadow-sm">
            <FaUser className="text-primary-dark text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{user.nickname || "김대학"}</h3>
            <p className="text-sm text-gray-600">{user.school || "환경대학교"} • {user.grade || "1학년"}</p>
            <button
              className="mt-2 px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center hover:bg-gray-200 transition-colors duration-200 shadow-sm"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-1 text-xs" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      {/* 내 나무 성장도 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-primary-dark font-bold">내 나무 성장도: Lv.3 (75%)</h3>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{ width: "75%" }}></div>
        </div>
        <p className="text-xs text-gray-600">다음 레벨까지 2.5kg CO₂ 절감 필요</p>
      </div>

      {/* 탄소중립 현황 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-primary-dark font-bold mb-3">탄소중립 현황</h3>
        <div className="mb-3">
          <p className="text-sm text-gray-700">이번 주 절감량: <span className="font-medium">3.2kg CO₂</span></p>
          <p className="text-sm text-gray-700 mt-1">지난 달 대비: <span className="text-primary font-medium">+12% 증가</span></p>
        </div>
      </div>

      {/* 메뉴 항목들 */}
      <div className="space-y-2">
        <button className="w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-between items-center hover:bg-gray-50">
          <span className="text-gray-800">설정 내역 자세히 보기</span>
          <FaChevronRight className="text-gray-400" />
        </button>
        <button className="w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-between items-center hover:bg-gray-50">
          <span className="text-gray-800">친구 초대하기</span>
          <FaChevronRight className="text-gray-400" />
        </button>
        <button className="w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-between items-center hover:bg-gray-50">
          <span className="text-gray-800">환경 보호 팁 보기</span>
          <FaChevronRight className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
