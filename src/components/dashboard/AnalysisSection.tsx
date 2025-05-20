"use client";
import React, { useState } from 'react';

// 활동 분석 데이터 타입
interface ActivityAnalysisItem {
  category: string;
  value: number;
  icon: string;
}

// 주간 탄소중립 데이터 타입
interface WeeklyDataItem {
  day: string;
  value: number;
}

interface AnalysisSectionProps {
  activityAnalysis: ActivityAnalysisItem[];
  weeklyData: WeeklyDataItem[];
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  activityAnalysis,
  weeklyData
}) => {
  const [activeContentTab, setActiveContentTab] = useState<"recent" | "analysis">("recent");

  // 총 절감량 계산
  const totalWeeklyReduction = weeklyData.reduce((sum, item) => sum + item.value, 0).toFixed(1);

  return (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* 콘텐츠 탭 네비게이션 */}
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeContentTab === "recent" ? "text-primary border-b-2 border-primary" : "text-gray-500"
          }`}
          onClick={() => setActiveContentTab("recent")}
        >
          주간 탄소중립 추이
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeContentTab === "analysis" ? "text-primary border-b-2 border-primary" : "text-gray-500"
          }`}
          onClick={() => setActiveContentTab("analysis")}
        >
          활동 분석
        </button>
      </div>
      
      {activeContentTab === "analysis" ? (
        // 활동 분석 차트
        <div className="space-y-3">
          {activityAnalysis.map(item => (
            <div key={item.category} className="flex items-center">
              <div className="w-8 text-center mr-2">
                <span className="text-lg">{item.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{item.category}</span>
                  <span className="text-sm text-gray-500">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 주간 탄소중립 추이 - 인사이트 형식
        <div className="pt-1">
          <h3 className="text-xs font-medium text-gray-700 mb-2 text-center">지난 1주일 탄소절감 인사이트</h3>
          
          {/* 총 절감량 요약 */}
          <div className="bg-green-50 p-3 rounded-xl mb-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">총 절감량</span>
              <span className="text-lg font-bold text-primary">
                {totalWeeklyReduction}kg
              </span>
            </div>
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-xs text-gray-600">전주 대비</span>
              <span className="text-xs font-medium text-green-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9a1 1 0 01-1-1V6a1 1 0 011-1h2a1 1 0 011 1v1zm-1 4a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  <path d="M5 5a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V8a3 3 0 00-3-3H5zm-1 9v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1zm7 0v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1zm-7-4v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1zm7 0v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1z" />
                </svg>
                +15%
              </span>
            </div>
          </div>
          
          {/* 주요 인사이트 */}
          <div className="space-y-2">
            {/* 최고 활동일 */}
            <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-start">
                <div className="bg-primary bg-opacity-10 p-1.5 rounded-lg mr-2">
                  <span className="text-primary text-base">🏆</span>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-800">최고 활동일</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    <span className="font-medium">토요일</span>에 <span className="font-medium">1.8kg</span>의 탄소를 절감했어요.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 주요 활동 */}
            <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-start">
                <div className="bg-blue-50 p-1.5 rounded-lg mr-2">
                  <span className="text-blue-500 text-base">🚲</span>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-800">주요 활동</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    <span className="font-medium">대중교통 이용</span>이 전체 절감량의 <span className="font-medium">35%</span>를 차지했어요.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 개선 기회 */}
            <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-start">
                <div className="bg-yellow-50 p-1.5 rounded-lg mr-2">
                  <span className="text-yellow-500 text-base">💡</span>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-800">개선 기회</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    <span className="font-medium">수요일</span>에 활동이 가장 적었어요. 
                    평일에 텀블러 사용을 늘려보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 다음 주 목표 제안 */}
          <div className="mt-3 bg-primary bg-opacity-5 p-2 rounded-lg border border-primary border-opacity-20">
            <h4 className="text-xs font-medium text-primary mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              다음 주 목표 제안
            </h4>
            <ul className="text-xs text-gray-700 space-y-0.5">
              <li className="flex items-start">
                <span className="text-primary mr-1">•</span>
                <span>주 3회 이상 대중교통 이용하기</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-1">•</span>
                <span>텀블러 사용 횟수 20% 늘리기</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisSection;
