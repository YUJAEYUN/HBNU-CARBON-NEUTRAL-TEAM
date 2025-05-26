"use client";
import { FaFileAlt, FaInfoCircle } from "react-icons/fa";

interface CharacterHeaderProps {
  onInfoClick: () => void;
  onStatsClick: () => void;
}

export default function CharacterHeader({ onInfoClick, onStatsClick }: CharacterHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      {/* 네비게이션 바 */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="w-10 h-10"></div> {/* 균형을 위한 빈 공간 */}
        <h1 className="text-lg font-bold text-gray-900">나의 캐릭터</h1>
        <div className="flex space-x-1">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            onClick={onStatsClick}
            aria-label="활동 실적 보기"
          >
            <FaFileAlt className="text-gray-600 text-lg" />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            onClick={onInfoClick}
            aria-label="캐릭터 정보 보기"
          >
            <FaInfoCircle className="text-gray-600 text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
