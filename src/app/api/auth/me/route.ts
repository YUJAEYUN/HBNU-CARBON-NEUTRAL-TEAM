import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "토큰이 없습니다." }, { status: 401 });
    }

    // ✅ Supabase에서 현재 로그인한 사용자 정보 가져오기
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json({ error: "인증 실패" }, { status: 401 });
    }

    // ✅ 사용자 정보 반환 (nickname, school 포함)
    return NextResponse.json({
      id: data.user.id,
      email: data.user.email,
      nickname: data.user.user_metadata?.nickname || "닉네임 없음",
      school: data.user.user_metadata?.school || "학교 없음",
    });
  } catch (error) {
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
