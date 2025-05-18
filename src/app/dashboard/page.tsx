"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChartBar, FaUser, FaSignOutAlt, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

// 프로필 탭 컴포넌트
function ProfileTab({ user, handleLogout }: { user: any; handleLogout: () => Promise<void> }) {
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showCustomerSupport, setShowCustomerSupport] = useState(false);
  const [showInviteFriends, setShowInviteFriends] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [appLock, setAppLock] = useState(false);

  const toggleAccountSettings = () => {
    setShowAccountSettings(!showAccountSettings);
  };

  const toggleCustomerSupport = () => {
    setShowCustomerSupport(!showCustomerSupport);
  };

  const toggleInviteFriends = () => {
    setShowInviteFriends(!showInviteFriends);
  };

  const toggleAppSettings = () => {
    setShowAppSettings(!showAppSettings);
  };

  return (
    <div className="p-4">
      {/* 프로필 카드 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mr-4">
            <FaUser className="text-primary-dark text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{user?.nickname || "김대학"}</h3>
            <p className="text-sm text-gray-600">{user?.school || "환경대학교"} • {user?.grade || "1학년"}</p>
            <button
              className="mt-2 px-4 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm flex items-center hover:bg-opacity-20 transition-colors duration-200 shadow-sm"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-1 text-xs" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      {/* 계정 관리 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <button 
          className="w-full flex justify-between items-center"
          onClick={toggleAccountSettings}
        >
          <h3 className="text-primary-dark font-bold">계정 관리</h3>
          <FaChevronRight className={`text-primary transition-transform duration-300 ${showAccountSettings ? 'transform rotate-90' : ''}`} />
        </button>
        
        {showAccountSettings && (
          <div className="mt-4 space-y-3">
            <div className="border-b pb-3">
              <p className="text-sm text-gray-600 mb-1">별명</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800">{user?.nickname || "김대학"}</p>
                <button className="text-xs text-primary px-2 py-1 border border-primary rounded-full">
                  변경
                </button>
              </div>
            </div>
            
            <div className="border-b pb-3">
              <p className="text-sm text-gray-600 mb-1">캐릭터 별명</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800">나무지기</p>
                <button className="text-xs text-primary px-2 py-1 border border-primary rounded-full">
                  변경
                </button>
              </div>
            </div>
            
            <div className="border-b pb-3">
              <p className="text-sm text-gray-600 mb-1">아이디(이메일)</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800">Cnergy@hbnu.ac.kr</p>
                <button className="text-xs text-primary px-2 py-1 border border-primary rounded-full">
                  변경
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">비밀번호</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800">••••••••</p>
                <button className="text-xs text-primary px-2 py-1 border border-primary rounded-full">
                  변경
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 고객 지원 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <button 
          className="w-full flex justify-between items-center"
          onClick={toggleCustomerSupport}
        >
          <h3 className="text-primary-dark font-bold">고객 지원</h3>
          <FaChevronRight className={`text-primary transition-transform duration-300 ${showCustomerSupport ? 'transform rotate-90' : ''}`} />
        </button>
        
        {showCustomerSupport && (
          <div className="mt-4 space-y-3">
            <div className="border-b pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">앱 버전</p>
                  <p className="text-xs text-gray-500">현재 버전 1.0.0</p>
                </div>
              </div>
            </div>
            
            <div className="border-b pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">문의하기</p>
                  <p className="text-xs text-gray-500">도움이 필요하신가요?</p>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </div>
            
            <div className="border-b pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">공지사항</p>
                  <p className="text-xs text-gray-500">최신 소식을 확인하세요</p>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </div>
            
            <div className="border-b pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">서비스 이용약관</p>
                  <p className="text-xs text-gray-500">서비스 이용에 관한 약관</p>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">개인정보 처리방침</p>
                  <p className="text-xs text-gray-500">개인정보 수집 및 이용에 관한 정책</p>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 앱 설정 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <button 
          className="w-full flex justify-between items-center"
          onClick={toggleAppSettings}
        >
          <h3 className="text-primary-dark font-bold">앱 설정</h3>
          <FaChevronRight className={`text-primary transition-transform duration-300 ${showAppSettings ? 'transform rotate-90' : ''}`} />
        </button>
        
        {showAppSettings && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="mr-2"
                />
                <label className="text-gray-800">알림 설정</label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={appLock}
                  onChange={() => setAppLock(!appLock)}
                  className="mr-2"
                />
                <label className="text-gray-800">암호 잠금</label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 메뉴 항목들 */}
      <div className="space-y-2">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <button 
            className="w-full p-4 flex justify-between items-center"
            onClick={toggleInviteFriends}
          >
            <h3 className="text-primary-dark font-bold">친구 초대하기</h3>
            <FaChevronRight className={`text-primary transition-transform duration-300 ${showInviteFriends ? 'transform rotate-90' : ''}`} />
          </button>
          
          {showInviteFriends && (
            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
              <button className="w-full mt-2 py-3 flex justify-between items-center hover:bg-primary-light rounded-lg px-3">
                <span className="text-gray-700">아이디 추가하기</span>
                <FaChevronRight className="text-gray-400 text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 활동 탭 컴포넌트
function ActivityTab({ user }: { user: any }) {
  // 뱃지 타입 정의
  type Badge = {
    id: string;
    color: string;
    icon: string;
    name: string;
    description: string;
    earned: boolean;
    category?: string;
  };

  const [showBadgeGuide, setShowBadgeGuide] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [streakDays, setStreakDays] = useState(0);
  const [daysSinceStart, setDaysSinceStart] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("weekly");
  const [activeContentTab, setActiveContentTab] = useState<"analysis" | "recent">("recent");

  // 기본 뱃지 데이터
  const badges: Badge[] = [
    { id: 'first', color: "#4CAF50", icon: "🌱", name: "첫 발자국", description: "첫 번째 탄소 절감 활동을 완료했어요", earned: true },
    { id: 'streak', color: "#2196F3", icon: "🔥", name: "연속 활동", description: "7일 연속으로 활동을 기록했어요", earned: true },
    { id: 'transport', color: "#FF9800", icon: "🚲", name: "교통 마스터", description: "대중교통 이용으로 탄소 배출을 줄였어요", earned: true },
    { id: 'energy', color: "#9C27B0", icon: "💡", name: "에너지 절약", description: "에너지 절약 활동을 10회 이상 기록했어요", earned: false },
  ];

  // 확장된 뱃지 데이터
  const extendedBadges: Badge[] = [
    ...badges,
    { id: 'recycle', color: "#00BCD4", icon: "♻️", name: "재활용 달인", description: "재활용 활동을 20회 이상 기록했어요", earned: false, category: "생활" },
    { id: 'vegan', color: "#8BC34A", icon: "🥗", name: "채식 실천", description: "채식 식단을 5회 이상 기록했어요", earned: false, category: "소비" },
    { id: 'carpool', color: "#3F51B5", icon: "🚗", name: "카풀 마스터", description: "카풀 이용으로 탄소 배출을 줄였어요", earned: false, category: "교통" },
    { id: 'solar', color: "#FFC107", icon: "☀️", name: "태양광 지지자", description: "재생 에너지 사용을 실천했어요", earned: false, category: "에너지" },
  ];

  // 뱃지 카테고리
  const badgeCategories = [
    { id: "all", name: "전체" },
    { id: "생활", name: "생활" },
    { id: "소비", name: "소비" },
    { id: "교통", name: "교통" },
    { id: "에너지", name: "에너지" },
  ];

  // 활동 분석 데이터
  const activityAnalysis = [
    { category: "대중교통 이용", value: 35, icon: "🚆" },
    { category: "에너지 절약", value: 25, icon: "💡" },
    { category: "재활용", value: 20, icon: "♻️" },
    { category: "친환경 소비", value: 15, icon: "🛒" },
    { category: "기타", value: 5, icon: "📊" },
  ];

  // 주간 탄소중립 데이터
  const weeklyData = [
    { day: "월", value: 0.8 },
    { day: "화", value: 1.2 },
    { day: "수", value: 0.5 },
    { day: "목", value: 1.5 },
    { day: "금", value: 0.9 },
    { day: "토", value: 1.8 },
    { day: "일", value: 0.7 },
  ];

  // 최대값 계산 (막대 그래프 스케일링용)
  const maxValue = Math.max(...weeklyData.map(item => item.value));

  // 컴포넌트 마운트 시 데이터 계산
  useEffect(() => {
    // 연속 활동일 계산
    const randomStreak = Math.floor(Math.random() * 20) + 5; // 5~24일 사이의 랜덤 값
    setStreakDays(randomStreak);
    
    // 참여 시작일 이후 경과일 계산
    const startDate = new Date('2023-05-01');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysSinceStart(diffDays);
  }, []);

  // 뱃지 클릭 핸들러
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
  };

  // 뱃지 가이드 창 토글 핸들러
  const toggleBadgeGuide = () => {
    setShowBadgeGuide(!showBadgeGuide);
    setSelectedBadge(null);
  };

  // 카테고리별 필터링된 뱃지
  const filteredBadges = activeCategory === "all" 
    ? extendedBadges 
    : extendedBadges.filter(badge => badge.category === activeCategory);

  return (
    <div className="p-4 pb-20 overflow-y-auto h-full">
      {/* 통합된 정보 카드 */}
      <div className="bg-primary-light rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-primary-dark mb-1 font-medium">총 절감량:</p>
            <p className="text-2xl font-bold text-primary-dark">22.8kg CO<sub>2</sub></p>
          </div>
          <div className="bg-white rounded-full p-2 shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center">
              <span className="text-3xl">🌿</span> {/* 캐릭터 이모지로 변경 */}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-primary-dark mb-1">연속 활동</p>
            <p className="font-bold text-primary-dark">{streakDays}일</p>
          </div>
          <div>
            <p className="text-xs text-primary-dark mb-1">참여 기간</p>
            <p className="font-bold text-primary-dark">{daysSinceStart}일</p>
          </div>
          <div>
            <p className="text-xs text-primary-dark mb-1">나무 심기</p>
            <p className="font-bold text-primary-dark">2그루</p>
          </div>
        </div>
      </div>

      {/* 활동 분석 & 주간 탄소중립 추이 통합 섹션 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* 콘텐츠 탭 네비게이션 */}
        <div className="flex border-b mb-4">
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeContentTab === "recent" ? "text-primary border-b-2 border-primary" : "text-gray-500"
            }`}
            onClick={() => setActiveContentTab("recent")}
          >
            주간 탄소중립 추이
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeContentTab === "analysis" ? "text-primary border-b-2 border-primary" : "text-gray-500"
            }`}
            onClick={() => setActiveContentTab("analysis")}
          >
            활동 분석
          </button>
        </div>
        
        {activeContentTab === "analysis" ? (
          <>
            {/* 분석 기간 탭 제거 */}
            
            {/* 활동 분석 차트 */}
            <div className="space-y-3">
              {activityAnalysis.map(item => (
                <div key={item.category} className="flex items-center">
                  <div className="w-8 text-center mr-2">
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">{item.category}</span>
                      <span className="text-sm text-gray-500">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2" 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // 주간 탄소중립 추이 - 그래프 대신 인사이트 텍스트로 변경
          <div className="pt-1">
            <h3 className="text-xs font-medium text-gray-700 mb-2 text-center">지난 1주일 탄소절감 인사이트</h3>
            
            {/* 총 절감량 요약 - 크기 축소 */}
            <div className="bg-green-50 p-3 rounded-xl mb-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">총 절감량</span>
                <span className="text-lg font-bold text-primary">
                  {weeklyData.reduce((sum, item) => sum + item.value, 0).toFixed(1)}kg
                </span>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <span className="text-xs text-gray-600">전주 대비</span>
                <span className="text-xs font-medium text-green-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9a1 1 0 01-1-1V6a1 1 0 011-1h2a1 1 0 011 1v1zm-1 4a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                    <path d="M5 5a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V8a3 3 0 00-3-3H5zm-1 9v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1zm7 0v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1zm-7-4v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1zm7 0v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1z" />
                  </svg>
                  +15%
                </span>
              </div>
            </div>
            
            {/* 주요 인사이트 - 크기 축소 */}
            <div className="space-y-2">
              {/* 최고 활동일 */}
              <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-primary bg-opacity-10 p-1.5 rounded-lg mr-2">
                    <span className="text-primary text-base">🏆</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-800">최고 활동일</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      <span className="font-medium">토요일</span>에 <span className="font-medium">1.8kg</span>의 탄소를 절감했어요.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 주요 활동 */}
              <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-1.5 rounded-lg mr-2">
                    <span className="text-blue-500 text-base">🚲</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-800">주요 활동</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      <span className="font-medium">대중교통 이용</span>이 전체 절감량의 <span className="font-medium">35%</span>를 차지했어요.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 개선 기회 */}
              <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-yellow-50 p-1.5 rounded-lg mr-2">
                    <span className="text-yellow-500 text-base">💡</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-800">개선 기회</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      <span className="font-medium">수요일</span>에 활동이 가장 적었어요. 
                      평일에 텀블러 사용을 늘려보세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 다음 주 목표 제안 - 크기 축소 */}
            <div className="mt-3 bg-primary bg-opacity-5 p-2 rounded-lg border border-primary border-opacity-20">
              <h4 className="text-xs font-medium text-primary mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                다음 주 목표 제안
              </h4>
              <ul className="text-xs text-gray-700 space-y-0.5">
                <li className="flex items-start">
                  <span className="text-primary mr-1">•</span>
                  <span>주 3회 이상 대중교통 이용하기</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-1">•</span>
                  <span>텀블러 사용 횟수 20% 늘리기</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 탄소 절감 추세 분석 섹션 제거 */}
      {/* <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">탄소 절감 인사이트</h4>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">↗</span>
            <p className="text-xs text-gray-700">
              <span className="font-medium">꾸준한 성장:</span> 지난 4주 동안 매주 평균 12% 탄소 절감량이 증가했어요.
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">★</span>
            <p className="text-xs text-gray-700">
              <span className="font-medium">최고 활동:</span> 중고거래와 카풀 참여가 가장 큰 탄소 절감 효과를 보였어요.
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">!</span>
            <p className="text-xs text-gray-700">
              <span className="font-medium">개선 기회:</span> 평일에 텀블러 사용을 늘리면 더 많은 탄소를 절감할 수 있어요.
            </p>
          </li>
        </ul>
      </div> */}

      {/* 뱃지 섹션 */}
      <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-primary-dark font-bold">나의 뱃지</h3>
          <button 
            className="text-primary text-sm flex items-center"
            onClick={toggleBadgeGuide}
          >
            <FaInfoCircle className="mr-1" />
            <span>뱃지 가이드</span>
          </button>
        </div>
        
        {/* 뱃지 카테고리 필터 */}
        <div className="flex overflow-x-auto pb-2 mb-3 -mx-1 hide-scrollbar">
          {badgeCategories.map(category => (
            <button
              key={category.id}
              className={`px-3 py-1 mx-1 rounded-full text-sm whitespace-nowrap ${
                activeCategory === category.id 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* 뱃지 그리드 - 이름 제거 */}
        <div className="grid grid-cols-4 gap-2">
          {filteredBadges.map(badge => (
            <button
              key={badge.id}
              className={`p-2 rounded-lg flex flex-col items-center justify-center ${
                badge.earned ? 'opacity-100' : 'opacity-30 filter blur-[1px]'
              }`}
              style={{ backgroundColor: `${badge.color}20` }} // 20% 투명도의 배경색
              onClick={() => badge.earned && handleBadgeClick(badge)}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: badge.color }}
              >
                <span className="text-lg">{badge.icon}</span>
              </div>
            </button>
          ))}
        </div>
        
        {/* 뱃지 상세 모달 */}
        {selectedBadge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-5 max-w-xs w-full">
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: selectedBadge.color }}
                >
                  <span className="text-2xl">{selectedBadge.icon}</span>
                </div>
                <button 
                  className="text-gray-500"
                  onClick={() => setSelectedBadge(null)}
                >
                  ✕
                </button>
              </div>
              <h3 className="text-lg font-bold mb-2">{selectedBadge.name}</h3>
              <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedBadge.earned 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedBadge.earned ? '획득함' : '미획득'}
                </span>
                {selectedBadge.category && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {selectedBadge.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* 뱃지 가이드 모달 */}
        {showBadgeGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl p-5 max-w-sm w-full my-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4 sticky top-0 bg-white pt-1 pb-2 z-10">
                <h3 className="text-lg font-bold">뱃지 가이드</h3>
                <button 
                  className="text-gray-500"
                  onClick={toggleBadgeGuide}
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                다양한 환경 보호 활동을 통해 뱃지를 수집해보세요. 각 뱃지는 특별한 활동이나 목표를 달성했을 때 획득할 수 있습니다.
              </p>
              <div className="space-y-4">
                {extendedBadges.map(badge => (
                  <div key={badge.id} className="flex items-start p-3 rounded-lg" style={{ backgroundColor: `${badge.color}10` }}>
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${!badge.earned && 'opacity-50'}`}
                      style={{ backgroundColor: badge.color }}
                    >
                      <span className="text-lg">{badge.icon}</span>
                    </div>
                    <div className="flex-1">
                      {badge.earned ? (
                        <h4 className="font-medium">{badge.name}</h4>
                      ) : (
                        <h4 className="font-medium blur-[3px] select-none opacity-40">{badge.name}</h4>
                      )}
                      {badge.earned ? (
                        <p className="text-sm text-gray-600">{badge.description}</p>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-600 blur-[3px] select-none opacity-40">
                            {badge.description}
                          </p>
                          <p className="text-xs text-primary mt-1 font-medium">
                            뱃지를 획득하면 설명을 볼 수 있습니다.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
      {/* 탭 네비게이션 */}
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
            <ActivityTab user={user} />
          ) : (
            <ProfileTab user={user} handleLogout={handleLogout} />
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
