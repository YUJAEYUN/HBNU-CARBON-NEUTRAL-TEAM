import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password, nickname, school } = await req.json();

    console.log("회원가입 요청:", { email, password, nickname, school });

    // ✅ Supabase Authentication을 사용하여 회원가입 + 기본값 저장
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
          school,
          trees: 0, // 기본값: 0그루
          level: 1, // 기본값: 1레벨
        },
      },
    });

    if (error) {
      console.error("회원가입 실패:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("회원가입 성공:", data);
    return NextResponse.json({ message: "회원가입 성공", user: data.user }, { status: 201 });
  } catch (error) {
    console.error("서버 오류:", (error as Error).message);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
