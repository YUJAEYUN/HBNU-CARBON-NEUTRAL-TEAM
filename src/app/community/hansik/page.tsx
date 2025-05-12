"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCalendarAlt, FaUtensils, FaMapMarkerAlt, FaClock, FaPhone } from "react-icons/fa";

// 탭 메뉴 컴포넌트
function TabMenu() {
  const [activeTab, setActiveTab] = useState<string>("한식");

  // 메뉴 데이터
  const menuData = {
    한식: [
      { name: "해물순두부찌개", desc: "밥, 반찬 포함", price: "6,500원", color: "text-primary" },
      { name: "촌돼지김치찌개", desc: "밥, 반찬 포함", price: "6,500원", color: "text-primary" },
      { name: "부대찌개", desc: "밥, 반찬 포함", price: "6,500원", color: "text-primary" },
      { name: "제육덮밥", desc: "반찬 포함", price: "6,000원", color: "text-primary" },
      { name: "불고기덮밥", desc: "반찬 포함", price: "6,000원", color: "text-primary" },
      { name: "된장찌개", desc: "밥, 반찬 포함", price: "5,500원", color: "text-primary" }
    ],
    양식: [
      { name: "등심돈가스+알밥", desc: "반찬 포함", price: "6,500원", color: "text-blue-600" },
      { name: "치즈돈까스+우동", desc: "반찬 포함", price: "7,000원", color: "text-blue-600" },
      { name: "치킨마요덮밥", desc: "반찬 포함", price: "6,000원", color: "text-blue-600" },
      { name: "해장라면+공깃밥", desc: "반찬 포함", price: "5,000원", color: "text-blue-600" },
      { name: "함박스테이크", desc: "밥, 반찬 포함", price: "7,500원", color: "text-blue-600" },
      { name: "오므라이스", desc: "반찬 포함", price: "6,000원", color: "text-blue-600" }
    ],
    분식: [
      { name: "김치볶음밥", desc: "반찬 포함", price: "5,500원", color: "text-green-600" },
      { name: "떡볶이", desc: "단품", price: "4,000원", color: "text-green-600" },
      { name: "라볶이", desc: "단품", price: "5,000원", color: "text-green-600" },
      { name: "김밥", desc: "단품", price: "3,500원", color: "text-green-600" }
    ]
  };

  return (
    <div>
      {/* 탭 버튼 */}
      <div className="flex border-b mb-4">
        {Object.keys(menuData).map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} 메뉴
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <motion.div
        key={activeTab}
        className="ios-card p-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className={`text-lg font-bold mb-4 border-b pb-2 ${
          activeTab === "한식" ? "text-primary" :
          activeTab === "양식" ? "text-blue-600" : "text-green-600"
        }`}>
          {activeTab} 메뉴
        </h2>

        <div className="space-y-4">
          {menuData[activeTab as keyof typeof menuData].map((item, index) => (
            <div
              key={index}
              className={`flex justify-between items-center py-2 ${
                index < menuData[activeTab as keyof typeof menuData].length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <p className={`font-bold ${item.color}`}>{item.price}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

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
  const router = useRouter();
  const [mealData, setMealData] = useState<{ date: string; lunch: string; dinner: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [today, setToday] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("학생식당");
  const [showMenuDetails, setShowMenuDetails] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("mon");

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

  // 요일에 따른 날짜 문자열 반환 함수
  const getDateStringByDay = (day: string): string => {
    switch (day) {
      case 'mon':
        return "2025년 5월 12일 월요일";
      case 'tue':
        return "2025년 5월 13일 화요일";
      case 'wed':
        return "2025년 5월 14일 수요일";
      case 'thu':
        return "2025년 5월 15일 목요일";
      case 'fri':
        return "2025년 5월 16일 금요일";
      default:
        return "2025년 5월 12일 월요일";
    }
  };

  useEffect(() => {
    async function fetchMeals() {
      try {
        setLoading(true);
        setApiError(null);

        // 선택된 요일에 따른 날짜 설정
        const dateStr = getDateStringByDay(selectedDay);
        setToday(dateStr);

        // API 호출 (요일 파라미터 포함)
        console.log(`학식 API 호출 중... (요일: ${selectedDay})`);
        const response = await fetch(`/api/hansik?day=${selectedDay}`);

        if (!response.ok) {
          throw new Error(`API 응답 오류: ${response.status}`);
        }

        const data = await response.json();
        console.log("API 응답 데이터:", data);

        // 오류 응답 처리
        if (data.error) {
          throw new Error(data.error);
        }

        setMealData(data);
      } catch (error) {
        console.error("학식 정보를 가져오는 중 오류 발생:", error);
        setApiError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");

        // 오류 발생 시 기본 데이터 설정
        setMealData({
          date: getDateStringByDay(selectedDay),
          lunch: "학식 정보를 가져올 수 없습니다.",
          dinner: "학식 정보를 가져올 수 없습니다."
        });
      } finally {
        setLoading(false);
      }
    }

    fetchMeals();
  }, [selectedDay]); // selectedDay가 변경될 때마다 API 호출

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
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
      {/* 상단 헤더 - iOS 스타일 */}
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
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2 border-b pb-2">
                <h3 className="text-lg font-bold text-gray-800">{restaurant.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {restaurant.isOpen ? '영업중' : '영업종료'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-primary mr-2" />
                  <span className="text-gray-600">{restaurant.location}</span>
                </div>
                <div className="flex items-center">
                  <FaUtensils className="text-primary mr-2" />
                  <span className="text-gray-600">{restaurant.type}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-primary mr-2" />
                  <span className="text-gray-600">{restaurant.operatingHours}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-primary mr-2" />
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
                    className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    단품메뉴구성 {showMenuDetails ? '접기' : '보기'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 학식 메뉴 정보 */}
      <div className="flex-1 p-4">
        {/* API 오류 메시지 */}
        {apiError && activeTab !== "커피숍" && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">
              <span className="mr-2">⚠️</span>
              {apiError}
            </p>
            <p className="text-red-500 text-xs mt-1">
              한밭대학교 학식 정보를 가져오는 중 문제가 발생했습니다. 기본 메뉴 정보를 표시합니다.
            </p>
          </div>
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
            <div className="mb-4 border rounded-lg overflow-hidden">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-2 px-3 text-center ${selectedDay === 'mon' ? 'bg-primary text-white' : 'bg-gray-50'}`}
                  onClick={() => setSelectedDay('mon')}
                >
                  <div className="font-bold">월</div>
                  <div className="text-xs">2025-05-12</div>
                </button>
                <button
                  className={`flex-1 py-2 px-3 text-center ${selectedDay === 'tue' ? 'bg-primary text-white' : 'bg-gray-50'}`}
                  onClick={() => setSelectedDay('tue')}
                >
                  <div className="font-bold">화</div>
                  <div className="text-xs">2025-05-13</div>
                </button>
                <button
                  className={`flex-1 py-2 px-3 text-center ${selectedDay === 'wed' ? 'bg-primary text-white' : 'bg-gray-50'}`}
                  onClick={() => setSelectedDay('wed')}
                >
                  <div className="font-bold">수</div>
                  <div className="text-xs">2025-05-14</div>
                </button>
                <button
                  className={`flex-1 py-2 px-3 text-center ${selectedDay === 'thu' ? 'bg-primary text-white' : 'bg-gray-50'}`}
                  onClick={() => setSelectedDay('thu')}
                >
                  <div className="font-bold">목</div>
                  <div className="text-xs">2025-05-15</div>
                </button>
                <button
                  className={`flex-1 py-2 px-3 text-center ${selectedDay === 'fri' ? 'bg-primary text-white' : 'bg-gray-50'}`}
                  onClick={() => setSelectedDay('fri')}
                >
                  <div className="font-bold">금</div>
                  <div className="text-xs">2025-05-16</div>
                </button>
              </div>
            </div>
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
            <motion.div
              className="ios-card overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="bg-primary text-white p-3">
                <h2 className="text-lg font-bold">🍱 중식 (11:00 ~ 14:00)</h2>
              </div>
              <div className="p-4">
                {mealData && mealData.lunch ? (
                  <div className="space-y-2">
                    {mealData.lunch.split("\n").map((item, index) => (
                      <div key={index} className="flex items-start py-2 border-b border-gray-100 last:border-0">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-gray-800">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    오늘은 중식 정보가 없습니다.
                  </div>
                )}
              </div>
            </motion.div>

            {/* 석식 메뉴 */}
            <motion.div
              className="ios-card overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="bg-blue-600 text-white p-3">
                <h2 className="text-lg font-bold">🌙 석식 (17:00 ~ 18:30)</h2>
              </div>
              <div className="p-4">
                {mealData && mealData.dinner ? (
                  <div className="space-y-2">
                    {mealData.dinner.split("\n").map((item, index) => (
                      <div key={index} className="flex items-start py-2 border-b border-gray-100 last:border-0">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-800">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    오늘은 석식 정보가 없습니다.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
