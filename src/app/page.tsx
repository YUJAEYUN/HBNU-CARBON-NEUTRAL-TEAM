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
      <div className="w-full bg-primary py-4 px-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold text-white">C-nergy</h1>
        <button className="text-white p-2 rounded-full">
          <FaBolt className="text-xl" />
        </button>
      </div>

      {user ? (
        <div className="flex-1 flex flex-col px-4 overflow-y-auto pt-4">
          {/* 탄소 절감량 카드 */}
          <div className="w-full bg-primary-light rounded-xl p-4 mb-4">
            <p className="text-sm text-primary-dark mb-1">오늘의 탄소 절감량</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-primary-dark">0.87kg CO<sub>2</sub></p>
              <div className="flex items-center">
                <p className="text-sm text-primary-dark mr-1">Lv.3</p>
                <span className="text-primary-dark">⭐</span>
              </div>
            </div>
          </div>

          {/* 카테고리 그리드 */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { icon: "🗓️", label: "시간표", path: "/timetable" },
              { icon: "🍽️", label: "식사", path: "/community/hansik" },
              { icon: "🏫", label: "교통", path: "/" },
              { icon: "📊", label: "온도계", path: "/" },
              { icon: "🚶", label: "걸음수", path: "/" },
              { icon: "🌱", label: "캐릭터", path: "/character" },
              { icon: "🚗", label: "카풀", path: "/carpool" },
              { icon: "📝", label: "게시판", path: "/community" }
            ].map((item, index) => (
              <button
                key={index}
                className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center"
                onClick={() => router.push(item.path)}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>

          {/* 오늘의 활동 */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary-dark mb-2 px-1">오늘의 활동</h2>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100">
              <p className="text-gray-800 font-medium">교내 카페에서 텀블러 사용하여 일회용컵 절약</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">오전 9시 • 9분 전</span>
                <span className="text-sm text-primary-dark font-medium">-0.12kg</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <p className="text-gray-800 font-medium">이번주 계단 이용하기 목표 달성</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">오전 8시 • 32분 전</span>
                <span className="text-sm text-primary-dark font-medium">-0.25kg</span>
              </div>
            </div>
          </div>

          {/* 추천 활동 */}
          <div>
            <h2 className="text-lg font-bold text-primary-dark mb-2 px-1">추천 활동</h2>
            <div className="bg-primary-light rounded-lg p-4 mb-3 border border-primary-medium">
              <p className="text-primary-dark font-medium">학교 식당에서 채식 메뉴 선택하기</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">점심 • 12시 30분</span>
                <span className="text-sm text-primary-dark font-medium">-0.5kg</span>
              </div>
            </div>
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
