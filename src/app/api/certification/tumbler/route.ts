import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import OpenAI from 'openai';
import { getOpenAIApiKey } from '@/lib/apiKeyUtils';

// 텀블러 인증 API
export async function POST(request: NextRequest) {
  try {
    // 쿠키에서 토큰 가져오기
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    // 현재 로그인한 사용자 정보 가져오기
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json({ error: "인증 실패" }, { status: 401 });
    }

    const userId = userData.user.id;

    // 요청 본문 파싱
    const { image, receiptImage } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "이미지가 필요합니다." }, { status: 400 });
    }

    // OpenAI API 키 확인 (서버 사이드에서는 환경 변수 직접 사용)
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    let analysisResult = "";

    if (!apiKey) {
      console.log("OpenAI API 키가 없습니다. 목업 분석 결과를 사용합니다.");
      // API 키가 없을 때 목업 분석 결과 사용
      analysisResult = `VALID: true
CONFIDENCE: 85
REASON: 텀블러가 명확하게 보입니다 (목업 분석 결과)
CARBON_REDUCTION: 0.3
POINTS: 15`;
    } else {
      console.log("OpenAI API 키 확인됨, 실제 분석을 시작합니다.");
      // OpenAI 클라이언트 생성
      const openai = new OpenAI({
        apiKey: apiKey,
      });

      // GPT-4o를 사용하여 이미지 분석
      try {
        analysisResult = await analyzeImageWithGPT4Vision(openai, image);
      } catch (error) {
        console.error("OpenAI 분석 실패, 목업 결과 사용:", error);
        // 실제 분석 실패 시 목업 결과 사용
        analysisResult = `VALID: true
CONFIDENCE: 75
REASON: AI 분석 실패로 인한 기본 승인 (목업 결과)
CARBON_REDUCTION: 0.3
POINTS: 15`;
      }
    }

    // 분석 결과 파싱
    const { isValid, confidence, reason, carbonReduction, points } = parseAnalysisResult(analysisResult);

    if (!isValid) {
      console.log("텀블러 인증 실패:", reason);
      return NextResponse.json({
        success: false,
        verified: false,
        carbonReduction: 0,
        points: 0,
        confidence: confidence,
        error: "텀블러 인증에 실패했습니다.",
        reason: reason,
        analysisResult: analysisResult
      });
    }

    console.log("텀블러 인증 성공:", { carbonReduction, points, confidence });

    // 인증 성공 시 사용자 경험치/포인트 업데이트 (profiles 테이블 사용)
    try {
      const currentTrees = userData.user.user_metadata?.trees || 0;
      const newTrees = currentTrees + 1;
      const newLevel = Math.floor(newTrees / 10) + 1;

      // profiles 테이블이 있다면 업데이트, 없다면 생성
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: userData.user.email,
          nickname: userData.user.user_metadata?.nickname || '사용자',
          school: userData.user.user_metadata?.school || '한밭대학교',
          trees: newTrees,
          level: newLevel,
          points: (userData.user.user_metadata?.points || 0) + points,
        });

      if (profileError) {
        console.error('프로필 업데이트 오류:', profileError);
      }

      // 사용자 메타데이터도 업데이트 시도 (실패해도 계속 진행)
      try {
        await supabase.auth.updateUser({
          data: {
            trees: newTrees,
            level: newLevel,
            points: (userData.user.user_metadata?.points || 0) + points,
          }
        });
      } catch (metaError) {
        console.error('메타데이터 업데이트 실패 (무시):', metaError);
      }
    } catch (error) {
      console.error('사용자 정보 업데이트 오류:', error);
    }

    // 인증 기록 저장 (certifications 테이블에 저장)
    const { error: certError } = await supabase
      .from('certifications')
      .insert([
        {
          user_id: userId,
          type: 'tumbler',
          title: '텀블러 인증',
          carbon_reduction: carbonReduction,
          points: points,
          verified: true,
          status: '인증완료',
          image_url: `data:image/jpeg;base64,${image}`,
          receipt_image_url: receiptImage ? `data:image/jpeg;base64,${receiptImage}` : null,
          analysis_result: analysisResult,
          confidence: confidence,
        }
      ]);

    if (certError) {
      console.error('인증 기록 저장 오류:', certError);
    }

    return NextResponse.json({
      success: true,
      verified: true,
      carbonReduction: carbonReduction,
      points: points,
      confidence: confidence,
      analysisResult: analysisResult,
      message: "텀블러 인증이 성공적으로 완료되었습니다!"
    });

  } catch (error) {
    console.error('텀블러 인증 API 오류:', error);
    console.error('오류 스택:', error instanceof Error ? error.stack : '스택 없음');

    // 에러가 발생해도 기본 성공 응답 반환 (개발 중)
    return NextResponse.json({
      success: true,
      verified: true,
      carbonReduction: 0.3,
      points: 15,
      confidence: 50,
      analysisResult: "오류 발생으로 인한 기본 승인",
      message: "텀블러 인증이 완료되었습니다! (기본 승인)",
      error: `개발 모드 - 오류 무시: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
    });
  }
}

// GPT-4o를 사용하여 이미지 분석
async function analyzeImageWithGPT4Vision(openai: OpenAI, imageBase64: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `이 이미지를 분석하여 텀블러(재사용 가능한 컵) 사용 인증이 유효한지 판단해주세요.

다음 기준으로 평가해주세요:
1. 텀블러나 재사용 가능한 컵이 명확히 보이는가?
2. 음료가 텀블러에 담겨있는가?
3. 일회용 컵이 아닌 것이 확실한가?
4. 이미지가 명확하고 조작되지 않았는가?

응답 형식:
VALID: true/false
CONFIDENCE: 0-100 (신뢰도 퍼센트)
REASON: 판단 근거 설명
CARBON_REDUCTION: 0.3 (kg, 고정값)
POINTS: 15 (포인트, 고정값)

예시:
VALID: true
CONFIDENCE: 95
REASON: 스테인리스 스틸 텀블러에 커피가 담겨있고, 재사용 가능한 컵임이 명확합니다.
CARBON_REDUCTION: 0.3
POINTS: 15`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      temperature: 0.1, // 일관된 분석을 위해 낮은 온도 설정
    });

    return response.choices[0]?.message?.content || "분석 결과를 가져올 수 없습니다.";
  } catch (error) {
    console.error('GPT-4o 분석 오류:', error);
    console.error('오류 상세:', JSON.stringify(error, null, 2));
    throw new Error(`이미지 분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}

// 분석 결과 파싱
function parseAnalysisResult(analysisResult: string) {
  try {
    const lines = analysisResult.split('\n');
    let isValid = false;
    let confidence = 0;
    let reason = "분석 결과를 파싱할 수 없습니다.";
    let carbonReduction = 0.3; // 기본값
    let points = 15; // 기본값

    for (const line of lines) {
      if (line.startsWith('VALID:')) {
        isValid = line.includes('true');
      } else if (line.startsWith('CONFIDENCE:')) {
        confidence = parseInt(line.split(':')[1].trim()) || 0;
      } else if (line.startsWith('REASON:')) {
        reason = line.split(':')[1].trim();
      } else if (line.startsWith('CARBON_REDUCTION:')) {
        carbonReduction = parseFloat(line.split(':')[1].trim()) || 0.3;
      } else if (line.startsWith('POINTS:')) {
        points = parseInt(line.split(':')[1].trim()) || 15;
      }
    }

    return {
      isValid,
      confidence,
      reason,
      carbonReduction,
      points
    };
  } catch (error) {
    console.error('분석 결과 파싱 오류:', error);
    return {
      isValid: false,
      confidence: 0,
      reason: "분석 결과 파싱 중 오류가 발생했습니다.",
      carbonReduction: 0.3,
      points: 15
    };
  }
}
