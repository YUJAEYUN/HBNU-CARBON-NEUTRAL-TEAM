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
    <div className="bg-primary-light rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-primary-dark mb-1 font-medium">총 절감량:</p>
          <p className="text-2xl font-bold text-primary-dark">{totalReduction}kg CO<sub>2</sub></p>
        </div>
        <div className="bg-white rounded-full p-2 shadow-sm">
          <div className="w-12 h-12 flex items-center justify-center">
            <span className="text-3xl">🌿</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-primary-dark mb-1">연속 활동</p>
          <p className="font-bold text-primary-dark">{streakDays}일</p>
        </div>
        <div>
          <p className="text-xs text-primary-dark mb-1">참여 기간</p>
          <p className="font-bold text-primary-dark">{daysSinceStart}일</p>
        </div>
        <div>
          <p className="text-xs text-primary-dark mb-1">나무 심기</p>
          <p className="font-bold text-primary-dark">{treesPlanted}그루</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
