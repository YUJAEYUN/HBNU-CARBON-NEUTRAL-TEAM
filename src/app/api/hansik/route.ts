import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www.hanbat.ac.kr/prog/carteGuidance/kor/sub06_030301/C1/calendar.do", {
      waitUntil: "networkidle2",
    });

    // ✅ 현재 날짜 가져오기 (한국 시간 기준)
    const today = new Date();
    const dayIndex = today.getDay();

    if (dayIndex === 0 || dayIndex === 6) {
      return NextResponse.json({ date: "주말", lunch: "오늘은 학식 정보가 없습니다.", dinner: "오늘은 학식 정보가 없습니다." });
    }

    // ✅ 월요일(td[0]), 화요일(td[1]), ... 금요일(td[4])
    const targetTdIndex = Math.max(dayIndex - 1, 0); // ✅ 최소 0을 유지하여 예외 방지

    const meals = await page.evaluate((targetTdIndex) => {
      // ✅ HTML 엔티티 디코딩 함수 (textarea 없이 처리)
      function decodeEntities(text: string): string {
        return text.replace(/&amp;/g, "&")
                   .replace(/&lt;/g, "<")
                   .replace(/&gt;/g, ">")
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'")
                   .replace(/<\/div>$/g, "");

      }

      let data = { date: "", lunch: "", dinner: "" };

      const table = document.querySelector("#coltable tbody");
      if (!table) return { error: "학식 정보를 찾을 수 없습니다." };

      const lunchRow = table.querySelectorAll("tr")[1] || null; // ✅ 에러 방지
      const dinnerRow = table.querySelectorAll("tr")[2] || null; // ✅ 에러 방지

      if (lunchRow) {
        const lunchTd = lunchRow.querySelectorAll("td")[targetTdIndex];
        if (lunchTd) {
          data.lunch = lunchTd.innerHTML
            .split("<br>")
            .map(item => decodeEntities(item.trim()))
            .filter(item => item && !item.includes("<div")) // ✅ <div> 포함된 경우 제거
            .join("\n");
        }
      }

      if (dinnerRow) {
        const dinnerTd = dinnerRow.querySelectorAll("td")[targetTdIndex];
        if (dinnerTd) {
          data.dinner = dinnerTd.innerHTML
            .split("<br>")
            .map(item => decodeEntities(item.trim()))
            .filter(item => item && !item.includes("<div")) // ✅ <div> 포함된 경우 제거
            .join("\n");
        }
      }

      return data;
    }, targetTdIndex);

    await browser.close();
    console.log("가져온 학식 데이터:", meals);

    return NextResponse.json(meals);
  } catch (error) {
    console.error("학식 정보를 불러오는 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 내부 오류로 학식 정보를 가져올 수 없습니다." }, { status: 500 });
  }
}
