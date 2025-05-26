"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaBolt, FaArrowUp } from "react-icons/fa";

import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import PWAInstallButton from "@/components/PWAInstallButton";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Certification } from '@/types/certification';
import { NewsItem } from '@/types/news';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 목업 데이터 - 실제로는 API에서 가져올 데이터
  const mockData = {
    carbonReduction: 0.87,
    yesterdayReduction: 0.67,
    level: 3,
    levelProgress: 65,
    activities: [
      { id: 1, title: "교내 카페에서 텀블러 사용하여 일회용컵 절약", time: "오전 9시", timeAgo: "9분 전", reduction: 0.12 },
      { id: 2, title: "이번주 계단 이용하기 목표 달성", time: "오전 8시", timeAgo: "32분 전", reduction: 0.25 },
      { id: 3, title: "전자영수증 사용", time: "어제", timeAgo: "1일 전", reduction: 0.08 },
    ],
    personalStats: {
      monthlyGoal: 15,
      monthlyReduction: 3.7,
      progress: 25
    },
    events: [
      { id: 1, title: "탄소중립 봉사활동 하러 가기", date: "5월 15일", time: "14:00", duration: "" },
      { id: 2, title: "탄소중립 대외활동 하러 가기", date: "5월 20일", time: "10:00", duration: "" }
    ],
    news: [
      {
        id: 1,
        url: "https://www.contestkorea.com/sub/view.php?Txt_bcode=031410001&int_gbn=1&str_no=202505190036&utm_source=chatgpt.com",
        fallback: {
          title: "대학생 탄소중립 아이디어 공모전 개최",
          content: "환경부에서 주관하는 대학생 탄소중립 아이디어 공모전이 다음 달 개최됩니다. 참가자들은 일상 속 탄소 배출을 줄이는 창의적인 아이디어를 제안할 수 있습니다.",
          date: "2023.05.10",
          color: "#C8E6C9",
          icon: "🌱",
          category: "아이디어 공모전"
        }
      },
      {
        id: 2,
        url: "https://www.yna.co.kr/view/AKR20220427162100004?utm_source=chatgpt.com",
        fallback: {
          title: "캠퍼스 내 일회용품 사용 제한 확대",
          content: "우리 대학은 다음 학기부터 캠퍼스 내 일회용품 사용을 단계적으로 제한합니다. 학생들은 개인 텀블러와 식기를 지참하는 것이 권장됩니다.",
          date: "2023.05.08",
          color: "#BBDEFB",
          icon: "♻️",
          category: "캠퍼스 정책"
        }
      },
      {
        id: 3,
        url: "https://www.imsn.kr/news/articleView.html?idxno=8743&utm_source=chatgpt.com",
        fallback: {
          title: "탄소발자국 줄이기 캠페인 시작",
          content: "우리 대학에서는 이번 달부터 '나의 탄소발자국 줄이기' 캠페인을 시작합니다. 참여 학생들은 일상 속에서 탄소 배출을 줄이는 활동을 기록하고 공유할 수 있습니다.",
          date: "2023.05.05",
          color: "#FFECB3",
          icon: "👣",
          category: "캠페인"
        }
      },
      {
        id: 4,
        url: "https://www.newscj.com/news/articleView.html?idxno=3143906&utm_source=chatgpt.com",
        fallback: {
          title: "친환경 교통수단 이용 장려 프로그램",
          content: "대학 내 자전거 이용과 카풀 참여를 장려하기 위한 새로운 프로그램이 시작됩니다. 참여 학생들에게는 다양한 혜택이 제공됩니다.",
          date: "2023.05.03",
          color: "#E1BEE7",
          icon: "🚲",
          category: "친환경 교통"
        }
      }
    ]
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full h-full flex flex-col relative overflow-hidden">
        {isLoggedIn ? <LoggedInHome user={user} router={router} mockData={mockData} /> : <LoggedOutHome router={router} />}
      </div>
    </div>
  );
}

// 목업 데이터 타입 정의
interface MockData {
  carbonReduction: number;
  yesterdayReduction: number;
  level: number;
  levelProgress: number;
  activities: Array<{
    id: number;
    title: string;
    time: string;
    timeAgo: string;
    reduction: number;
  }>;
  personalStats: {
    monthlyGoal: number;
    monthlyReduction: number;
    progress: number;
  };
  events: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    duration: string;
  }>;
  news: NewsItem[];
}

