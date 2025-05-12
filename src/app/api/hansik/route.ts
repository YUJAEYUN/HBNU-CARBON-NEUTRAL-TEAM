import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: Request) {
  try {
    // URL에서 요일 파라미터 확인
    const url = new URL(request.url);
    const dayParam = url.searchParams.get('day') || 'today';

    console.log(`요청된 요일 파라미터: ${dayParam}`);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www.hanbat.ac.kr/prog/carteGuidance/kor/sub06_030301/C1/calendar.do", {
      waitUntil: "networkidle2",
    });

    // 요일 인덱스 설정
    let dayIndex: number;
    let dateStr: string;

    if (dayParam === 'today') {
      // 현재 날짜 기준
      const today = new Date();
      dayIndex = today.getDay();
      dateStr = "오늘";
    } else if (dayParam === 'mon') {
      dayIndex = 1; // 월요일
      dateStr = "월요일";
    } else if (dayParam === 'tue') {
      dayIndex = 2; // 화요일
      dateStr = "화요일";
    } else if (dayParam === 'wed') {
      dayIndex = 3; // 수요일
      dateStr = "수요일";
    } else if (dayParam === 'thu') {
      dayIndex = 4; // 목요일
      dateStr = "목요일";
    } else if (dayParam === 'fri') {
      dayIndex = 5; // 금요일
      dateStr = "금요일";
    } else {
      // 기본값은 오늘
      const today = new Date();
      dayIndex = today.getDay();
      dateStr = "오늘";
    }

    // 주말 체크
    if (dayIndex === 0 || dayIndex === 6) {
      return NextResponse.json({
        date: dateStr,
        lunch: "주말은 학식을 운영하지 않습니다.",
        dinner: "주말은 학식을 운영하지 않습니다."
      });
    }

    // ✅ 월요일(td[0]), 화요일(td[1]), ... 금요일(td[4])
    const targetTdIndex = Math.max(dayIndex - 1, 0); // ✅ 최소 0을 유지하여 예외 방지

    console.log(`요일 인덱스: ${dayIndex}, 타겟 TD 인덱스: ${targetTdIndex}`)

    const meals = await page.evaluate((targetTdIndex, dateString) => {
      // ✅ HTML 엔티티 디코딩 함수 (textarea 없이 처리)
      function decodeEntities(text: string): string {
        return text.replace(/&amp;/g, "&")
                   .replace(/&lt;/g, "<")
                   .replace(/&gt;/g, ">")
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'")
                   .replace(/<\/div>$/g, "");

      }

      let data = { date: dateString || "", lunch: "", dinner: "" };

      const table = document.querySelector("#coltable tbody");
      if (!table) return { error: "학식 정보를 찾을 수 없습니다." };

      // 날짜 정보 가져오기
      const dateRow = table.querySelectorAll("tr")[0] || null;
      if (dateRow) {
        const dateTh = dateRow.querySelectorAll("th")[targetTdIndex];
        if (dateTh && dateTh.textContent) {
          data.date = dateTh.textContent.trim();
        }
      }

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
    }, targetTdIndex, dateStr);

    await browser.close();

    // 날짜 정보가 없거나 비어있는 경우 요일 정보 추가
    const mealsData = meals as any;
    if ('date' in mealsData && (!mealsData.date || mealsData.date.trim() === "")) {
      mealsData.date = dateStr;
    }

    console.log("가져온 학식 데이터:", mealsData);

    return NextResponse.json({
      ...mealsData,
      dayOfWeek: dateStr // 요일 정보 추가
    });
  } catch (error) {
    console.error("학식 정보를 불러오는 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 내부 오류로 학식 정보를 가져올 수 없습니다." }, { status: 500 });
  }
}