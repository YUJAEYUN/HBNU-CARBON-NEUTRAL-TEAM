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

export default function HomePage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full h-full flex flex-col relative overflow-hidden">
        {isLoggedIn ? <LoggedInHome user={user} router={router} /> : <LoggedOutHome router={router} />}
      </div>
    </div>
  );
}

// 로그인 후 홈 화면 (입체적 디자인 적용)
function LoggedInHome({ user, router }: Readonly<{ user: Record<string, unknown> | null; router: ReturnType<typeof useRouter> }>) {
  // 탄소 절감량 애니메이션을 위한 상태
  const [carbonValue, setCarbonValue] = useState(0);
  const targetValue = 0.87; // 최종 표시될 값

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
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]"> {/* 네비게이션 바 높이만큼 패딩 추가 */}
      {/* 상단 타이틀 - 유리 효과 적용 */}
      <motion.div
        className="w-full bg-primary bg-opacity-90 backdrop-filter backdrop-blur-md py-4 px-4 flex justify-between items-center shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-xl font-bold text-white"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          C-nergy
        </motion.h1>
        <motion.button
          className="text-white p-2 rounded-full bg-white bg-opacity-20"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaBolt className="text-xl" />
        </motion.button>
      </motion.div>

      {user ? (
        <div className="flex-1 flex flex-col px-4 overflow-y-auto pt-4">
          {/* 탄소 절감량 카드 - 3D 효과 적용 */}
          <motion.div
            className="card-3d w-full p-5 mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-primary-dark mb-2">오늘의 탄소 절감량</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="relative">
                  <motion.p
                    className="text-3xl font-bold text-primary-dark"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>{carbonValue.toFixed(2)}</span>kg CO<sub>2</sub>
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
                <p className="text-xs text-gray-500 mt-1">어제보다 0.2kg 더 절감했어요!</p>
              </div>
              <div className="w-16 h-16 relative">
                <CircularProgressbar
                  value={65}
                  text={`Lv.3`}
                  styles={buildStyles({
                    textSize: '28px',
                    pathColor: '#4CAF50',
                    textColor: '#2E7D32',
                    trailColor: '#E8F5E9',
                    pathTransition: 'stroke-dashoffset 0.5s ease 0s',
                  })}
                />
              </div>
            </div>
          </motion.div>

          {/* 카테고리 그리드 - 뉴모피즘 효과 적용 */}
          <motion.div
            className="grid grid-cols-4 gap-3 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {[
              { icon: "🗓️", label: "시간표", path: "/timetable", id: "timetable" },
              { icon: "🍽️", label: "식사", path: "/community/hansik", id: "hansik" },
              { icon: "🏫", label: "교통", path: "/", id: "transport" },
              { icon: "📊", label: "온도계", path: "/", id: "temperature" },
              { icon: "🚶", label: "걸음수", path: "/", id: "steps" },
              { icon: "🌱", label: "캐릭터", path: "/character", id: "character" },
              { icon: "🚗", label: "카풀", path: "/carpool", id: "carpool" },
              { icon: "📝", label: "게시판", path: "/community", id: "community" }
            ].map((item, index) => (
              <motion.button
                key={item.id}
                className="neu-card p-3 flex flex-col items-center justify-center"
                onClick={() => router.push(item.path)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <span className="text-2xl mb-1">
                  {item.icon}
                </span>
                <span className="text-xs font-medium text-primary-dark">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* 오늘의 활동 - 카드 효과 적용 */}
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-lg font-bold text-primary-dark mb-3 px-1">오늘의 활동</h2>
            <motion.div
              className="card-3d p-4 mb-3"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-gray-800 font-medium">교내 카페에서 텀블러 사용하여 일회용컵 절약</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">오전 9시 • 9분 전</span>
                <span className="text-sm bg-primary-light text-primary-dark font-medium px-2 py-1 rounded-full">-0.12kg</span>
              </div>
            </motion.div>
            <motion.div
              className="card-3d p-4"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-gray-800 font-medium">이번주 계단 이용하기 목표 달성</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">오전 8시 • 32분 전</span>
                <span className="text-sm bg-primary-light text-primary-dark font-medium px-2 py-1 rounded-full">-0.25kg</span>
              </div>
            </motion.div>
          </motion.div>

          {/* 추천 활동 - 유리 효과 적용 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h2 className="text-lg font-bold text-primary-dark mb-3 px-1">추천 활동</h2>
            <motion.div
              className="glass-effect p-4 mb-3 bg-primary-light bg-opacity-50"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start">
                <div className="bg-primary bg-opacity-20 p-2 rounded-full mr-3">
                  <span className="text-xl">🥗</span>
                </div>
                <div className="flex-1">
                  <p className="text-primary-dark font-medium">학교 식당에서 채식 메뉴 선택하기</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">점심 • 12시 30분</span>
                    <span className="text-sm bg-primary bg-opacity-20 text-primary-dark font-medium px-2 py-1 rounded-full">-0.5kg</span>
                  </div>
                </div>
              </div>
            </motion.div>
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

// 로그인 전 기본 홈 화면 (입체적 디자인 적용)
function LoggedOutHome({ router }: Readonly<{ router: ReturnType<typeof useRouter> }>) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-primary-light via-white to-primary-light">
      <motion.div
        className="text-center px-6 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="relative w-40 h-40 mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3
          }}
        >
          {/* 그림자 효과 */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black opacity-10 rounded-full blur-md"></div>

          {/* 이미지 */}
          <div className="relative z-10">
            <Image
              src="/village.png"
              alt="탄소중립 챌린지"
              width={160}
              height={160}
              className="drop-shadow-xl"
            />
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-primary-dark mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          탄소중립 챌린지
        </motion.h1>

        <motion.p
          className="text-gray-700 mb-10 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          일상 속 작은 실천으로<br />
          지구를 지키고 보상도 받아보세요!
        </motion.p>

        <motion.div
          className="flex flex-col space-y-5 w-full max-w-xs mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <motion.button
            className="button-3d w-full px-6 py-4 text-white rounded-xl font-bold"
            onClick={() => router.push("/auth/login")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97, y: 4 }}
          >
            로그인
          </motion.button>

          <motion.button
            className="neu-button w-full px-6 py-4 rounded-xl font-bold"
            onClick={() => router.push("/auth/signup")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            회원가입
          </motion.button>
        </motion.div>

        <motion.p
          className="mt-10 text-sm text-gray-600"
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
