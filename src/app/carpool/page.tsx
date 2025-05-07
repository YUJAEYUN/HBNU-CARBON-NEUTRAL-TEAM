"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaArrowLeft, FaMapMarkerAlt, FaClock, FaUser, FaCheck } from "react-icons/fa";

export default function CarpoolPage() {
  const router = useRouter();

  // 카풀 데이터 (실제로는 API나 DB에서 가져올 수 있음)
  const carpoolData = {
    date: "2023년 11월 17일 (금요일)",
    time: "오후 3시 30분",
    departure: "한밭대학교 정문",
    destination: "둔산동 시청",
    participants: [
      { id: 1, name: "김환경", status: "확정" },
      { id: 2, name: "이탄소", status: "확정" },
      { id: 3, name: "박중립", status: "대기중" }
    ],
    maxParticipants: 4,
    co2Reduction: 1.2
  };

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
          <h1 className="text-xl font-bold text-white">카풀 등록</h1>
        </div>
        <button className="bg-primary-light bg-opacity-30 text-white p-2 rounded-full">
          <FaPlus />
        </button>
      </div>

      {/* 카풀 정보 카드 */}
      <div className="p-4">
        <div className="bg-primary-light rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-primary-dark">다음 예정된 카풀</h2>
            <span className="text-xs bg-white text-primary-dark px-2 py-1 rounded-full">
              2023년 11월 17일 (금요일)
            </span>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center">
              <FaClock className="text-primary-dark mr-3" />
              <span className="text-gray-700">오후 3시 30분</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-primary-dark mr-3" />
              <div>
                <p className="text-gray-700">한밭대학교 정문</p>
                <p className="text-xs text-gray-500">출발</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-primary-dark mr-3" />
              <div>
                <p className="text-gray-700">둔산동 시청</p>
                <p className="text-xs text-gray-500">도착</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-primary-medium">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-800">참여 인원</h3>
              <span className="text-sm text-primary-dark">
                2/4명
              </span>
            </div>

            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between bg-white p-2 rounded">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center mr-2">
                    <FaUser className="text-primary-dark text-xs" />
                  </div>
                  <span className="text-gray-700">김환경</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                  <FaCheck className="inline mr-1" />확정
                </span>
              </div>
              <div className="flex items-center justify-between bg-white p-2 rounded">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center mr-2">
                    <FaUser className="text-primary-dark text-xs" />
                  </div>
                  <span className="text-gray-700">이탄소</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                  <FaCheck className="inline mr-1" />확정
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-primary-medium">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">예상 탄소 절감량:</span>
              <span className="text-primary-dark font-medium">1.2kg CO<sub>2</sub></span>
            </div>
          </div>
        </div>

        {/* 카풀 등록하기 버튼 */}
        <button className="w-full bg-primary text-white py-3 rounded-lg font-medium shadow-sm">
          카풀 참여하기
        </button>
      </div>

      {/* 하단 정보 */}
      <div className="mt-auto">
        <div className="bg-gray-100 p-3 text-center text-xs text-gray-500">
          다음 수업 · 환경공학 (공학관 201호)
        </div>
      </div>
    </div>
  );
}
