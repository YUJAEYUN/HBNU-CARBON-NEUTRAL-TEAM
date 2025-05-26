// src/utils/api.ts
// FastAPI 백엔드와 통신하기 위한 유틸리티 함수들

import { CreateCertificationRequest, CreateCertificationResponse, CertificationType, CERTIFICATION_TYPE_INFO } from '@/types/certification';

// API 기본 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// 파이썬 백엔드 API URL
const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';

// 재질 타입 정의
export type MaterialType = 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic' | 'other';

// 재활용 가능 재질 정보
export interface RecyclableMaterial {
  type: MaterialType;
  confidence: number;
  bin_color: string;
  items: string[];
  preparation_steps: string[];
}

// 재활용 불가능 재질 정보
export interface NonRecyclableMaterial {
  type: MaterialType;
  confidence: number;
  bin_color: string;
  items: string[];
  preparation_steps: string[];
}

// 복합 재질 정보
export interface CompositeMaterial {
  description: string;
  materials: MaterialType[];
  separation_method: string;
  steps: string[];
}

// 재활용 분석 추천 정보
export interface RecyclingRecommendations {
  general_instructions: string;
  recyclable_materials: RecyclableMaterial[];
  non_recyclable_materials: NonRecyclableMaterial[];
  composite_materials: CompositeMaterial[];
  detailed_steps: string[];
}

// 재활용 분석 결과
export interface RecyclingAnalysis {
  overall_recyclability: number;
  recommendations: RecyclingRecommendations;
}

// 감지된 라벨 정보
export interface DetectedLabel {
  name: string;
  confidence: number;
  category?: string;
}

