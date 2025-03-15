import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "로그아웃 성공" }, { status: 200 });
}
