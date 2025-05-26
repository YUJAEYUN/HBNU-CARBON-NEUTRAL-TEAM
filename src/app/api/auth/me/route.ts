import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    // 쿠키에서 토큰 가져오기
    const cookieStore = cookies();
    const token = await cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "토큰이 없습니다." }, { status: 401 });
    }

    // ✅ 현재 로그인한 사용자 정보 가져오기
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json({ error: "인증 실패" }, { status: 401 });
    }

    // profiles 테이블에서 사용자 정보 가져오기
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      // 프로필이 없으면 기본 프로필 생성 (Google OAuth 사용자의 경우)
      const userMetadata = data.user.user_metadata;
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          nickname: userMetadata.full_name || userMetadata.name || '사용자',
          school: '한밭대학교',
          trees: 0,
          level: 1,
          points: 0,
          avatar_url: userMetadata.avatar_url || userMetadata.picture,
        })
        .select()
        .single();

      if (createError) {
        console.error("프로필 생성 오류:", createError);
        return NextResponse.json({ error: "프로필 생성 실패" }, { status: 500 });
      }

      return NextResponse.json(newProfile, { status: 200 });
    }

    // ✅ 프로필 정보 반환
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
