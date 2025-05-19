// src/utils/api.ts
// FastAPI 백엔드와 통신하기 위한 유틸리티 함수들

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
 * 이미지를 FastAPI 백엔드로 업로드하여 분석하는 함수
 * @param imageFile 분석할 이미지 파일
 * @returns 분석 결과
 */
export async function analyzeImage(imageFile: File): Promise<CertificationAnalysisResult> {
  try {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append('file', imageFile);

    // FastAPI 백엔드 엔드포인트로 이미지 전송
    const response = await fetch(`${PYTHON_API_URL}/analyze-image`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data = await response.json();

    // 서버 응답 형식 확인 및 변환
    if (data.labels && Array.isArray(data.labels)) {
      // 라벨 정보를 기반으로 인증 타입 결정
      const certType = determineCertificationType(data.labels);

      return {
        success: true,
        certification_type: certType.type,
        carbon_reduction: certType.carbonReduction,
        points: certType.points,
        message: "이미지 분석에 성공했습니다.",
        details: {
          detected_labels: data.labels.map((label: any) => ({
            name: label.description,
            confidence: label.score
          }))
        }
      };
    }

    return data;
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
