"use client";
import { FaFileAlt, FaInfoCircle } from "react-icons/fa";

interface CharacterHeaderProps {
  onInfoClick: () => void;
  onStatsClick: () => void;
}

export default function CharacterHeader({ onInfoClick, onStatsClick }: CharacterHeaderProps) {
  return (
    <div className="w-full bg-white py-4 px-5 flex justify-between items-center border-b border-toss-gray-200">
      <h1 className="text-xl font-bold text-toss-gray-900">나의 캐릭터</h1>
      <div className="flex space-x-2">
        <button
          className="w-10 h-10 bg-toss-gray-100 rounded-full flex items-center justify-center hover:bg-toss-gray-200 transition-colors"
          onClick={onStatsClick}
          aria-label="활동 실적 보기"
        >
          <FaFileAlt className="text-toss-gray-600 text-lg" />
        </button>
        <button
          className="w-10 h-10 bg-toss-gray-100 rounded-full flex items-center justify-center hover:bg-toss-gray-200 transition-colors"
          onClick={onInfoClick}
          aria-label="캐릭터 정보 보기"
        >
          <FaInfoCircle className="text-toss-gray-600 text-lg" />
        </button>
      </div>
    </div>
  );
}
