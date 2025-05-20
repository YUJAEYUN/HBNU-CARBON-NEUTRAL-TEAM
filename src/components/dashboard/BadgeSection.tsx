"use client";
import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

// 뱃지 타입 정의
export interface Badge {
  id: string;
  color: string;
  icon: string;
  name: string;
  description: string;
  earned: boolean;
  category?: string;
}

// 뱃지 카테고리 타입 정의
interface BadgeCategory {
  id: string;
  name: string;
}

interface BadgeSectionProps {
  badges: Badge[];
  categories: BadgeCategory[];
}

const BadgeSection: React.FC<BadgeSectionProps> = ({ badges, categories }) => {
  const [showBadgeGuide, setShowBadgeGuide] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // 뱃지 클릭 핸들러
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
  };

  // 뱃지 가이드 창 토글 핸들러
  const toggleBadgeGuide = () => {
    setShowBadgeGuide(!showBadgeGuide);
    setSelectedBadge(null);
  };

  // 카테고리별 필터링된 뱃지
  const filteredBadges = activeCategory === "all" 
    ? badges 
    : badges.filter(badge => badge.category === activeCategory);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-primary-dark font-bold">나의 뱃지</h3>
        <button 
          className="text-primary text-sm flex items-center"
          onClick={toggleBadgeGuide}
        >
          <FaInfoCircle className="mr-1" />
          <span>뱃지 가이드</span>
        </button>
      </div>
      
      {/* 뱃지 카테고리 필터 */}
      <div className="flex overflow-x-auto pb-2 mb-3 -mx-1 hide-scrollbar">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-3 py-1 mx-1 rounded-full text-sm whitespace-nowrap ${
              activeCategory === category.id 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* 뱃지 그리드 - iOS 스타일 */}
      <div className="grid grid-cols-4 gap-2">
        {filteredBadges.map(badge => (
          <button
            key={badge.id}
            className={`p-2 rounded-lg flex flex-col items-center justify-center ${
              badge.earned ? 'opacity-100' : 'opacity-30 filter blur-[1px]'
            }`}
            style={{ backgroundColor: `${badge.color}20` }} // 20% 투명도의 배경색
            onClick={() => badge.earned && handleBadgeClick(badge)}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: badge.color }}
            >
              <span className="text-lg">{badge.icon}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* 뱃지 상세 모달 - iOS 스타일 */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 max-w-xs w-full">
            <div className="flex justify-between items-start mb-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: selectedBadge.color }}
              >
                <span className="text-2xl">{selectedBadge.icon}</span>
              </div>
              <button 
                className="text-gray-500"
                onClick={() => setSelectedBadge(null)}
              >
                ✕
              </button>
            </div>
            <h3 className="text-lg font-bold mb-2">{selectedBadge.name}</h3>
            <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs ${
                selectedBadge.earned 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {selectedBadge.earned ? '획득함' : '미획득'}
              </span>
              {selectedBadge.category && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  {selectedBadge.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 뱃지 가이드 모달 - iOS 스타일 */}
      {showBadgeGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full my-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 sticky top-0 bg-white pt-1 pb-2 z-10">
              <h3 className="text-lg font-bold">뱃지 가이드</h3>
              <button 
                className="text-gray-500"
                onClick={toggleBadgeGuide}
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              다양한 환경 보호 활동을 통해 뱃지를 수집해보세요. 각 뱃지는 특별한 활동이나 목표를 달성했을 때 획득할 수 있습니다.
            </p>
            <div className="space-y-4">
              {badges.map(badge => (
                <div key={badge.id} className="flex items-start p-3 rounded-lg" style={{ backgroundColor: `${badge.color}10` }}>
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${!badge.earned && 'opacity-50'}`}
                    style={{ backgroundColor: badge.color }}
                  >
                    <span className="text-lg">{badge.icon}</span>
                  </div>
                  <div className="flex-1">
                    {badge.earned ? (
                      <h4 className="font-medium">{badge.name}</h4>
                    ) : (
                      <h4 className="font-medium blur-[3px] select-none opacity-40">{badge.name}</h4>
                    )}
                    {badge.earned ? (
                      <p className="text-sm text-gray-600">{badge.description}</p>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600 blur-[3px] select-none opacity-40">
                          {badge.description}
                        </p>
                        <p className="text-xs text-primary mt-1 font-medium">
                          뱃지를 획득하면 설명을 볼 수 있습니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeSection;
