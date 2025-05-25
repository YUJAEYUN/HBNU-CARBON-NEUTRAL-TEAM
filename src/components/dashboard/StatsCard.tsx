"use client";
import React from 'react';

interface StatsCardProps {
  totalReduction: number;
  streakDays: number;
  daysSinceStart: number;
  treesPlanted: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  totalReduction,
  streakDays,
  daysSinceStart,
  treesPlanted
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-toss-2 border border-toss-gray-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-sm text-toss-gray-600 mb-2 font-medium">총 절감량</p>
          <p className="text-3xl font-bold text-toss-green">{totalReduction}kg CO<sub>2</sub></p>
        </div>
        <div className="bg-toss-green/10 rounded-full p-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <span className="text-3xl">🌿</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-toss-gray-600 mb-1 font-medium">연속 활동</p>
          <p className="text-lg font-bold text-toss-gray-900">{streakDays}일</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-toss-gray-600 mb-1 font-medium">참여 기간</p>
          <p className="text-lg font-bold text-toss-gray-900">{daysSinceStart}일</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-toss-gray-600 mb-1 font-medium">나무 심기</p>
          <p className="text-lg font-bold text-toss-gray-900">{treesPlanted}그루</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
