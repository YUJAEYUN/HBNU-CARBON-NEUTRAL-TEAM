'use client';

import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';

interface HansikHeaderProps {
  today: string;
}

const HansikHeader = ({ today }: HansikHeaderProps) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      {/* 네비게이션 바 */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => router.push("/")}
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">한밭대 학식</h1>
        <div className="w-10 h-10"></div> {/* 균형을 위한 빈 공간 */}
      </div>

      {/* 날짜 정보 표시 - 더 눈에 띄게 */}
      <div className="px-4 pb-3">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-blue-600 text-sm" />
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-600 font-medium">오늘의 학식</p>
                <p className="text-sm font-bold text-blue-700">{today}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs">🍽️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HansikHeader;
