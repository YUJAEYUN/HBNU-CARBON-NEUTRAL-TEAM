"use client";

import { useEffect, useState } from "react";

export default function HansikPage() {
  const [mealData, setMealData] = useState<{ date: string; lunch: string; dinner: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [today, setToday] = useState<string>("");

  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await fetch("/api/hansik");  // ✅ API 요청
        if (!response.ok) throw new Error("서버 응답 오류");

        const data = await response.json();
        setMealData(data);

        // ✅ 현재 날짜 가져오기
        const todayDate = new Date();
        const year = todayDate.getFullYear();
        const month = String(todayDate.getMonth() + 1).padStart(2, "0");
        const day = String(todayDate.getDate()).padStart(2, "0");
        const daysInKorean = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
        const todayLabel = daysInKorean[todayDate.getDay()];

        setToday(`${year}-${month}-${day} (${todayLabel})`); // ✅ YYYY-MM-DD (요일) 형식
      } catch (error) {
        console.error("학식 정보를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMeals();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg font-semibold">로딩 중...</div>;
  }

  if (!mealData) {
    return <div className="flex justify-center items-center min-h-screen text-lg font-semibold">학식 정보를 가져올 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-[375px] bg-white shadow-lg rounded-lg p-6">
        {/* ✅ 날짜 및 요일 표시 */}
        <h1 className="text-xl font-bold text-gray-800 text-center mb-4">📅 {today} 학식 정보</h1>

        {/* ✅ 중식 정보 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-green-700">🍱 중식</h2>
          <ul className="mt-2 bg-green-100 p-3 rounded-lg shadow">
            {mealData.lunch.split("\n").map((item, index) => (
              <li key={index} className="text-gray-800">{item}</li>
            ))}
          </ul>
        </div>

        {/* ✅ 석식 정보 */}
        <div>
          <h2 className="text-lg font-bold text-blue-700">🌙 석식</h2>
          <ul className="mt-2 bg-blue-100 p-3 rounded-lg shadow">
            {mealData.dinner.split("\n").map((item, index) => (
              <li key={index} className="text-gray-800">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