// 감지된 객체 정보
export interface DetectedObject {
  name: string;
  confidence: number;
  bounding_box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// 인증 분석 결과
export interface CertificationAnalysisResult {
  success: boolean;
  certification_type?: string;
  certification_id?: string;
  carbon_reduction?: number;
  points?: number;
  message?: string;
  details?: {
    recycling_analysis?: RecyclingAnalysis;
    detected_labels?: DetectedLabel[];
    detected_objects?: DetectedObject[];
  };
}

/**
 * 이미지를 분석하는 함수 (데모 버전)
 * @param imageFile 분석할 이미지 파일
 * @returns 분석 결과
 */
export async function analyzeImage(imageFile: File): Promise<CertificationAnalysisResult> {
  try {
    // 데모 버전에서는 실제 이미지 분석 대신 성공 응답 반환
    // 실제 구현에서는 백엔드 API 호출로 대체

    // 이미지 파일 크기 확인 (최소 유효성 검사)
    if (imageFile.size === 0) {
      throw new Error('유효하지 않은 이미지 파일입니다.');
    }

    // 이미지 타입 확인
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다.');
    }

    // 이미지 처리 시간을 시뮬레이션하기 위한 지연
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      message: "이미지가 성공적으로 분석되었습니다.",
      // 실제 분석 결과는 사용하지 않고 선택한 카테고리 정보를 사용할 예정
    };
  } catch (error) {
    console.error('이미지 분석 오류:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '이미지 분석 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 인증 목록을 가져오는 함수
 * @param userId 사용자 ID
 * @returns 인증 목록
 */
export async function getCertifications(userId: string) {
  try {
    const response = await fetch(`${PYTHON_API_URL}/certifications?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('인증 목록 가져오기 오류:', error);
    throw error;
  }
}

/**
 * 한국어 재질 이름 반환 함수
 * @param materialType 재질 타입
 * @returns 한국어 재질 이름
 */
export function getKoreanMaterialName(materialType: MaterialType): string {
  const materialNames: Record<MaterialType, string> = {
    'plastic': '플라스틱',
    'paper': '종이',
    'glass': '유리',
    'metal': '금속',
    'organic': '유기물',
    'electronic': '전자제품',
    'other': '기타'
  };

  return materialNames[materialType] || '알 수 없음';
}

/**
 * 분리수거함 색상 코드 반환 함수
 * @param binColor 분리수거함 색상 이름
 * @returns 색상 코드
 */
export function getBinColor(binColor: string): string {
  const colorMap: Record<string, string> = {
    '파란색': '#1E88E5',
    '빨간색': '#E53935',
    '초록색': '#43A047',
    '노란색': '#FDD835',
    '회색': '#757575',
    '흰색': '#FFFFFF',
    '검은색': '#212121',
    '일반쓰레기': '#757575',
    '종량제': '#757575'
  };

  return colorMap[binColor] || '#9E9E9E';
}

/**
 * 이미지 라벨을 기반으로 인증 타입 결정 함수
 * @param labels 이미지 분석 라벨 배열
 * @returns 인증 타입 정보
 */
function determineCertificationType(labels: any[]): { type: string; carbonReduction: number; points: number } {
  // 라벨 설명을 소문자로 변환하여 배열로 만듦
  const labelDescriptions = labels.map(label => label.description.toLowerCase());

  // 텀블러 관련 키워드
  if (labelDescriptions.some(desc =>
    desc.includes('tumbler') ||
    desc.includes('cup') ||
    desc.includes('mug') ||
    desc.includes('coffee') && (desc.includes('reusable') || desc.includes('cup'))
  )) {
    return { type: 'tumbler', carbonReduction: 0.12, points: 15 };
  }

  // 다회용기 관련 키워드
  if (labelDescriptions.some(desc =>
    desc.includes('container') ||
    desc.includes('lunchbox') ||
    desc.includes('reusable') && desc.includes('container')
  )) {
    return { type: 'container', carbonReduction: 0.25, points: 20 };
  }

  // 전자영수증 관련 키워드
  if (labelDescriptions.some(desc =>
    desc.includes('receipt') ||
    desc.includes('invoice') ||
    desc.includes('bill')
  )) {
    return { type: 'receipt', carbonReduction: 0.05, points: 10 };
  }

  // 리필스테이션 관련 키워드
  if (labelDescriptions.some(desc =>
    desc.includes('refill') ||
    desc.includes('station') ||
    desc.includes('dispenser')
  )) {
    return { type: 'refill', carbonReduction: 0.18, points: 18 };
  }

  // 플라스틱 관련 키워드 (물병 등)
  if (labelDescriptions.some(desc =>
    desc.includes('bottle') ||
    desc.includes('plastic') ||
    desc.includes('water bottle')
  )) {
    return { type: 'container', carbonReduction: 0.20, points: 18 };
  }

  // 기본값 (기타)
  return { type: 'other', carbonReduction: 0.10, points: 10 };
}

/**
 * 사용자 이미지 목록 조회 함수
 * @param userId 사용자 ID
 * @param limit 조회할 이미지 개수 (기본값: 10)
 * @returns 사용자 이미지 목록
 */
export async function getUserImages(userId: string, limit: number = 10) {
  try {
    const response = await fetch(`${PYTHON_API_URL}/images/user/${userId}?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('사용자 이미지 목록 조회 오류:', error);
    throw error;
  }
}

/**
 * 이미지 상세 정보 조회 함수
 * @param imageId 이미지 ID
 * @returns 이미지 상세 정보
 */
export async function getImageInfo(imageId: string) {
  try {
    const response = await fetch(`${PYTHON_API_URL}/images/${imageId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('이미지 상세 정보 조회 오류:', error);
    throw error;
  }
}

/**
 * 이미지 URL 생성 함수
 * @param imageId 이미지 ID
 * @returns 이미지 URL
 */
export function getImageUrl(imageId: string): string {
  return `${PYTHON_API_URL}/images/${imageId}/data`;
}

/**
 * 이미지 분석 및 저장 함수
 * @param imageFile 이미지 파일
 * @param userId 사용자 ID (선택 사항)
 * @param category 카테고리 (기본값: 'recycling')
 * @returns 분석 및 저장 결과
 */
export async function analyzeAndSaveImage(imageFile: File, userId?: string, category: string = 'recycling') {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (userId) {
      formData.append('user_id', userId);
    }
    formData.append('category', category);

    const response = await fetch(`${PYTHON_API_URL}/analyze-and-save/`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('이미지 분석 및 저장 오류:', error);
    throw error;
  }
}

/**
 * 인증 추가 함수
 *
 * @param certificationData 인증 데이터
 * @param userId 사용자 ID (선택 사항)
 * @returns 인증 추가 결과
 */
export async function createCertification(
  certificationData: CreateCertificationRequest,
  userId?: string
): Promise<CreateCertificationResponse> {
  try {
    // 현재 날짜와 시간 생성
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

    // 인증 유형에 따른 탄소 절감량과 포인트 계산
    const typeInfo = CERTIFICATION_TYPE_INFO[certificationData.type];
    const carbonReduction = typeInfo.carbonReduction;
    const points = typeInfo.points;

    // 로컬 데모 기능을 위한 모의 응답
    // 실제 구현에서는 API 호출로 대체
    return {
      success: true,
      certification: {
        id: Date.now(), // 임시 ID
        type: certificationData.type,
        title: certificationData.title,
        description: certificationData.description,
        date,
        time,
        timeAgo: '방금 전',
        location: certificationData.location,
        carbonReduction,
        verified: true,
        status: '인증됨',
        points,
        userId: userId || 'demo-user'
      },
      message: '인증이 성공적으로 등록되었습니다.'
    };

    // 실제 API 호출 코드 (백엔드 구현 시 주석 해제)
    /*
    const response = await fetch(`${API_BASE_URL}/certifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        ...certificationData,
        userId: userId || 'demo-user',
        date,
        time
      }),
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    return await response.json();
    */
  } catch (error) {
    console.error('인증 추가 오류:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '인증 추가 중 오류가 발생했습니다.'
    };
  }
}
