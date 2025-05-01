"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {FaUserCircle, FaTree, FaCamera, FaHome, FaBolt, FaCoins, FaComments, FaUser } from "react-icons/fa";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [shake, setShake] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false); // ✅ 토큰 없으면 로그인되지 않은 상태
      return;
    }

    setIsLoggedIn(true); // ✅ 토큰이 있으면 로그인된 상태

    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("인증 실패");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
        setIsLoggedIn(false); // 인증 실패 시 로그아웃 상태로 전환
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center">
      <div className="w-full h-full min-h-screen max-w-[430px] mx-auto bg-white shadow-lg flex flex-col relative overflow-hidden">
        {isLoggedIn ? <LoggedInHome user={user} router={router} shake={shake} setShake={setShake}/> : <LoggedOutHome router={router} />}
      </div>
    </div>
  );
}

// ✅ 로그인 후 홈 화면 (새로운 UI)
function LoggedInHome({ user, router, shake, setShake }: { user: any; router: any; shake: boolean; setShake: any }) {
  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]"> {/* 네비게이션 바 높이만큼 패딩 추가 */}
      {/* 상단 타이틀 */}
      <div className="w-full bg-primary py-6 px-4 shadow-md">
        <h1 className="text-2xl font-bold text-white text-center">
          탄소중립 챌린지
        </h1>
      </div>

      {user ? (
        <div className="flex-1 flex flex-col px-4 overflow-y-auto pt-4">
          {/* 환경 정보 카드 */}
          <div className="w-full bg-gradient-to-r from-primary-light to-primary-medium rounded-xl p-5 mb-5 shadow-md">
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-dark">🌳 {user?.trees || 0}</p>
                <p className="text-primary-dark text-sm font-medium">나무</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-dark">🎖 {user?.level || 1}</p>
                <p className="text-primary-dark text-sm font-medium">레벨</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-dark">🏆 {user?.points || 0}</p>
                <p className="text-primary-dark text-sm font-medium">포인트</p>
              </div>
            </div>
          </div>

          {/* 미션 카드 */}
          <div className="w-full bg-white rounded-xl shadow-md p-5 mb-5 border border-primary-light">
            <h2 className="text-lg font-bold text-primary-dark mb-3">진행 중인 챌린지</h2>
            <div className="flex items-center justify-between bg-primary-light p-4 rounded-lg">
              <div>
                <h3 className="text-lg font-bold text-primary-dark">1일 1 채식 도전팀</h3>
                <p className="text-sm text-primary">🚩 15 tCO₂eq 절감 목표</p>
                <div className="flex mt-2">
                  {[...Array(3)].map((_, i) => (
                    <FaUserCircle key={i} className="text-primary-medium text-2xl -ml-1" />
                  ))}
                  <span className="text-gray-600 text-sm ml-2">+5명</span>
                </div>
              </div>
              <div className="w-20 h-20">
                <CircularProgressbar
                  value={12}
                  text={`12%`}
                  styles={buildStyles({
                    pathColor: "#4CAF50",
                    textColor: "#2E7D32",
                    trailColor: "#E8F5E9",
                  })}
                />
              </div>
            </div>
          </div>

          {/* 캐릭터 섹션 */}
          <div className="flex-1 flex flex-col justify-center items-center relative my-5">
            <motion.div
              className="absolute -top-8 bg-primary-light px-4 py-2 rounded-full shadow-md border border-primary-medium"
              animate={{ y: [-5, 5] }}
              transition={{ repeat: Infinity, repeatType: "mirror", duration: 1.5 }}
            >
              <p className="text-primary-dark font-medium">🌿 캐릭터를 터치해보세요!</p>
            </motion.div>

            <motion.div
              className="bg-primary-light p-8 rounded-full shadow-lg border-4 border-primary-medium"
              animate={shake ? { rotate: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.5 }}
              onClick={() => setShake(true)}
              onAnimationComplete={() => setShake(false)}
              whileHover={{ scale: 1.05 }}
            >
              <img src="/village.png" alt="마을 숲" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
            </motion.div>
          </div>

          {/* 나무 심기 섹션 */}
          <div className="w-full mt-auto p-5 bg-primary rounded-xl shadow-md mb-5">
            <p className="text-lg font-bold text-white mb-3">오늘의 나무를 심어볼까요?</p>
            <button className="w-full bg-white hover:bg-primary-light text-primary-dark py-3 rounded-lg transition-colors duration-200 shadow-md font-bold">
              미션 시작하기
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}

// ✅ 로그인 전 기본 홈 화면
function LoggedOutHome({ router }: { router: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-primary-light to-white">
      <div className="text-center px-6 py-10">
        <img src="/village.png" alt="탄소중립 챌린지" className="w-32 h-32 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-primary-dark mb-4">탄소중립 챌린지</h1>
        <p className="text-gray-700 mb-8 text-lg">
          일상 속 작은 실천으로<br />
          지구를 지키고 보상도 받아보세요!
        </p>

        <div className="flex flex-col space-y-4 w-full max-w-xs mx-auto">
          <button
            className="w-full px-6 py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-dark transition-colors duration-200"
            onClick={() => router.push("/auth/login")}
          >
            로그인
          </button>
          <button
            className="w-full px-6 py-4 bg-white text-primary border-2 border-primary rounded-xl font-bold shadow-sm hover:bg-primary-light transition-colors duration-200"
            onClick={() => router.push("/auth/signup")}
          >
            회원가입
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-600">
          함께하는 탄소중립, 더 나은 미래를 위한 첫걸음
        </p>
      </div>
    </div>
  );
}
