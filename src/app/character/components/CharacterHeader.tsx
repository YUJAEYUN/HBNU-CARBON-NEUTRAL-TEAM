"use client";
import { FaFileAlt, FaInfoCircle } from "react-icons/fa";

interface CharacterHeaderProps {
  onInfoClick: () => void;
  onStatsClick: () => void;
}

export default function CharacterHeader({ onInfoClick, onStatsClick }: CharacterHeaderProps) {
  return (
    <div className="w-full bg-primary py-4 px-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-white">나의 캐릭터</h1>
      <div className="flex space-x-2">
        <button
          className="text-white p-2 rounded-full"
          onClick={onStatsClick}
          aria-label="활동 실적 보기"
        >
          <FaFileAlt className="text-xl" />
        </button>
        <button
          className="text-white p-2 rounded-full"
          onClick={onInfoClick}
          aria-label="캐릭터 정보 보기"
        >
          <FaInfoCircle className="text-xl" />
        </button>
      </div>
    </div>
  );
}
