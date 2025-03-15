import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password, nickname, school } = await req.json();

    console.log("회원가입 요청:", { email, password, nickname, school }); // ✅ 회원가입 요청 확인

    // ✅ Supabase Authentication에 사용자 등록
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
          school,
        },
      },
    });

    if (error) {
      console.error("회원가입 실패:", error.message); // ✅ 오류 로그 출력
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("회원가입 성공:", data); // ✅ 성공 메시지 확인
    return NextResponse.json({ message: "회원가입 성공", user: data.user }, { status: 201 });
  } catch (error) {
    console.error("서버 오류:", (error as Error).message);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
