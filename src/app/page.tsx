"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaBolt } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

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
      monthlyGoal: 20,
      monthlyReduction: 12.5,
      progress: 65
    },
    events: [
      { id: 1, title: "교내 환경 봉사활동", date: "5월 15일", time: "14:00", duration: "2시간" },
      { id: 2, title: "탄소중립 캠페인", date: "5월 20일", time: "10:00", duration: "3시간" }
    ],
    news: [
      {
        id: 1,
        title: "대학생 탄소중립 아이디어 공모전 개최",
        content: "환경부에서 주관하는 대학생 탄소중립 아이디어 공모전이 다음 달 개최됩니다. 참가자들은 일상 속 탄소 배출을 줄이는 창의적인 아이디어를 제안할 수 있습니다.",
        date: "2023.05.10",
        image: "/news/carbon-neutral-idea.jpg",
        color: "#C8E6C9"
      },
      {
        id: 2,
        title: "캠퍼스 내 일회용품 사용 제한 확대",
        content: "우리 대학은 다음 학기부터 캠퍼스 내 일회용품 사용을 단계적으로 제한합니다. 학생들은 개인 텀블러와 식기를 지참하는 것이 권장됩니다.",
        date: "2023.05.08",
        image: "/news/disposable-ban.jpg",
        color: "#BBDEFB"
      },
      {
        id: 3,
        title: "탄소발자국 줄이기 캠페인 시작",
        content: "우리 대학에서는 이번 달부터 '나의 탄소발자국 줄이기' 캠페인을 시작합니다. 참여 학생들은 일상 속에서 탄소 배출을 줄이는 활동을 기록하고 공유할 수 있습니다.",
        date: "2023.05.05",
        image: "/news/carbon-footprint.jpg",
        color: "#FFECB3"
      },
      {
        id: 4,
        title: "친환경 교통수단 이용 장려 프로그램",
        content: "대학 내 자전거 이용과 카풀 참여를 장려하기 위한 새로운 프로그램이 시작됩니다. 참여 학생들에게는 다양한 혜택이 제공됩니다.",
        date: "2023.05.03",
        image: "/news/eco-transportation.jpg",
        color: "#E1BEE7"
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
  news: Array<{
    id: number;
    title: string;
    content: string;
    date: string;
    image: string;
    color: string;
  }>;
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
  const targetValue = mockData.carbonReduction; // 목업 데이터에서 값 가져오기

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
    <div className="flex-1 flex flex-col h-full pb-[76px]"> {/* 네비게이션 바 높이만큼 패딩 추가 */}
      {/* 상단 타이틀 - iOS 스타일 헤더 */}
      <motion.div
        className="ios-header sticky top-0 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-xl font-semibold text-gray-800"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          C-nergy
        </motion.h1>
        <motion.button
          className="ios-icon-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBolt className="text-primary text-lg" />
        </motion.button>
      </motion.div>

      {user ? (
        <div className="flex-1 flex flex-col px-4 overflow-y-auto pt-4">
          {/* 탄소 절감량 카드 - iOS 스타일 카드 */}
          <motion.div
            className="ios-card w-full p-5 mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium text-gray-500 mb-2">오늘의 탄소 절감량</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="relative">
                  <motion.p
                    className="text-3xl font-bold text-gray-800"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>{carbonValue.toFixed(2)}</span>
                    <span className="text-lg font-medium">kg</span>
                  </motion.p>
                  {/* 애니메이션 완료 시 표시되는 효과 */}
                  {carbonValue >= targetValue * 0.99 && (
                    <motion.div
                      className="absolute -right-2 -top-2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 10 }}
                    >
                      <span className="text-lg">✨</span>
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  어제보다 {(mockData.carbonReduction - mockData.yesterdayReduction).toFixed(2)}kg 더 절감했어요!
                </p>
              </div>
              <div className="w-16 h-16 relative">
                <CircularProgressbar
                  value={mockData.levelProgress}
                  text={`Lv.${mockData.level}`}
                  styles={buildStyles({
                    textSize: '28px',
                    pathColor: '#34C759', // iOS 그린 색상
                    textColor: '#248A3D',
                    trailColor: '#E9F9EF',
                    pathTransition: 'stroke-dashoffset 0.5s ease 0s',
                  })}
                />
              </div>
            </div>
          </motion.div>

          {/* 핵심 버튼 - 4개로 축소 (iOS 스타일) */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {[
              { icon: "🗓️", label: "시간표", path: "/timetable", id: "timetable" },
              { icon: "🍽️", label: "학식", path: "/community/hansik", id: "hansik" },
              { icon: "📦", label: "중고장터", path: "/marketplace", id: "marketplace" },
              { icon: "🚗", label: "카풀", path: "/carpool", id: "carpool" }
            ].map((item, index) => (
              <motion.button
                key={item.id}
                className="ios-grid-item h-28 rounded-2xl"
                onClick={() => router.push(item.path)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <span className="text-4xl mb-2">
                  {item.icon}
                </span>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* 오늘의 활동 - iOS 스타일 카드 */}
          {/* <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3 px-1">오늘의 활동</h2>

            {mockData.activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="ios-card p-4 mb-3"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.5, duration: 0.3 }}
              >
                <p className="text-gray-800 font-medium">{activity.title}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{activity.time} • {activity.timeAgo}</span>
                  <span className="text-sm bg-gray-100 text-primary font-medium px-3 py-1 rounded-full">
                    -{activity.reduction}kg
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div> */}

          {/* 개인실적 - iOS 스타일 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3 px-1">개인실적</h2>
            <motion.div
              className="ios-card p-4 mb-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-800 font-medium">이번 달 탄소 절감량</p>
                <span className="text-sm bg-gray-100 text-primary font-medium px-3 py-1 rounded-full">
                  {mockData.personalStats.monthlyReduction}kg
                </span>
              </div>
              <div className="mt-4 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-1000"
                  style={{ width: `${mockData.personalStats.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">목표: {mockData.personalStats.monthlyGoal}kg</span>
                <span className="text-xs text-primary font-medium">{mockData.personalStats.progress}%</span>
              </div>
            </motion.div>
          </motion.div>

          {/* 대외활동/봉사활동 - iOS 스타일 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3 px-1">대외활동/봉사활동</h2>

            {mockData.events.map((event, index) => (
              <motion.div
                key={event.id}
                className="ios-card p-4 mb-3"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.8, duration: 0.3 }}
              >
                <div className="flex items-start">
                  <div className="bg-gray-100 p-3 rounded-full mr-3">
                    <span className="text-xl">{index === 0 ? '🌱' : '🌍'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{event.title}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">{event.date} • {event.time}</span>
                      <span className="text-sm bg-gray-100 text-primary font-medium px-3 py-1 rounded-full">
                        {event.duration}
                      </span>
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
              {mockData.news.map((item, index) => (
                <SwiperSlide key={item.id}>
                  <motion.div
                    className="card-news-item rounded-xl overflow-hidden shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index + 0.9, duration: 0.3 }}
                  >
                    <div className="h-40 w-full flex items-center justify-center relative" style={{ backgroundColor: `${item.color}` }}>
                      <div className="text-6xl">
                        {index === 0 ? '🌱' : index === 1 ? '♻️' : index === 2 ? '👣' : '🚲'}
                      </div>
                      <div className="absolute top-3 left-3 bg-white bg-opacity-80 px-2 py-1 rounded-full text-xs font-medium">
                        {index === 0 ? '아이디어 공모전' : index === 1 ? '캠퍼스 정책' : index === 2 ? '캠페인' : '친환경 교통'}
                      </div>
                    </div>
                    <div className="p-4 bg-white content-area">
                      <p className="text-gray-800 font-bold text-lg mb-2">{item.title}</p>
                      <p className="text-sm text-gray-600 mb-3 content-text">{item.content}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-xs text-gray-500">{item.date}</span>
                        <button className="text-xs bg-primary text-white font-medium px-3 py-1 rounded-full shadow-sm">
                          자세히 보기
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
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

          {/* 이미지 */}
          <div className="relative z-10 animate-bounce-sm">
            <Image
              src="/village.png"
              alt="탄소중립 챌린지"
              width={180}
              height={180}
              className="drop-shadow-md"
            />
          </div>
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
