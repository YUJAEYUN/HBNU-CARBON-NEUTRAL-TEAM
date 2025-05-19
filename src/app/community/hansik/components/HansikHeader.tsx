'use client';

import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';

interface HansikHeaderProps {
  today: string;
}

const HansikHeader = ({ today }: HansikHeaderProps) => {
  const router = useRouter();

  return (
    <div className="ios-header sticky top-0 z-10">
      <div className="flex items-center">
        <button
          className="text-gray-500 mr-2"
          onClick={() => router.push("/")}
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">한밭대 학식</h1>
      </div>
      <div className="flex items-center">
        <div className="text-sm text-gray-500 flex items-center">
          <FaCalendarAlt className="mr-1" />
          <span>{today}</span>
        </div>
      </div>
    </div>
  );
};

export default HansikHeader;
