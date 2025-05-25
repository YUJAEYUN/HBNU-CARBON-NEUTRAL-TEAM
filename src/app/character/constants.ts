// 캐릭터 성장 단계 정보
export const CHARACTER_STAGES = [
  { 
    level: 1, 
    name: "새싹", 
    description: "탄소중립 여정의 시작", 
    requiredPoints: 0,
    image: "🌱" // 새싹 이모지
  },
  { 
    level: 2, 
    name: "어린 대나무", 
    description: "성장 중인 대나무", 
    requiredPoints: 50,
    image: "🎋" // 어린 대나무 이모지
  },
  { 
    level: 3, 
    name: "튼튼한 대나무", 
    description: "건강하게 자란 대나무", 
    requiredPoints: 150,
    image: "🌿" // 튼튼한 대나무 이모지
  },
  { 
    level: 4, 
    name: "대나무 숲", 
    description: "주변에 영향을 주는 대나무", 
    requiredPoints: 300,
    image: "🌲" // 대나무 숲 이모지
  },
  { 
    level: 5, 
    name: "대나무 마스터", 
    description: "탄소중립의 상징", 
    requiredPoints: 500,
    image: "🌳" // 대나무 마스터 이모지
  },
];

// 활동 결과 목업 데이터
export const ACTIVITY_DATA = {
  daily: {
    title: "오늘의 활동 결과",
    items: [
      { label: "도보 이용", value: "0.4kg" },
      { label: "텀블러 사용", value: "0.3kg" },
      { label: "전자영수증", value: "0.1kg" }
    ],
    total: "0.8kg CO₂"
  },
  weekly: {
    title: "이번 주 활동 결과",
    items: [
      { label: "도보 이용", value: "10kg" },
      { label: "텀블러 사용", value: "5kg" },
      { label: "전자영수증", value: "0.8kg" }
    ],
    total: "15.8kg CO₂"
  },
  monthly: {
    title: "이번 달 활동 결과",
    items: [
      { label: "도보 이용", value: "25.5kg" },
      { label: "텀블러 사용", value: "12.3kg" },
      { label: "전자영수증", value: "3.2kg" },
      { label: "다회용기", value: "8.7kg" }
    ],
    total: "49.7kg CO₂"
  }
};

// 활동 탭 타입 정의
export type ActivityTabType = "daily" | "weekly" | "monthly";

// 캐릭터 단계 타입 정의
export interface CharacterStage {
  level: number;
  name: string;
  description: string;
  requiredPoints: number;
  image: string;
}

// 활동 항목 타입 정의
export interface ActivityItem {
  label: string;
  value: string;
}

// 활동 데이터 타입 정의
export interface ActivityData {
  title: string;
  items: ActivityItem[];
  total: string;
}

// 활동 데이터 맵 타입 정의
export interface ActivityDataMap {
  [key: string]: ActivityData;
}
