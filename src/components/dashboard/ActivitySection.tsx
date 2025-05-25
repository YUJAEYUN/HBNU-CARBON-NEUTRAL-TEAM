"use client";
import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import AnalysisSection from './AnalysisSection';
import BadgeSection from './BadgeSection';
import { Badge } from './BadgeSection';

interface ActivitySectionProps {
  user: any;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ user }) => {
  const [streakDays, setStreakDays] = useState(0);
  const [daysSinceStart, setDaysSinceStart] = useState(0);

  // 기본 뱃지 데이터
  const badges: Badge[] = [
    { id: 'first', color: "#4CAF50", icon: "🌱", name: "첫 발자국", description: "첫 번째 탄소 절감 활동을 완료했어요", earned: true },
    { id: 'streak', color: "#2196F3", icon: "🔥", name: "연속 활동", description: "7일 연속으로 활동을 기록했어요", earned: true },
    { id: 'transport', color: "#FF9800", icon: "🚲", name: "교통 마스터", description: "대중교통 이용으로 탄소 배출을 줄였어요", earned: true },
    { id: 'energy', color: "#9C27B0", icon: "💡", name: "에너지 절약", description: "에너지 절약 활동을 10회 이상 기록했어요", earned: false },
    { id: 'recycle', color: "#00BCD4", icon: "♻️", name: "재활용 달인", description: "재활용 활동을 20회 이상 기록했어요", earned: false, category: "생활" },
    { id: 'vegan', color: "#8BC34A", icon: "🥗", name: "채식 실천", description: "채식 식단을 5회 이상 기록했어요", earned: false, category: "소비" },
    { id: 'carpool', color: "#3F51B5", icon: "🚗", name: "카풀 마스터", description: "카풀 이용으로 탄소 배출을 줄였어요", earned: false, category: "교통" },
    { id: 'solar', color: "#FFC107", icon: "☀️", name: "태양광 지지자", description: "재생 에너지 사용을 실천했어요", earned: false, category: "에너지" },
  ];

  // 뱃지 카테고리
  const badgeCategories = [
    { id: "all", name: "전체" },
    { id: "생활", name: "생활" },
    { id: "소비", name: "소비" },
    { id: "교통", name: "교통" },
    { id: "에너지", name: "에너지" },
  ];

  // 활동 분석 데이터
  const activityAnalysis = [
    { category: "대중교통 이용", value: 35, icon: "🚆" },
    { category: "에너지 절약", value: 25, icon: "💡" },
    { category: "재활용", value: 20, icon: "♻️" },
    { category: "친환경 소비", value: 15, icon: "🛒" },
    { category: "기타", value: 5, icon: "📊" },
  ];

  // 주간 탄소중립 데이터
  const weeklyData = [
    { day: "월", value: 0.8 },
    { day: "화", value: 1.2 },
    { day: "수", value: 0.5 },
    { day: "목", value: 1.5 },
    { day: "금", value: 0.9 },
    { day: "토", value: 1.8 },
    { day: "일", value: 0.7 },
  ];

  // 컴포넌트 마운트 시 데이터 계산
  useEffect(() => {
    // 연속 활동일 계산
    const randomStreak = Math.floor(Math.random() * 20) + 5; // 5~24일 사이의 랜덤 값
    setStreakDays(randomStreak);

    // 참여 시작일 이후 경과일 계산 - 100일로 고정
    setDaysSinceStart(100);
  }, []);

  return (
    <div className="px-5 py-4 pb-16 overflow-y-auto h-full">
      {/* 통계 카드 */}
      <StatsCard
        totalReduction={22.8}
        streakDays={streakDays}
        daysSinceStart={daysSinceStart}
        treesPlanted={2}
      />

      {/* 분석 섹션 */}
      <AnalysisSection
        activityAnalysis={activityAnalysis}
        weeklyData={weeklyData}
      />

      {/* 뱃지 섹션 */}
      <BadgeSection
        badges={badges}
        categories={badgeCategories}
      />
    </div>
  );
};

export default ActivitySection;
