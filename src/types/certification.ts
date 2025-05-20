// src/types/certification.ts

// 인증 유형 정의
export type CertificationType = 
  | "tumbler" 
  | "container" 
  | "receipt" 
  | "email" 
  | "refill" 
  | "recycle" 
  | "other";

// 인증 정보 인터페이스
export interface Certification {
  id: number | string;
  type: CertificationType;
  title: string;
  description?: string;
  date: string;
  time: string;
  timeAgo: string;
  location: string;
  carbonReduction: number;
  verified: boolean;
  status?: string;
  points: number;
  image?: string;
  userId?: string;
}

// 인증 유형 정보 인터페이스
export interface CertificationTypeInfo {
  id: CertificationType;
  label: string;
  icon: string;
  color: string;
  carbonReduction: number;
  points: number;
  description?: string;
}

// 인증 생성 요청 인터페이스
export interface CreateCertificationRequest {
  title: string;
  description?: string;
  type: CertificationType;
  location: string;
  userId?: string;
}

// 인증 생성 응답 인터페이스
export interface CreateCertificationResponse {
  success: boolean;
  certification?: Certification;
  message?: string;
}

// 인증 유형별 탄소 절감량 및 포인트 정보
export const CERTIFICATION_TYPE_INFO: Record<CertificationType, CertificationTypeInfo> = {
  "tumbler": {
    id: "tumbler",
    label: "텀블러",
    icon: "☕",
    color: "#D7CCC8",
    carbonReduction: 0.12,
    points: 15,
    description: "일회용 컵 대신 텀블러를 사용하여 탄소 배출을 줄입니다."
  },
  "container": {
    id: "container",
    label: "다회용기",
    icon: "🥡",
    color: "#FFECB3",
    carbonReduction: 0.25,
    points: 20,
    description: "일회용 용기 대신 다회용기를 사용하여 탄소 배출을 줄입니다."
  },
  "receipt": {
    id: "receipt",
    label: "전자영수증",
    icon: "🧾",
    color: "#C8E6C9",
    carbonReduction: 0.05,
    points: 10,
    description: "종이 영수증 대신 전자영수증을 사용하여 종이 낭비를 줄입니다."
  },
  "email": {
    id: "email",
    label: "이메일지우기",
    icon: "📧",
    color: "#CFD8DC",
    carbonReduction: 0.03,
    points: 8,
    description: "불필요한 이메일을 정리하여 서버 에너지 사용을 줄입니다."
  },
  "refill": {
    id: "refill",
    label: "리필스테이션",
    icon: "🔄",
    color: "#B3E5FC",
    carbonReduction: 0.18,
    points: 18,
    description: "리필스테이션을 이용하여 새 용기 생산에 따른 탄소 배출을 줄입니다."
  },
  "recycle": {
    id: "recycle",
    label: "전기전자폐기",
    icon: "♻️",
    color: "#DCEDC8",
    carbonReduction: 0.35,
    points: 25,
    description: "전자제품을 올바르게 폐기하여 환경 오염을 방지합니다."
  },
  "other": {
    id: "other",
    label: "기타",
    icon: "🔍",
    color: "#D3D3D3",
    carbonReduction: 0.10,
    points: 10,
    description: "기타 탄소중립 활동"
  }
};
