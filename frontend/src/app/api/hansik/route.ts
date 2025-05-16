import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: Request) {
  try {
    // URL에서 요일 파라미터 확인
    const url = new URL(request.url);
    const dayParam = url.searchParams.get('day') || 'today';

    // 날짜 정보를 저장할 변수들은 아래에서 선언

    console.log(`요청된 요일 파라미터: ${dayParam}`);

    // Puppeteer 설정 개선 - 추가 옵션 설정
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      timeout: 30000 // 타임아웃 30초로 설정
    });

    const page = await browser.newPage();

    // 타임아웃 설정
    page.setDefaultNavigationTimeout(30000);

    // 요청 헤더 설정
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
    });

    console.log("한밭대학교 학식 페이지 접속 시도...");
    await page.goto("https://www.hanbat.ac.kr/prog/carteGuidance/kor/sub06_030301/C1/calendar.do", {
      waitUntil: "networkidle2",
      timeout: 30000
    });

    // 요일 인덱스 설정 및 날짜 계산
    let dayIndex: number;
    let dateStr: string;

    // 현재 날짜 가져오기
    const now = new Date();
    const currentDayOfWeek = now.getDay();

    // 요일 인덱스 매핑
    const dayIndices: Record<string, number> = {
      'mon': 1, // 월요일
      'tue': 2, // 화요일
      'wed': 3, // 수요일
      'thu': 4, // 목요일
      'fri': 5  // 금요일
    };

    if (dayParam === 'today') {
      // 현재 날짜 기준
      dayIndex = currentDayOfWeek;
      dateStr = "오늘";

      // 주말인 경우 다음 월요일로 설정
      if (dayIndex === 0 || dayIndex === 6) {
        const daysUntilMonday = dayIndex === 0 ? 1 : 2; // 일요일이면 1일 후, 토요일이면 2일 후
        const nextMonday = new Date(now);
        nextMonday.setDate(now.getDate() + daysUntilMonday);

        dayIndex = 1; // 월요일로 설정
      }
    } else {
      // 특정 요일 선택
      dayIndex = dayIndices[dayParam] || 1; // 기본값은 월요일

      // 요일 이름
      const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
      dateStr = dayNames[dayIndex];

      // 현재 날짜에서 선택한 요일까지의 차이 계산
      let dayDiff = dayIndex - currentDayOfWeek;

      // 만약 선택한 요일이 현재 요일보다 이전이면 다음 주의 해당 요일로 계산
      if (dayDiff < 0) {
        dayDiff += 7;
      }

      // 선택한 요일의 날짜 계산
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + dayDiff);
    }

    // 주말 체크 (이미 위에서 처리했으므로 여기서는 생략)
    // 주말인 경우 이미 다음 월요일로 설정했음

    // ✅ 월요일(td[0]), 화요일(td[1]), ... 금요일(td[4])
    const targetTdIndex = Math.max(dayIndex - 1, 0); // ✅ 최소 0을 유지하여 예외 방지

    console.log(`요일 인덱스: ${dayIndex}, 타겟 TD 인덱스: ${targetTdIndex}`);

    // 페이지 로딩 확인
    const pageContent = await page.content();
    if (!pageContent.includes("coltable")) {
      console.error("페이지 내용에 학식 테이블이 없습니다.");
      throw new Error("학식 정보 테이블을 찾을 수 없습니다.");
    }

    // 페이지 스크린샷 (디버깅용)
    // await page.screenshot({ path: 'hansik-debug.png' });

    console.log("학식 정보 추출 시작...");

    const meals = await page.evaluate((targetTdIndex, dateString) => {
      // ✅ HTML 엔티티 디코딩 함수 (textarea 없이 처리)
      function decodeEntities(text: string): string {
        if (!text) return "";

        return text.replace(/&amp;/g, "&")
                   .replace(/&lt;/g, "<")
                   .replace(/&gt;/g, ">")
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'")
                   .replace(/<\/div>$/g, "")
                   .replace(/<br\s*\/?>/gi, "\n") // <br> 태그를 줄바꿈으로 변환
                   .replace(/<[^>]*>/g, ""); // 나머지 HTML 태그 제거
      }

      let data = {
        date: dateString || "",
        lunch: "정보 없음",
        dinner: "정보 없음"
      };

      try {
        // 테이블 찾기
        const table = document.querySelector("#coltable tbody");
        if (!table) {
          console.error("학식 테이블을 찾을 수 없습니다.");
          return {
            error: "학식 정보를 찾을 수 없습니다.",
            date: dateString || "",
            lunch: "학식 정보를 찾을 수 없습니다.",
            dinner: "학식 정보를 찾을 수 없습니다."
          };
        }

        // 테이블 행 확인
        const rows = table.querySelectorAll("tr");
        if (!rows || rows.length < 3) {
          console.error(`테이블 행 수가 부족합니다: ${rows ? rows.length : 0}`);
          return {
            error: "학식 정보 형식이 올바르지 않습니다.",
            date: dateString || "",
            lunch: "학식 정보 형식이 올바르지 않습니다.",
            dinner: "학식 정보 형식이 올바르지 않습니다."
          };
        }

        // 날짜 정보 가져오기 - XPath 경로 사용: //*[@id="coltable"]/thead/tr/th[2]/div
        try {
          // 요청한 XPath 경로에서 날짜 정보 가져오기
          const dateElement = document.evaluate(
            `//*[@id="coltable"]/thead/tr/th[${targetTdIndex + 1}]/div`,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (dateElement && dateElement.textContent) {
            data.date = dateElement.textContent.trim();
            console.log("XPath에서 가져온 날짜:", data.date);
          } else {
            // 기존 방식으로 대체
            const dateRow = rows[0];
            if (dateRow) {
              const thElements = dateRow.querySelectorAll("th");
              if (thElements && thElements.length > targetTdIndex) {
                const dateTh = thElements[targetTdIndex];
                if (dateTh && dateTh.textContent) {
                  data.date = dateTh.textContent.trim();
                }
              }
            }
          }
        } catch (error) {
          console.error("XPath로 날짜 정보 가져오기 실패:", error);
          // 기존 방식으로 대체
          const dateRow = rows[0];
          if (dateRow) {
            const thElements = dateRow.querySelectorAll("th");
            if (thElements && thElements.length > targetTdIndex) {
              const dateTh = thElements[targetTdIndex];
              if (dateTh && dateTh.textContent) {
                data.date = dateTh.textContent.trim();
              }
            }
          }
        }

        // 중식 정보 가져오기 - obj 클래스에서 메뉴 가져오기
        try {
          // 중식 행에서 obj 클래스를 가진 요소 찾기
          const lunchRow = rows[1];
          if (lunchRow) {
            const tdElements = lunchRow.querySelectorAll("td");
            if (tdElements && tdElements.length > targetTdIndex) {
              const lunchTd = tdElements[targetTdIndex];

              // 직접 HTML 내용을 분석하여 <br> 태그로 구분된 메뉴 항목 추출
              if (lunchTd && lunchTd.innerHTML) {
                const htmlContent = lunchTd.innerHTML;

                // <br> 태그로 분리하여 메뉴 항목 추출
                const menuItems = htmlContent
                  .split(/<br\s*\/?>/gi)
                  .map(item => {
                    // HTML 태그 제거 및 공백 제거
                    return item
                      .replace(/<[^>]*>/g, '')
                      .trim();
                  })
                  .filter(item => item && item.length > 0);

                if (menuItems.length > 0) {
                  data.lunch = menuItems.join("\n");
                  console.log("<br> 태그로 분리한 중식 메뉴:", data.lunch);
                } else {
                  // <br> 태그로 분리할 수 없는 경우 obj 클래스 시도
                  const objElements = lunchTd.querySelectorAll(".obj");

                  if (objElements && objElements.length > 0) {
                    // obj 클래스 요소들에서 메뉴 항목 추출
                    const objMenuItems = Array.from(objElements)
                      .map(el => el.textContent ? el.textContent.trim() : "")
                      .filter(item => item && item.length > 0);

                    if (objMenuItems.length > 0) {
                      data.lunch = objMenuItems.join("\n");
                      console.log("obj 클래스에서 가져온 중식 메뉴:", data.lunch);
                    } else {
                      // obj 클래스에서도 메뉴를 찾지 못한 경우 기존 방식으로 대체
                      fallbackLunchExtraction();
                    }
                  } else {
                    // obj 클래스가 없는 경우 기존 방식으로 대체
                    fallbackLunchExtraction();
                  }
                }
              } else {
                // obj 클래스가 없는 경우 기존 방식으로 대체
                fallbackLunchExtraction();
              }
            } else {
              fallbackLunchExtraction();
            }
          } else {
            fallbackLunchExtraction();
          }
        } catch (error) {
          console.error("obj 클래스에서 중식 메뉴 가져오기 실패:", error);
          fallbackLunchExtraction();
        }

        // 기존 방식으로 중식 메뉴 추출하는 함수
        function fallbackLunchExtraction() {
          const lunchRow = rows[1];
          if (lunchRow) {
            const tdElements = lunchRow.querySelectorAll("td");
            if (tdElements && tdElements.length > targetTdIndex) {
              const lunchTd = tdElements[targetTdIndex];
              if (lunchTd) {
                // innerHTML 대신 textContent 사용 시도
                if (lunchTd.textContent && lunchTd.textContent.trim()) {
                  // 텍스트 내용을 줄바꿈 또는 쉼표로 분리하여 각 항목을 별도 줄로 처리
                  const content = lunchTd.textContent.trim();
                  // 줄바꿈, 쉼표, 슬래시, 공백 여러 개로 분리하고 빈 항목 제거
                  const menuItems = content
                    .replace(/[,\/]/g, '\n') // 쉼표와 슬래시를 줄바꿈으로 변환
                    .split(/\n+/)            // 줄바꿈으로 분리
                    .map(item => item.trim())
                    .filter(item => item && item.length > 0);

                  if (menuItems.length > 0) {
                    data.lunch = menuItems.join("\n");
                  } else {
                    data.lunch = content; // 분리할 수 없으면 원본 내용 사용
                  }
                } else if (lunchTd.innerHTML) {
                  // <br> 태그로 분리하여 메뉴 항목 추출
                  const menuItems = lunchTd.innerHTML
                    .split(/<br\s*\/?>/gi)
                    .map(item => {
                      // HTML 태그 제거 및 공백 제거
                      return decodeEntities(
                        item.replace(/<[^>]*>/g, '').trim()
                      );
                    })
                    .filter(item => item && item.length > 0);

                  if (menuItems.length > 0) {
                    data.lunch = menuItems.join("\n");
                  } else {
                    // 결과가 비어있으면 전체 내용 디코딩 시도하고 다시 분리
                    const fullContent = decodeEntities(lunchTd.innerHTML);
                    // 줄바꿈, 쉼표, 슬래시로 분리
                    const items = fullContent
                      .split(/[\n,\/]+/)
                      .map(item => item.trim())
                      .filter(item => item && item.length > 0);

                    if (items.length > 0) {
                      data.lunch = items.join("\n");
                    } else {
                      data.lunch = fullContent;
                    }
                  }
                }
              }
            }
          }
        }

        // 석식 정보 가져오기 - obj 클래스에서 메뉴 가져오기
        try {
          // 석식 행에서 obj 클래스를 가진 요소 찾기
          const dinnerRow = rows[2];
          if (dinnerRow) {
            const tdElements = dinnerRow.querySelectorAll("td");
            if (tdElements && tdElements.length > targetTdIndex) {
              const dinnerTd = tdElements[targetTdIndex];

              // 직접 HTML 내용을 분석하여 <br> 태그로 구분된 메뉴 항목 추출
              if (dinnerTd && dinnerTd.innerHTML) {
                const htmlContent = dinnerTd.innerHTML;

                // <br> 태그로 분리하여 메뉴 항목 추출
                const menuItems = htmlContent
                  .split(/<br\s*\/?>/gi)
                  .map(item => {
                    // HTML 태그 제거 및 공백 제거
                    return item
                      .replace(/<[^>]*>/g, '')
                      .trim();
                  })
                  .filter(item => item && item.length > 0);

                if (menuItems.length > 0) {
                  data.dinner = menuItems.join("\n");
                  console.log("<br> 태그로 분리한 석식 메뉴:", data.dinner);
                } else {
                  // <br> 태그로 분리할 수 없는 경우 obj 클래스 시도
                  const objElements = dinnerTd.querySelectorAll(".obj");

                  if (objElements && objElements.length > 0) {
                    // obj 클래스 요소들에서 메뉴 항목 추출
                    const objMenuItems = Array.from(objElements)
                      .map(el => el.textContent ? el.textContent.trim() : "")
                      .filter(item => item && item.length > 0);

                    if (objMenuItems.length > 0) {
                      data.dinner = objMenuItems.join("\n");
                      console.log("obj 클래스에서 가져온 석식 메뉴:", data.dinner);
                    } else {
                      // obj 클래스에서도 메뉴를 찾지 못한 경우 기존 방식으로 대체
                      fallbackDinnerExtraction();
                    }
                  } else {
                    // obj 클래스가 없는 경우 기존 방식으로 대체
                    fallbackDinnerExtraction();
                  }
                }
              } else {
                // obj 클래스가 없는 경우 기존 방식으로 대체
                fallbackDinnerExtraction();
              }
            } else {
              fallbackDinnerExtraction();
            }
          } else {
            fallbackDinnerExtraction();
          }
        } catch (error) {
          console.error("obj 클래스에서 석식 메뉴 가져오기 실패:", error);
          fallbackDinnerExtraction();
        }

        // 기존 방식으로 석식 메뉴 추출하는 함수
        function fallbackDinnerExtraction() {
          const dinnerRow = rows[2];
          if (dinnerRow) {
            const tdElements = dinnerRow.querySelectorAll("td");
            if (tdElements && tdElements.length > targetTdIndex) {
              const dinnerTd = tdElements[targetTdIndex];
              if (dinnerTd) {
                // innerHTML 대신 textContent 사용 시도
                if (dinnerTd.textContent && dinnerTd.textContent.trim()) {
                  // 텍스트 내용을 줄바꿈 또는 쉼표로 분리하여 각 항목을 별도 줄로 처리
                  const content = dinnerTd.textContent.trim();
                  // 줄바꿈, 쉼표, 슬래시, 공백 여러 개로 분리하고 빈 항목 제거
                  const menuItems = content
                    .replace(/[,\/]/g, '\n') // 쉼표와 슬래시를 줄바꿈으로 변환
                    .split(/\n+/)            // 줄바꿈으로 분리
                    .map(item => item.trim())
                    .filter(item => item && item.length > 0);

                  if (menuItems.length > 0) {
                    data.dinner = menuItems.join("\n");
                  } else {
                    data.dinner = content; // 분리할 수 없으면 원본 내용 사용
                  }
                } else if (dinnerTd.innerHTML) {
                  // <br> 태그로 분리하여 메뉴 항목 추출
                  const menuItems = dinnerTd.innerHTML
                    .split(/<br\s*\/?>/gi)
                    .map(item => {
                      // HTML 태그 제거 및 공백 제거
                      return decodeEntities(
                        item.replace(/<[^>]*>/g, '').trim()
                      );
                    })
                    .filter(item => item && item.length > 0);

                  if (menuItems.length > 0) {
                    data.dinner = menuItems.join("\n");
                  } else {
                    // 결과가 비어있으면 전체 내용 디코딩 시도하고 다시 분리
                    const fullContent = decodeEntities(dinnerTd.innerHTML);
                    // 줄바꿈, 쉼표, 슬래시로 분리
                    const items = fullContent
                      .split(/[\n,\/]+/)
                      .map(item => item.trim())
                      .filter(item => item && item.length > 0);

                    if (items.length > 0) {
                      data.dinner = items.join("\n");
                    } else {
                      data.dinner = fullContent;
                    }
                  }
                }
              }
            }
          }
        }

        // 데이터 검증
        if (!data.lunch || data.lunch.trim() === "") {
          data.lunch = "해당 요일 중식 정보가 없습니다.";
        }

        if (!data.dinner || data.dinner.trim() === "") {
          data.dinner = "해당 요일 석식 정보가 없습니다.";
        }

        return data;
      } catch (error) {
        console.error("학식 정보 추출 중 오류:", error);
        return {
          error: "학식 정보 추출 중 오류가 발생했습니다.",
          date: dateString || "",
          lunch: "학식 정보 추출 중 오류가 발생했습니다.",
          dinner: "학식 정보 추출 중 오류가 발생했습니다."
        };
      }
    }, targetTdIndex, dateStr);

    await browser.close();

    // 오류 확인
    if ('error' in meals) {
      console.error("학식 정보 추출 중 오류:", meals.error);
      return NextResponse.json({
        error: meals.error,
        date: dateStr,
        lunch: meals.lunch || "학식 정보를 가져올 수 없습니다.",
        dinner: meals.dinner || "학식 정보를 가져올 수 없습니다.",
        dayOfWeek: dateStr
      }, { status: 200 }); // 클라이언트에서 처리할 수 있도록 200 상태 코드 반환
    }

    // 날짜 정보가 없거나 비어있는 경우 요일 정보 추가
    const mealsData = meals as any;
    if ('date' in mealsData && (!mealsData.date || mealsData.date.trim() === "")) {
      mealsData.date = dateStr;
    }

    // 데이터 검증 및 기본값 설정
    if (!mealsData.lunch || mealsData.lunch.trim() === "") {
      mealsData.lunch = "해당 요일 중식 정보가 없습니다.";
    }

    if (!mealsData.dinner || mealsData.dinner.trim() === "") {
      mealsData.dinner = "해당 요일 석식 정보가 없습니다.";
    }

    console.log("가져온 학식 데이터:", mealsData);

    return NextResponse.json({
      ...mealsData,
      dayOfWeek: dateStr // 요일 정보 추가
    });
  } catch (error) {
    console.error("학식 정보를 불러오는 중 오류 발생:", error);

    // 더 자세한 오류 메시지 제공
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";

    // 클라이언트에서 처리할 수 있는 응답 반환
    return NextResponse.json({
      error: `서버 내부 오류로 학식 정보를 가져올 수 없습니다: ${errorMessage}`,
      date: "오늘",
      lunch: "학식 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.",
      dinner: "학식 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.",
      dayOfWeek: "오늘"
    }, { status: 200 }); // 클라이언트에서 처리할 수 있도록 200 상태 코드 반환
  }
}