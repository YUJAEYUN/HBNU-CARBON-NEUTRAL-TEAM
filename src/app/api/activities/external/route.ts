import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';

// 위비티에서 대외활동 정보를 크롤링하는 API
export async function GET(request: Request) {
  try {
    // 실제 구현에서는 puppeteer를 사용하여 위비티 사이트에서 데이터를 크롤링
    // 현재는 목업 데이터 반환

    // URL 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const field = searchParams.get("field") || "전체";
    const keyword = searchParams.get("keyword") || "";

    // 목업 데이터
    const mockActivities = [
      {
        id: "1",
        title: "2023 탄소중립 아이디어 공모전",
        organization: "환경부",
        field: "공모전",
        target: "대학생 및 대학원생",
        period: "2023-07-01 ~ 2023-08-31",
        applicationPeriod: "2023-06-01 ~ 2023-06-30",
        benefits: ["상금 최대 500만원", "환경부 장관상", "인턴십 기회"],
        carbonReduction: 15.2,
        description: "일상 속에서 탄소 배출을 줄이는 창의적인 아이디어를 발굴하는 공모전입니다. 개인 또는 팀으로 참가 가능하며, 우수 아이디어는 실제 정책에 반영될 수 있습니다.",
        imageUrl: "/external/contest.jpg",
        link: "https://www.wevity.com"
      },
      {
        id: "2",
        title: "그린캠퍼스 서포터즈",
        organization: "한국환경공단",
        field: "환경",
        target: "전국 대학생",
        period: "2023-07-15 ~ 2023-12-15 (6개월)",
        applicationPeriod: "2023-06-10 ~ 2023-07-05",
        benefits: ["활동비 지원", "수료증 발급", "우수 활동자 시상"],
        carbonReduction: 8.7,
        description: "대학 내 환경보호 및 탄소중립 활동을 기획하고 실행하는 서포터즈 프로그램입니다. 캠퍼스 내 환경 캠페인, SNS 콘텐츠 제작, 환경 교육 등의 활동을 수행합니다.",
        imageUrl: "/external/supporters.jpg",
        link: "https://www.wevity.com"
      },
      {
        id: "3",
        title: "친환경 스타트업 인턴십",
        organization: "그린벤처협회",
        field: "인턴십",
        target: "3~4학년 대학생 및 대학원생",
        period: "2023-08-01 ~ 2023-10-31 (3개월)",
        applicationPeriod: "2023-06-15 ~ 2023-07-10",
        benefits: ["월 급여 지급", "정규직 전환 기회", "실무 경험"],
        carbonReduction: 12.5,
        description: "친환경 및 탄소중립 관련 스타트업에서 실무 경험을 쌓을 수 있는 인턴십 프로그램입니다. 마케팅, 연구개발, 사업기획 등 다양한 직무에 지원 가능합니다.",
        imageUrl: "/external/internship.jpg",
        link: "https://www.wevity.com"
      },
      {
        id: "4",
        title: "탄소중립 청년 아카데미",
        organization: "기후변화대응교육센터",
        field: "교육",
        target: "만 19~34세 청년",
        period: "2023-08-05 ~ 2023-09-30",
        applicationPeriod: "2023-06-20 ~ 2023-07-20",
        benefits: ["교육비 전액 지원", "수료증 발급", "네트워킹 기회"],
        carbonReduction: 5.8,
        description: "탄소중립 관련 전문 지식과 실무 역량을 기를 수 있는 교육 프로그램입니다. 기후변화 과학, 탄소중립 정책, 친환경 비즈니스 모델 등을 학습합니다.",
        imageUrl: "/external/academy.jpg",
        link: "https://www.wevity.com"
      },
      {
        id: "5",
        title: "친환경 브랜드 마케팅 공모전",
        organization: "대한상공회의소",
        field: "마케팅",
        target: "대학생 및 일반인",
        period: "2023-08-10 ~ 2023-09-10",
        applicationPeriod: "2023-06-25 ~ 2023-07-25",
        benefits: ["상금 최대 300만원", "기업 인턴십 기회", "수상 경력"],
        carbonReduction: 7.3,
        description: "친환경 제품 및 서비스의 마케팅 전략을 기획하는 공모전입니다. 브랜딩, 광고, SNS 마케팅 등 다양한 분야에서 창의적인 아이디어를 제안할 수 있습니다.",
        imageUrl: "/external/marketing.jpg",
        link: "https://www.wevity.com"
      }
    ];

    // 필터링
    let filteredActivities = mockActivities;

    if (field !== "전체") {
      filteredActivities = filteredActivities.filter(activity =>
        activity.field === field
      );
    }

    if (keyword) {
      filteredActivities = filteredActivities.filter(activity =>
        activity.title.toLowerCase().includes(keyword.toLowerCase()) ||
        activity.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // 탄소 절감량 계산 로직 (실제 구현에서는 더 정교한 계산 필요)
    filteredActivities = filteredActivities.map(activity => {
      // 대외활동 유형에 따른 탄소 절감량 계산
      let baseReduction = 0;

      if (activity.field === "환경") {
        baseReduction = 8.0;
      } else if (activity.field === "탄소중립") {
        baseReduction = 10.0;
      } else if (activity.field === "공모전") {
        baseReduction = 15.0;
      } else if (activity.field === "인턴십") {
        baseReduction = 12.0;
      } else {
        baseReduction = 5.0;
      }

      // 활동 기간에 따른 조정
      const startDate = new Date(activity.period.split(" ~ ")[0]);
      const endDate = new Date(activity.period.split(" ~ ")[1].split(" ")[0]);
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const durationMonths = durationDays / 30;

      // 최종 탄소 절감량 계산 (기본값 + 기간 조정)
      const carbonReduction = baseReduction + (durationMonths > 1 ? durationMonths * 0.8 : 0);

      return {
        ...activity,
        carbonReduction: parseFloat(carbonReduction.toFixed(1))
      };
    });

    return NextResponse.json({
      success: true,
      data: filteredActivities,
      meta: {
        total: filteredActivities.length,
        field,
        keyword
      }
    });
  } catch (error) {
    console.error("대외활동 정보를 가져오는 중 오류 발생:", error);
    return NextResponse.json({
      success: false,
      error: "대외활동 정보를 가져오는 중 오류가 발생했습니다."
    }, { status: 500 });
  }
}
