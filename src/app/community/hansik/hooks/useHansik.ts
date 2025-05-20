'use client';

import { useState, useEffect } from 'react';
import { hansikApi } from '@/utils/apiUtils';

interface MealData {
  date: string;
  formattedDate?: string;
  lunch: string;
  dinner: string;
  dayOfWeek: string;
  cached?: boolean;
}

export const useHansik = () => {
  const [mealData, setMealData] = useState<MealData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [today, setToday] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("mon");
  const [apiError, setApiError] = useState<string | null>(null);
  const [showMenuDetails, setShowMenuDetails] = useState<boolean>(false);

  // 요일에 따른 날짜 문자열 생성
  const getDateStringByDay = (day: string): string => {
    const today = new Date();
    const currentDay = today.getDay(); // 0: 일요일, 1: 월요일, ...
    let targetDay: number;
    let dayName: string;

    switch (day) {
      case 'mon':
        targetDay = 1;
        dayName = '월요일';
        break;
      case 'tue':
        targetDay = 2;
        dayName = '화요일';
        break;
      case 'wed':
        targetDay = 3;
        dayName = '수요일';
        break;
      case 'thu':
        targetDay = 4;
        dayName = '목요일';
        break;
      case 'fri':
        targetDay = 5;
        dayName = '금요일';
        break;
      default:
        targetDay = currentDay;
        dayName = '오늘';
    }

    // 날짜 계산
    const diff = targetDay - currentDay;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    // 날짜 포맷팅
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const date = String(targetDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${date} (${dayName})`;
  };

  // 학식 데이터 가져오기
  const fetchMeals = async () => {
    try {
      setLoading(true);
      setApiError(null);

      // 선택된 요일에 따른 날짜 설정
      const dateStr = getDateStringByDay(selectedDay);
      setToday(dateStr);

      // API 호출
      console.log(`학식 API 호출 중... (요일: ${selectedDay})`);
      const data = await hansikApi.getMenu(selectedDay);

      setMealData(data);
    } catch (error) {
      console.error("학식 정보를 가져오는 중 오류 발생:", error);
      setApiError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");

      // 오류 발생 시 기본 데이터 설정
      setMealData({
        date: getDateStringByDay(selectedDay),
        lunch: "학식 정보를 가져올 수 없습니다.",
        dinner: "학식 정보를 가져올 수 없습니다.",
        dayOfWeek: selectedDay === 'today' ? '오늘' : 
                  selectedDay === 'mon' ? '월요일' : 
                  selectedDay === 'tue' ? '화요일' : 
                  selectedDay === 'wed' ? '수요일' : 
                  selectedDay === 'thu' ? '목요일' : 
                  selectedDay === 'fri' ? '금요일' : '오늘'
      });
    } finally {
      setLoading(false);
    }
  };

  // 선택된 요일이 변경될 때마다 학식 데이터 가져오기
  useEffect(() => {
    fetchMeals();
  }, [selectedDay]);

  return {
    mealData,
    loading,
    today,
    selectedDay,
    setSelectedDay,
    apiError,
    showMenuDetails,
    setShowMenuDetails,
    fetchMeals
  };
};

export default useHansik;
