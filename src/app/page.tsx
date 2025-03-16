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
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/forest-bg.jpg')" }}
    >
      <div className="w-[375px] h-[812px] bg-white/80 shadow-lg rounded-lg flex flex-col relative overflow-hidden">
        {isLoggedIn ? <LoggedInHome user={user} router={router} shake={shake} setShake={setShake}/> : <LoggedOutHome router={router} />}
      </div>
    </div>
  );
}

// ✅ 로그인 후 홈 화면 (기존 UI)
function LoggedInHome({ user, router, shake, setShake  }: { user: any; router: any; shake: boolean; setShake: any }) {
    return (
      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/forest-bg.jpg')" }}
      >
        <div className="w-[375px] h-[812px] bg-white/80 shadow-lg rounded-lg flex flex-col relative overflow-hidden">
          {/* ✅ 상단 타이틀 */}
          <h1 className="w-40 h-20 text-2xl font-bold text-center text-gray-800 mt-6">테스트</h1>
  
          {user ? (
            <div className="flex flex-col items-center overflow-y-auto">
              {/* ✅ 환경 정보 (테스트 제목과 더 가까운 위치) */}
              <div className="flex items-center justify-between w-[67%] bg-gray-100 rounded-lg p-3 mt-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">🌳 {user.trees}</p>
                  <p className="text-gray-600 text-sm">그루</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">🎖 {user.level}</p>
                  <p className="text-gray-600 text-sm">레벨</p>
                </div>
              </div>
  
              {/* 진행 중인 미션 */}
            <div className="mt-4 p-4 bg-white border rounded-lg shadow-md w-[67%] max-w-[400px] flex items-center">
              {/* 왼쪽: 미션 정보 */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800">1일 1 채식 도전팀</h2>
                <p className="text-sm text-gray-500">🚩 15 tCO₂eq</p>
                {/* 참여자 아이콘 */}
                <div className="flex mt-2">
                  {[...Array(3)].map((_, i) => (
                    <FaUserCircle key={i} className="text-gray-400 text-2xl -ml-1" />
                  ))}
                  <span className="text-gray-500 text-sm ml-2">+5명</span>
                </div>
              </div>
              {/* 오른쪽: 원형 진행도 */}
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={12}
                  text={`12%`}
                  styles={buildStyles({
                    pathColor: "#3b82f6",
                    textColor: "#3b82f6",
                    trailColor: "#e5e7eb",
                    textSize: "18px",
                  })}
                  />
                  </div>
                </div>
  
              {/* ✅ 마을 숲(게임 요소) + 떠다니는 캡션 */}
              <div className="relative w-full flex justify-center mt-10">
                {/* 대화 캡션 */}
                <motion.div
                  className="absolute top-[-40px] bg-white p-2 rounded-lg shadow-md text-sm font-bold text-gray-800"
                  animate={{ y: [-5,5] }}
                  transition={{ repeat: Infinity, repeatType: "mirror", duration: 1}}
                >
                  🌿 캐릭터를 터치해보세요!
                </motion.div>
  
                {/* 마을 숲 이미지 */}
                <motion.div
                  className="bg-green-200 p-4 rounded-lg shadow-md"
                  animate={shake ? { rotate: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  onClick={() => setShake(true)}
                  onAnimationComplete={() => setShake(false)}
                >
                  <img src="/village.png" alt="마을 숲" className="w-40 h-40 object-contain" />
                </motion.div>
              </div>
  
              {/* ✅ 나무 심기 */}
              <div className="mt-4 p-4 bg-green-100 rounded-lg shadow-md w-[80%] max-w-[400px]">
                <p className="text-lg font-bold text-green-800">오늘의 나무를 심어볼까요?</p>
                <button className="mt-2 w-full bg-green-500 text-white p-2 rounded-md">
                  미션 확인
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-10">로딩 중...</p>
          )}
  
        </div>
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
