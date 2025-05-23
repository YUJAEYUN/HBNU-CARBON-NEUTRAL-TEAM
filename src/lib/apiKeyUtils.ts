/**
 * API 키를 가져오는 유틸리티 함수
 * 
 * 1. 환경 변수에서 직접 가져오기 (서버 측)
 * 2. NEXT_PUBLIC_ 환경 변수에서 가져오기 (클라이언트 측)
 * 3. API 라우트를 통해 가져오기 (클라이언트 측, 더 안전한 방법)
 */

// API 키 캐시 (여러 번 요청하지 않도록)
let cachedApiKey: string | null = null;

/**
 * OpenAI API 키를 가져오는 함수
 * @returns API 키 문자열 또는 빈 문자열
 */
export async function getOpenAIApiKey(): Promise<string> {
  // 이미 캐시된 키가 있으면 반환
  if (cachedApiKey) {
    return cachedApiKey;
  }
  
  // 서버 측에서는 환경 변수에서 직접 가져옴
  if (typeof window === 'undefined') {
    return process.env.OPENAI_API_KEY || '';
  }
  
  // 클라이언트 측에서는 NEXT_PUBLIC_ 환경 변수 사용
  if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    cachedApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    return cachedApiKey;
  }
  
  // API 라우트를 통해 가져오기 (더 안전한 방법)
  try {
    const response = await fetch('/api/openai-key');
    if (!response.ok) {
      throw new Error('API 키를 가져오는데 실패했습니다.');
    }
    
    const data = await response.json();
    if (data.apiKey) {
      cachedApiKey = data.apiKey;
      return data.apiKey;
    }
    
    throw new Error('API 키가 응답에 포함되지 않았습니다.');
  } catch (error) {
    console.error('API 키를 가져오는 중 오류 발생:', error);
    return '';
  }
}