// 로그인 후 홈 화면 (iOS 스타일 적용)
function LoggedInHome({
  user,
  router,
  mockData
}: Readonly<{
  user: Record<string, unknown> | null;
  router: ReturnType<typeof useRouter>;
  mockData: MockData;
}>) {
  // 탄소 절감량 애니메이션을 위한 상태
  const [carbonValue, setCarbonValue] = useState(0);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [totalCarbonReduction, setTotalCarbonReduction] = useState(0);
  const [monthlyReduction, setMonthlyReduction] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(mockData.news);

  // 실제 인증 데이터 로드
  useEffect(() => {
    const loadCertifications = () => {
      try {
        const storedCertifications = localStorage.getItem('certifications');
        if (storedCertifications) {
          const parsedCertifications = JSON.parse(storedCertifications);
          setCertifications(parsedCertifications);

          // 오늘 날짜의 인증들만 필터링하여 탄소 절감량 계산
          const today = new Date().toISOString().split('T')[0];
          const todayCertifications = parsedCertifications.filter((cert: Certification) =>
            cert.date === today
          );

          const todayReduction = todayCertifications.reduce((total: number, cert: Certification) =>
            total + cert.carbonReduction, 0
          );

          // 이번 달 탄소 절감량 계산
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const monthlyCertifications = parsedCertifications.filter((cert: Certification) => {
            const certDate = new Date(cert.date);
            return certDate.getMonth() === currentMonth && certDate.getFullYear() === currentYear;
          });

          const monthlyReductionTotal = monthlyCertifications.reduce((total: number, cert: Certification) =>
            total + cert.carbonReduction, 0
          );

          setTotalCarbonReduction(todayReduction);
          setMonthlyReduction(monthlyReductionTotal);
        }
      } catch (error) {
        console.error('인증 데이터 로드 오류:', error);
      }
    };

    loadCertifications();

    // 인증 업데이트 이벤트 리스너
    const handleCertificationUpdate = () => {
      loadCertifications();
    };

    window.addEventListener('certificationUpdated', handleCertificationUpdate);

    return () => {
      window.removeEventListener('certificationUpdated', handleCertificationUpdate);
    };
  }, []);

  // 뉴스 메타데이터 로드
  useEffect(() => {
    const loadNewsMetadata = async () => {
      const updatedNews = await Promise.all(
        mockData.news.map(async (newsItem) => {
          try {
            const response = await fetch('/api/metadata', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url: newsItem.url }),
            });

            if (response.ok) {
              const metadata = await response.json();
              return {
                ...newsItem,
                metadata,
                loading: false,
              };
            } else {
              return {
                ...newsItem,
                loading: false,
                error: '메타데이터를 가져올 수 없습니다.',
              };
            }
          } catch (error) {
            console.error('뉴스 메타데이터 로드 오류:', error);
            return {
              ...newsItem,
              loading: false,
              error: '메타데이터를 가져올 수 없습니다.',
            };
          }
        })
      );

      setNewsItems(updatedNews);
    };

    // 초기 로딩 상태 설정
    setNewsItems(mockData.news.map(item => ({ ...item, loading: true })));

    // 메타데이터 로드
    loadNewsMetadata();
  }, []);

  const targetValue = totalCarbonReduction || mockData.carbonReduction; // 실제 데이터 우선, 없으면 목업 데이터

  // 컴포넌트가 마운트되면 애니메이션 시작
  useEffect(() => {
    // 더 간단한 방식으로 애니메이션 구현
    let startTimestamp: number | null = null;
    const duration = 2000; // 2초 동안 애니메이션 진행

    const step = (timestamp: number) => {
      startTimestamp ??= timestamp;
      const elapsed = timestamp - startTimestamp;

      // 진행률 계산 (0~1 사이 값)
      const progress = Math.min(elapsed / duration, 1);

      // easeOutQuart 이징 함수 적용 (부드러운 감속 효과)
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      // 현재 값 계산
      const currentValue = targetValue * easedProgress;
      setCarbonValue(currentValue);

      // 애니메이션이 완료되지 않았으면 다음 프레임 요청
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    // 애니메이션 시작
    requestAnimationFrame(step);

    // 컴포넌트 언마운트 시 정리
    return () => {
      setCarbonValue(targetValue);
    };
  }, [targetValue]);

  return (
    <div className="flex-1 flex flex-col h-full pb-[60px] bg-toss-gray-50">
      {/* 토스 스타일 헤더 - 깔끔한 테마 */}
      <motion.div
        className="bg-white border-b border-toss-gray-200 px-5 py-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-toss-green rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">🌱</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-toss-gray-900">C-nergy</h1>
            <p className="text-xs text-toss-gray-600 font-medium">탄소중립 실천하기</p>
          </div>
        </div>
        <motion.button
          className="w-10 h-10 bg-toss-gray-100 rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBolt className="text-toss-gray-600 text-lg" />
        </motion.button>
      </motion.div>

      {user ? (
        <div className="flex-1 flex flex-col px-5 overflow-y-auto pt-4">
          {/* 토스 스타일 메인 성과 카드 */}
          <motion.div
            className="bg-white rounded-2xl p-6 mb-6 shadow-toss-2 border border-toss-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 상단: 제목과 레벨 */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-toss-gray-600 text-sm font-medium">오늘 지구를 구한 양</p>
                <div className="flex items-baseline space-x-1 mt-1">
                  <motion.span
                    className="text-4xl font-bold text-toss-green"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  >
                    {carbonValue.toFixed(1)}
                  </motion.span>
                  <span className="text-lg font-medium text-toss-gray-700">kg CO₂</span>
                  {carbonValue >= targetValue * 0.99 && (
                    <motion.span
                      className="text-2xl ml-2"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 10 }}
                    >
                      🎉
                    </motion.span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="bg-toss-gray-100 rounded-full px-3 py-1 mb-2">
                  <span className="text-sm font-bold text-toss-gray-700">Lv.{mockData.level}</span>
                </div>
                <motion.div
                  className="w-12 h-12 bg-toss-green/10 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <span className="text-2xl">🌍</span>
                </motion.div>
              </div>
            </div>

            {/* 하단: 성과 비교 */}
            <div className="bg-toss-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaArrowUp className="text-toss-green" />
                  <span className="text-sm text-toss-gray-700">어제보다</span>
                  <span className="font-bold text-toss-green">
                    +{(mockData.carbonReduction - mockData.yesterdayReduction).toFixed(1)}kg
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-toss-gray-600">이번 달 목표</p>
                  <p className="text-sm font-bold text-toss-gray-900">25% 달성</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PWA 설치 버튼 */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <PWAInstallButton />
          </motion.div>

          {/* 토스 스타일 편의 기능 */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <h2 className="text-lg font-bold text-toss-gray-900 mb-4 px-1">편의 기능</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🗓️", label: "시간표", path: "/timetable", id: "timetable", color: "bg-blue-50" },
                { icon: "🍽️", label: "학식", path: "/community/hansik", id: "hansik", color: "bg-orange-50" },
                { icon: "📦", label: "중고장터", path: "/marketplace", id: "marketplace", color: "bg-purple-50" },
                { icon: "🚗", label: "카풀", path: "/carpool", id: "carpool", color: "bg-green-50" }
              ].map((item, index) => (
                <motion.button
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-toss-1 border border-toss-gray-200 h-20 flex items-center space-x-3 hover:shadow-toss-2 transition-shadow"
                  onClick={() => router.push(item.path)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.3, duration: 0.3 }}
                >
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <span className="font-medium text-toss-gray-800">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* 토스 스타일 오늘의 성과 */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg font-bold text-toss-gray-900">오늘의 환경 실천</h2>
              <button className="text-sm text-toss-green font-medium">전체보기</button>
            </div>

            {certifications.length > 0 ? (
              <div className="space-y-3">
                {certifications
                  .filter(cert => cert.date === new Date().toISOString().split('T')[0])
                  .slice(0, 3)
                  .map((certification, index) => (
                    <motion.div
                      key={certification.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.5, duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-toss-green/10 rounded-full flex items-center justify-center">
                          <span className="text-lg">✅</span>
                        </div>
                        <div>
                          <p className="font-medium text-toss-gray-900">{certification.title}</p>
                          <p className="text-sm text-toss-gray-600">{certification.time} • {certification.timeAgo}</p>
                        </div>
                      </div>
                      <div className="bg-toss-green/10 text-toss-green px-3 py-1 rounded-full text-sm font-bold">
                        -{certification.carbonReduction}kg
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 text-center border border-toss-gray-200 shadow-toss-1">
                <div className="w-16 h-16 bg-toss-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-bold text-toss-gray-900 mb-2">첫 번째 환경 실천을 시작해보세요!</h3>
                <p className="text-sm text-toss-gray-600 mb-4">텀블러 사용, 분리배출 등 작은 실천이 큰 변화를 만듭니다</p>
                <button
                  className="bg-toss-green text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-toss-green/90 transition-colors"
                  onClick={() => router.push('/certification/tumbler')}
                >
                  지금 시작하기
                </button>
              </div>
            )}
          </motion.div>

          {/* 토스 스타일 이번 달 목표 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-lg font-bold text-toss-gray-900 mb-4 px-1">이번 달 환경 목표</h2>
            <div className="bg-white rounded-2xl p-6 shadow-toss-1 border border-toss-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-toss-gray-600">목표까지</p>
                  <p className="text-2xl font-bold text-toss-gray-900">
                    {(mockData.personalStats.monthlyGoal - (monthlyReduction > 0 ? monthlyReduction : mockData.personalStats.monthlyReduction)).toFixed(1)}kg
                  </p>
                  <p className="text-sm text-toss-gray-600">남았어요</p>
                </div>
                <div className="text-right">
                  <div className="w-16 h-16 relative">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="2"
                        strokeDasharray={`${monthlyReduction > 0
                          ? Math.min((monthlyReduction / mockData.personalStats.monthlyGoal) * 100, 100)
                          : mockData.personalStats.progress
                        }, 100`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-toss-green">
                        {monthlyReduction > 0
                          ? Math.min(Math.round((monthlyReduction / mockData.personalStats.monthlyGoal) * 100), 100)
                          : mockData.personalStats.progress
                        }%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-toss-green/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-toss-gray-600 font-medium">현재 달성량</p>
                    <p className="text-lg font-bold text-toss-green">
                      {monthlyReduction > 0 ? monthlyReduction.toFixed(1) : mockData.personalStats.monthlyReduction}kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-toss-gray-600 font-medium">목표</p>
                    <p className="text-lg font-bold text-toss-gray-900">{mockData.personalStats.monthlyGoal}kg</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 탄소중립 활동 - iOS 스타일 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-3 px-1">
              <h2 className="text-lg font-semibold text-gray-800">탄소중립 활동</h2>
              <div className="flex space-x-2">
                <button
                  className="text-xs text-ios-blue font-medium flex items-center"
                  onClick={() => router.push("/activities/volunteer")}
                >
                  더 많은 봉사활동 <span className="ml-1">›</span>
                </button>
                <button
                  className="text-xs text-ios-blue font-medium flex items-center"
                  onClick={() => router.push("/activities/external")}
                >
                  더 많은 대외활동 <span className="ml-1">›</span>
                </button>
              </div>
            </div>

            {mockData.events.map((event, index) => (
              <motion.div
                key={event.id}
                className={`ios-card p-3 mb-3 border-l-4 ${index === 0 ? 'border-green-500' : 'border-blue-500'}`}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.8, duration: 0.3 }}
                onClick={() => router.push(index === 0 ? "/activities/volunteer" : "/activities/external")}
              >
                <div className="flex items-center">
                  <div className={`${index === 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} p-2 rounded-full mr-3 flex items-center justify-center`} style={{ width: '40px', height: '40px' }}>
                    <span className="text-xl">{index === 0 ? '🌱' : '🌍'}</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <p className={`${index === 0 ? 'text-green-700' : 'text-blue-700'} font-bold text-lg`}>{event.title}</p>
                    <div className="flex items-center ml-auto">
                      <span className={`${index === 0 ? 'text-green-500' : 'text-blue-500'} text-4xl -mt-1`}>›</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 탄소 뉴스 - 카드뉴스 스타일 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-3 px-1">
              <h2 className="text-lg font-semibold text-gray-800">탄소 뉴스</h2>
              <button className="text-xs text-ios-blue font-medium">전체보기</button>
            </div>

            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1.1}
              initialSlide={0}
              loop={false}
              centeredSlides={false}
              className="card-news-swiper"
            >
              {newsItems.map((item, index) => {
                const displayTitle = item.metadata?.title || item.fallback.title;
                const displayContent = item.metadata?.description || item.fallback.content;
                const displayImage = item.metadata?.image;
                const displayDate = item.fallback.date;
                const displayColor = item.fallback.color;
                const displayIcon = item.fallback.icon;
                const displayCategory = item.fallback.category;

                return (
                  <SwiperSlide key={item.id}>
                    <motion.div
                      className="card-news-item rounded-xl overflow-hidden shadow-sm cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index + 0.9, duration: 0.3 }}
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <div className="h-40 w-full flex items-center justify-center relative overflow-hidden">
                        {displayImage && !item.loading ? (
                          <img
                            src={displayImage}
                            alt={displayTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // 이미지 로드 실패 시 fallback 배경색과 아이콘 표시
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.style.backgroundColor = displayColor;
                                parent.innerHTML = `
                                  <div class="text-6xl">${displayIcon}</div>
                                  <div class="absolute top-3 left-3 bg-white bg-opacity-80 px-2 py-1 rounded-full text-xs font-medium">
                                    ${displayCategory}
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <>
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{ backgroundColor: displayColor }}
                            >
                              {item.loading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                              ) : (
                                <div className="text-6xl">{displayIcon}</div>
                              )}
                            </div>
                            <div className="absolute top-3 left-3 bg-white bg-opacity-80 px-2 py-1 rounded-full text-xs font-medium">
                              {displayCategory}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="p-4 bg-white content-area">
                        <p className="text-gray-800 font-bold text-lg mb-2 line-clamp-2">{displayTitle}</p>
                        <p className="text-sm text-gray-600 mb-3 content-text line-clamp-3">{displayContent}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-xs text-gray-500">{displayDate}</span>
                          <button
                            className="text-xs bg-primary text-white font-medium px-3 py-1 rounded-full shadow-sm hover:bg-primary/90 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(item.url, '_blank');
                            }}
                          >
                            자세히 보기
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}

// 로그인 전 기본 홈 화면 (iOS 스타일 적용)
function LoggedOutHome({ router }: Readonly<{ router: ReturnType<typeof useRouter> }>) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white">
      <motion.div
        className="text-center px-6 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="relative w-48 h-48 mx-auto mb-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3
          }}
        >
          {/* 그림자 효과 - iOS 스타일 */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black opacity-5 rounded-full blur-lg"></div>

          {/* 탄소중립 아이콘 애니메이션 */}
          <div className="relative z-10">
            <div className="w-32 h-32 bg-toss-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div
                className="text-6xl"
                style={{
                  animation: 'gentleBounce 2s ease-in-out infinite'
                }}
              >
                🌱
              </div>
            </div>
            {/* 주변 떠다니는 아이콘들 */}
            <div className="absolute top-0 left-8 animate-ping">
              <span className="text-2xl opacity-60">🍃</span>
            </div>
            <div className="absolute top-4 right-8 animate-pulse">
              <span className="text-2xl opacity-40">♻️</span>
            </div>
            <div className="absolute bottom-8 left-4 animate-bounce">
              <span className="text-xl opacity-50">🌍</span>
            </div>
            <div className="absolute bottom-4 right-12 animate-ping">
              <span className="text-xl opacity-30">💚</span>
            </div>
          </div>

          {/* 애니메이션 스타일 */}
          <style jsx>{`
            @keyframes gentleBounce {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-8px) scale(1.05); }
            }
          `}</style>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          탄소중립 챌린지
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-12 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          일상 속 작은 실천으로<br />
          지구를 지키고 보상도 받아보세요!
        </motion.p>

        <motion.div
          className="flex flex-col space-y-4 w-full max-w-xs mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {/* PWA 설치 버튼 */}
          <PWAInstallButton />

          <motion.button
            className="ios-button w-full py-4 text-white font-semibold text-lg"
            onClick={() => router.push("/auth/login")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            로그인
          </motion.button>

          <motion.button
            className="ios-button-secondary w-full py-4 font-semibold text-lg"
            onClick={() => router.push("/auth/signup")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            회원가입
          </motion.button>
        </motion.div>

        <motion.p
          className="mt-12 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          함께하는 탄소중립, 더 나은 미래를 위한 첫걸음
        </motion.p>
      </motion.div>
    </div>
  );
}
