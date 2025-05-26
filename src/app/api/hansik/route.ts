import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { supabase } from "@/lib/supabase";

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // URL에서 요일 파라미터 확인
    const url = new URL(request.url);
    const dayParam = url.searchParams.get('day') || 'today';

    console.log(`요청된 요일 파라미터: ${dayParam}`);

    // 날짜 계산
    let targetDate = new Date();
    let dayIndex: number;
    let dateStr: string;
    let formattedDate: string;

    if (dayParam === 'today') {
      // 현재 날짜 기준
      dayIndex = targetDate.getDay();
      dateStr = "오늘";
    } else if (dayParam === 'mon') {
      dayIndex = 1; // 월요일
      dateStr = "월요일";
      // 현재 날짜에서 가장 가까운 월요일 계산
      const day = targetDate.getDay();
      const diff = day === 0 ? -6 : 1 - day; // 일요일이면 지난 월요일, 아니면 이번주 월요일
      targetDate.setDate(targetDate.getDate() + diff);
    } else if (dayParam === 'tue') {
      dayIndex = 2; // 화요일
      dateStr = "화요일";
      const day = targetDate.getDay();
      const diff = day === 0 ? -5 : 2 - day;
      targetDate.setDate(targetDate.getDate() + diff);
      console.log(`화요일 계산: 현재 요일=${day}, 차이=${diff}, 계산된 날짜=${targetDate.toISOString()}`);
      console.log(`화요일 dayIndex=${dayIndex}`);
    } else if (dayParam === 'wed') {
      dayIndex = 3; // 수요일
      dateStr = "수요일";
      const day = targetDate.getDay();
      const diff = day === 0 ? -4 : 3 - day;
      targetDate.setDate(targetDate.getDate() + diff);
    } else if (dayParam === 'thu') {
      dayIndex = 4; // 목요일
      dateStr = "목요일";
      const day = targetDate.getDay();
      const diff = day === 0 ? -3 : 4 - day;
      targetDate.setDate(targetDate.getDate() + diff);
    } else if (dayParam === 'fri') {
      dayIndex = 5; // 금요일
      dateStr = "금요일";
      const day = targetDate.getDay();
      const diff = day === 0 ? -2 : 5 - day;
      targetDate.setDate(targetDate.getDate() + diff);
    } else {
      // 기본값은 오늘
      dayIndex = targetDate.getDay();
      dateStr = "오늘";
    }

    // 날짜 포맷 (YYYY-MM-DD)
    formattedDate = targetDate.toISOString().split('T')[0];
    console.log(`계산된 날짜: ${formattedDate}, 요일: ${dateStr}`);

    // 주말 체크
    if (dayIndex === 0 || dayIndex === 6) {
      return NextResponse.json({
        date: dateStr,
        formattedDate: formattedDate,
        lunch: "주말은 학식을 운영하지 않습니다.",
        dinner: "주말은 학식을 운영하지 않습니다.",
        dayOfWeek: dateStr
      });
    }

    // 데이터베이스에서 해당 날짜의 학식 정보 확인
    const { data: cachedMenu, error: dbError } = await supabase
      .from("hansik_menus")
      .select("*")
      .eq("date", formattedDate)
      .single();

    // 캐시된 데이터가 있으면 반환
    if (cachedMenu && !dbError) {
      console.log(`데이터베이스에서 ${formattedDate} 학식 정보를 찾았습니다.`);
      return NextResponse.json({
        date: cachedMenu.date,
        formattedDate: formattedDate,
        lunch: cachedMenu.lunch,
        dinner: cachedMenu.dinner,
        dayOfWeek: cachedMenu.day_of_week,
        cached: true
      });
    }

    // 캐시된 데이터가 없으면 크롤링
    console.log(`${formattedDate} 학식 정보를 크롤링합니다.`);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www.hanbat.ac.kr/prog/carteGuidance/kor/sub06_030301/C1/calendar.do", {
      waitUntil: "networkidle2",
    });

    // 크롤링을 위한 타겟 TD 인덱스 계산 (월요일=0, 화요일=1, ...)
    const targetTdIndex = Math.max(dayIndex - 1, 0); // 최소 0을 유지하여 예외 방지
    console.log(`요일 인덱스: ${dayIndex}, 타겟 TD 인덱스: ${targetTdIndex}`);

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

    // 크롤링한 데이터를 데이터베이스에 저장
    try {
      const { data: savedData, error: saveError } = await supabase
        .from("hansik_menus")
        .upsert({
          date: formattedDate,
          day_of_week: dateStr,
          lunch: mealsData.lunch || "",
          dinner: mealsData.dinner || "",
          updated_at: new Date().toISOString()
        })
        .select();

      if (saveError) {
        console.error("학식 데이터 저장 중 오류 발생:", saveError);
      } else {
        console.log("학식 데이터가 데이터베이스에 저장되었습니다:", savedData);
      }
    } catch (saveErr) {
      console.error("데이터베이스 저장 중 예외 발생:", saveErr);
    }

    return NextResponse.json({
      ...mealsData,
      formattedDate: formattedDate,
      dayOfWeek: dateStr, // 요일 정보 추가
      cached: false // 크롤링한 데이터임을 표시
    });
  } catch (error) {
    console.error("학식 정보를 불러오는 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 내부 오류로 학식 정보를 가져올 수 없습니다." }, { status: 500 });
  }
}