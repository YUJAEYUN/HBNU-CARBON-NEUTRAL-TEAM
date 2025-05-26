import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: "Google credential이 없습니다." }, { status: 400 });
    }

    // Google JWT 토큰을 Supabase에서 검증하고 사용자 생성/로그인
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: credential,
    });

    if (error) {
      console.error("Google OAuth 로그인 실패:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }

    if (!data.session) {
      console.error("세션이 없음 - Google OAuth 로그인 실패");
      return NextResponse.json({ error: "로그인 실패 - 세션 없음" }, { status: 401 });
    }

    console.log("Google OAuth 로그인 성공:", data.session.access_token);

    // 쿠키에 토큰 저장 (7일 유효기간)
    const cookieStore = cookies();
    await cookieStore.set({
      name: "auth_token",
      value: data.session.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/"
    });

    // 사용자 메타데이터에서 정보 추출
    const user = data.user;
    const userMetadata = user.user_metadata;

    // 사용자 프로필 정보를 데이터베이스에 저장/업데이트
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        nickname: userMetadata.full_name || userMetadata.name || '사용자',
        school: '한밭대학교', // 기본값
        trees: 0,
        level: 1,
        avatar_url: userMetadata.avatar_url || userMetadata.picture,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("프로필 저장 오류:", profileError);
      // 프로필 저장 실패해도 로그인은 성공으로 처리
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Google OAuth 서버 오류:", (error as Error).message);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
