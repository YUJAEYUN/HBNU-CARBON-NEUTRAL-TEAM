'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// 컴포넌트 임포트
import HansikHeader from './components/HansikHeader';
import DaySelector from './components/DaySelector';
import MealCard from './components/MealCard';
import ErrorMessage from './components/ErrorMessage';
import TabMenu from './components/TabMenu';
import LoadingSpinner from './components/LoadingSpinner';

// 커스텀 훅 임포트
import useHansik from './hooks/useHansik';

// 식당 타입 정의
interface Restaurant {
  id: string;
  name: string;
  location: string;
  type: string;
  isOpen: boolean;
  operatingHours: string;
  contact: string;
}

export default function HansikPage() {
  // 커스텀 훅 사용
  const {
    mealData,
    loading,
    today,
    selectedDay,
    setSelectedDay,
    apiError,
    showMenuDetails,
    setShowMenuDetails
  } = useHansik();

  // 식당 선택 상태
  const [activeTab, setActiveTab] = useState<string>("학생식당");

  // 식당 목록 (추가 가능)
  const restaurants: Restaurant[] = [
    {
      id: "restaurant1",
      name: "학생식당",
      location: "학생회관 1층",
      type: "한식",
      isOpen: true,
      operatingHours: "평일 11:00 - 19:00",
      contact: "042-821-1485"
    },
    {
      id: "restaurant2",
      name: "교직원식당",
      location: "학생회관 3층",
      type: "한식",
      isOpen: true,
      operatingHours: "평일 11:30 - 13:30",
      contact: "042-821-1485"
    },
    {
      id: "restaurant3",
      name: "커피숍",
      location: "학생회관/국제교류관/오시온",
      type: "카페",
      isOpen: true,
      operatingHours: "평일 08:30 - 18:00",
      contact: "042-828-8954"
    },
  ];

  // 로딩 상태 표시
  if (loading) {
    return <LoadingSpinner />;
  }

  // 데이터 없음 상태 표시
  if (!mealData) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-screen p-4">
        <div className="text-5xl mb-4">😢</div>
        <p className="text-lg font-semibold text-gray-800 mb-2">학식 정보를 가져올 수 없습니다.</p>
        <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 */}
      <HansikHeader today={today} />

      {/* 식당 선택 탭 */}
      <div className="bg-white p-4">
        <div className="flex justify-between gap-3">
          {restaurants.map((restaurant) => (
            <button
              key={restaurant.id}
              className={`ios-tab text-center flex-1 ${activeTab === restaurant.name ? 'active' : ''}`}
              onClick={() => setActiveTab(restaurant.name)}
            >
              {restaurant.name}
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 식당 정보 */}
      <div className="p-4">
        {restaurants.filter(r => r.name === activeTab).map((restaurant) => (
          <motion.div
            key={restaurant.id}
            className="ios-card p-4 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RestaurantInfo
              restaurant={restaurant}
              activeTab={activeTab}
              showMenuDetails={showMenuDetails}
              setShowMenuDetails={setShowMenuDetails}
            />
          </motion.div>
        ))}
      </div>

      {/* 학식 메뉴 정보 */}
      <div className="flex-1 p-4">
        {/* API 오류 메시지 */}
        {apiError && activeTab !== "커피숍" && (
          <ErrorMessage
            message={apiError}
            description="한밭대학교 학식 정보를 가져오는 중 문제가 발생했습니다. 기본 메뉴 정보를 표시합니다."
          />
        )}

        {activeTab !== "커피숍" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">메뉴 정보</h2>
              <div className="text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">{today}</span>
              </div>
            </div>

            {/* 요일 선택 탭 */}
            <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
          </>
        )}

        {/* 단품 메뉴 구성 */}
        {showMenuDetails && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">단품 메뉴 구성</h2>
              <div className="text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">학생식당/교직원식당</span>
              </div>
            </div>

            {/* 메뉴 카테고리 탭 */}
            <TabMenu />

            <div className="mt-4 pt-2 text-xs text-gray-500">
              <p>※ 메뉴는 식자재 수급 상황에 따라 변경될 수 있습니다.</p>
              <p>※ 식당운영시간: 월~금 (토, 일, 공휴일 미운영)</p>
              <p>※ 백반단가: 5,500원 (카드, 현금 결제 가능)</p>
            </div>
          </motion.div>
        )}

        {activeTab !== "커피숍" && (
          <div className="flex flex-col space-y-4">
            {/* 중식 메뉴 */}
            <MealCard
              title="🍱 중식"
              time="11:00 ~ 14:00"
              menu={mealData.lunch}
              delay={0.1}
            />

            {/* 석식 메뉴 */}
            <MealCard
              title="🌙 석식"
              time="17:00 ~ 18:30"
              menu={mealData.dinner}
              delay={0.2}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 식당 정보 컴포넌트
interface RestaurantInfoProps {
  restaurant: Restaurant;
  activeTab: string;
  showMenuDetails: boolean;
  setShowMenuDetails: (show: boolean) => void;
}

const RestaurantInfo = ({ restaurant, activeTab, showMenuDetails, setShowMenuDetails }: RestaurantInfoProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2 border-b pb-2">
        <h3 className="text-lg font-bold text-gray-800">{restaurant.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {restaurant.isOpen ? '영업중' : '영업종료'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <span className="text-primary mr-2">위치:</span>
          <span className="text-gray-600">{restaurant.location}</span>
        </div>
        <div className="flex items-center">
          <span className="text-primary mr-2">종류:</span>
          <span className="text-gray-600">{restaurant.type}</span>
        </div>
        <div className="flex items-center">
          <span className="text-primary mr-2">운영시간:</span>
          <span className="text-gray-600">{restaurant.operatingHours}</span>
        </div>
        <div className="flex items-center">
          <span className="text-primary mr-2">연락처:</span>
          <span className="text-gray-600">{restaurant.contact}</span>
        </div>
      </div>

      {restaurant.name === "교직원식당" ? (
        <div className="mt-3 pt-2 border-t">
          <p className="text-xs text-gray-500">
            ※ 백반단가: 5,500원 (카드 결제만 가능)<br />
            ※ 중식: 11:30 ~ 13:00<br />
            ※ 석식: 교직원식당 석식 미운영(학생식당은 석식 운영)<br />
            ※ 방학기간에는 교직원식당을 운영하지 않으니, 학생식당을 이용해주시기 바랍니다.
          </p>
        </div>
      ) : restaurant.name === "학생식당" ? (
        <div className="mt-3 pt-2 border-t">
          <p className="text-xs text-gray-500">
            ※ 백반단가: 5,500원 (카드, 현금 결제 가능)<br />
            ※ 석식은 학기중에만 운영하며 방학중에는 운영하지 않습니다.<br />
            ※ 아래 메뉴는 예고없이 변동될 수 있습니다.
          </p>
        </div>
      ) : restaurant.name === "커피숍" && (
        <div className="mt-3 pt-2 border-t">
          <p className="text-xs text-gray-500 mb-2">
            ※ 브리드(학생회관) 운영시간: 8:30 ~ 17:30(학기) / 9:00 ~ 16:00(방학)<br />
            ※ 브리드(국제교류관) 운영시간: 9:00 ~ 17:00(학기) / 9:00 ~ 16:00(방학)<br />
            ※ 오시온 운영시간: 8:30 ~ 18:00(학기) / 9:00 ~ 17:00(방학)
          </p>

          {activeTab === "커피숍" && (
            <div className="mt-3">
              <button
                onClick={() => window.open("https://www.hanbat.ac.kr/kor/sub06_030303.do", "_blank")}
                className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                커피숍 메뉴 보기
              </button>
            </div>
          )}
        </div>
      )}

      {restaurant.name === "학생식당" && (
        <div className="mt-3">
          <button
            onClick={() => setShowMenuDetails(!showMenuDetails)}
            className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center"
          >
            단품메뉴구성 {showMenuDetails ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
          </button>
        </div>
      )}
    </div>
  );
};