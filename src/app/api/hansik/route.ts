import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET() {
  try {
    // 테스트용 하드코딩 데이터
    const meals = {
      date: new Date().toISOString().split('T')[0],
      lunch: "백미밥\n미역국\n돈육김치볶음\n계란찜\n무생채\n배추김치",
      dinner: "백미밥\n육개장\n고등어구이\n감자채볶음\n콩나물무침\n배추김치"
    };

    console.log("가져온 학식 데이터:", meals);

    return NextResponse.json(meals);
  } catch (error) {
    console.error("학식 정보를 불러오는 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 내부 오류로 학식 정보를 가져올 수 없습니다." }, { status: 500 });
  }
}
