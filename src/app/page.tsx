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
      <div className="w-full h-full min-h-screen max-w-[430px] mx-auto bg-white/80 shadow-lg flex flex-col relative overflow-hidden">
        {isLoggedIn ? <LoggedInHome user={user} router={router} shake={shake} setShake={setShake}/> : <LoggedOutHome router={router} />}
      </div>
    </div>
  );
}

// ✅ 로그인 후 홈 화면 (기존 UI)
function LoggedInHome({ user, router, shake, setShake }: { user: any; router: any; shake: boolean; setShake: any }) {
  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]"> {/* 네비게이션 바 높이만큼 패딩 추가 */}
      {/* 상단 타이틀 */}
      <h1 className="w-full text-2xl font-bold text-center text-green-800 mt-safe pt-4 mb-4">
        탄소중립 챌린지
      </h1>

      {user ? (
        <div className="flex-1 flex flex-col px-4 overflow-y-auto">
          {/* 환경 정보 카드 */}
          <div className="w-full bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4 mb-4">
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-xl font-bold text-green-700">🌳 {user.trees}</p>
                <p className="text-green-600 text-sm">나무</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-blue-700">🎖 {user.level}</p>
                <p className="text-blue-600 text-sm">레벨</p>
              </div>
            </div>
          </div>

          {/* 미션 카드 */}
          <div className="w-full bg-white rounded-xl shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">1일 1 채식 도전팀</h2>
                <p className="text-sm text-green-600">🚩 15 tCO₂eq 절감 목표</p>
                <div className="flex mt-2">
                  {[...Array(3)].map((_, i) => (
                    <FaUserCircle key={i} className="text-green-400 text-2xl -ml-1" />
                  ))}
                  <span className="text-gray-500 text-sm ml-2">+5명</span>
                </div>
              </div>
              <div className="w-20 h-20">
                <CircularProgressbar
                  value={12}
                  text={`12%`}
                  styles={buildStyles({
                    pathColor: "#22c55e",
                    textColor: "#22c55e",
                    trailColor: "#e5e7eb",
                  })}
                />
              </div>
            </div>
          </div>

          {/* 캐릭터 섹션 */}
          <div className="flex-1 flex flex-col justify-center items-center relative my-4">
            <motion.div
              className="absolute -top-8 bg-white/90 px-4 py-2 rounded-full shadow-lg"
              animate={{ y: [-5, 5] }}
              transition={{ repeat: Infinity, repeatType: "mirror", duration: 1.5 }}
            >
              <p className="text-green-700 font-medium">🌿 캐릭터를 터치해보세요!</p>
            </motion.div>

            <motion.div
              className="bg-green-100 p-6 rounded-full shadow-lg"
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
          <div className="w-full mt-auto p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-md mb-4">
            <p className="text-lg font-bold text-green-800 mb-3">오늘의 나무를 심어볼까요?</p>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors duration-200 shadow-md">
              미션 시작하기
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}

// ✅ 로그인 전 기본 홈 화면
function LoggedOutHome({ router }: { router: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white">
      <h1 className="text-3xl font-bold text-gray-800">탄소중립 챌린지</h1>
      <p className="text-gray-600 mt-2">탄소 절감을 실천하고 보상을 받아보세요!</p>
      <div className="mt-6 flex space-x-4">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-md"
          onClick={() => router.push("/auth/login")}
        >
          로그인
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-md"
          onClick={() => router.push("/auth/signup")}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
