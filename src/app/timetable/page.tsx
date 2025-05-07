"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaArrowLeft } from "react-icons/fa";

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState<string>("월");
  const router = useRouter();
  const days = ["월", "화", "수", "목", "금"];

  // 시간표 데이터 (실제로는 API나 DB에서 가져올 수 있음)
  const timetableData = {
    월: [
      { time: "10:00", subject: "환경공학", location: "공학관 201호", startHour: 10, endHour: 11 },
      { time: "12:00", subject: "데이터", location: "공학관 305호", startHour: 12, endHour: 13 },
    ],
    화: [],
    수: [
      { time: "13:00", subject: "환경학", location: "공학관 202호", startHour: 13, endHour: 14 },
    ],
    목: [],
    금: [],
  };

  // 시간 범위 (9시부터 17시까지)
  const timeSlots = Array.from({ length: 9 }, (_, i) => 9 + i);

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 */}
      <div className="w-full bg-primary py-4 px-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <button
            className="text-white mr-2"
            onClick={() => router.push("/")}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-white">시간표</h1>
        </div>
        <button className="bg-primary-light bg-opacity-30 text-white p-2 rounded-full">
          <FaPlus />
        </button>
      </div>

      {/* 요일 탭 */}
      <div className="flex bg-gray-100 p-2 space-x-2">
        {days.map((day) => (
          <button
            key={day}
            className={`flex-1 py-2 px-4 text-center rounded-full font-medium ${
              activeDay === day
                ? "bg-primary text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setActiveDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* 시간표 그리드 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative">
          {/* 시간 눈금 */}
          {timeSlots.map((hour) => (
            <div key={hour} className="flex items-start h-16 border-t border-gray-200">
              <div className="w-10 text-xs text-gray-500 pt-1">{`${hour}시`}</div>
              <div className="flex-1"></div>
            </div>
          ))}

          {/* 수업 블록 */}
          {timetableData[activeDay].map((item, index) => (
            <div
              key={index}
              className="absolute left-12 right-2 bg-primary-light rounded-lg p-2 border border-primary-medium"
              style={{
                top: `${(item.startHour - 9) * 64}px`,
                height: `${(item.endHour - item.startHour) * 64}px`,
              }}
            >
              <p className="font-medium text-primary-dark">{item.subject}</p>
              <p className="text-xs text-gray-600">{item.location}</p>
            </div>
          ))}
        </div>

        {timetableData[activeDay].length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>이 날은 수업이 없습니다.</p>
            <button className="mt-2 text-primary font-medium flex items-center">
              <FaPlus className="mr-1" /> 수업 추가하기
            </button>
          </div>
        )}
      </div>

      {/* 하단 정보 */}
      <div className="bg-gray-100 p-3 text-center text-xs text-gray-500">
        다음 수업 · 환경공학 (공학관 201호)
      </div>
    </div>
  );
}
