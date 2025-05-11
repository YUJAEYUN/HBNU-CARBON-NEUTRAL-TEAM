// 캐릭터 성장 단계 정보
export const CHARACTER_STAGES = [
  { level: 1, name: "새싹", description: "탄소중립 여정의 시작", requiredPoints: 0 },
  { level: 2, name: "어린 대나무", description: "성장 중인 대나무", requiredPoints: 50 },
  { level: 3, name: "튼튼한 대나무", description: "건강하게 자란 대나무", requiredPoints: 150 },
  { level: 4, name: "대나무 숲", description: "주변에 영향을 주는 대나무", requiredPoints: 300 },
  { level: 5, name: "대나무 마스터", description: "탄소중립의 상징", requiredPoints: 500 },
];

// 활동 결과 데이터
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