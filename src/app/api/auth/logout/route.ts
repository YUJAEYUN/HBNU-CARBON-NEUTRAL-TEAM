import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // 쿠키 삭제
    cookies().delete("auth_token");

    return NextResponse.json({ success: true, message: "로그아웃 성공" }, { status: 200 });
  } catch (error) {
    console.error("로그아웃 오류:", (error as Error).message);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
