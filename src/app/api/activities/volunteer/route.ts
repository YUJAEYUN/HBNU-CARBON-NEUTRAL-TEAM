import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';

// 1365 자원봉사포털에서 봉사활동 정보를 크롤링하는 API
export async function GET(request: Request) {
  try {
    // 실제 구현에서는 puppeteer를 사용하여 1365 사이트에서 데이터를 크롤링
    // 현재는 목업 데이터 반환

    // URL 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "전체";
    const keyword = searchParams.get("keyword") || "";

    // 목업 데이터
    const mockActivities = [
      {
        id: "1",
        title: "탄소중립 환경정화 봉사활동",
        organization: "한밭대학교 환경동아리",
        location: "대전 유성구",
        startDate: "2023-06-10",
        endDate: "2023-06-10",
        recruitmentPeriod: "2023-05-15 ~ 2023-06-05",
        participants: "20명",
        category: "환경보호",
        carbonReduction: 5.2,
        description: "대전 유성구 일대 하천 및 공원 환경정화 활동을 통해 지역사회 환경 개선에 기여합니다. 참가자들은 쓰레기 수거 및 분리수거 활동을 진행하며, 활동 후 환경보호 교육도 함께 진행됩니다.",
        imageUrl: "/volunteer/cleanup.jpg",
        link: "https://www.1365.go.kr"
      },
      {
        id: "2",
        title: "탄소발자국 줄이기 캠페인",
        organization: "대전시 환경운동연합",
        location: "대전시 전역",
        startDate: "2023-06-15",
        endDate: "2023-06-30",
        recruitmentPeriod: "2023-05-20 ~ 2023-06-10",
        participants: "30명",
        category: "탄소중립",
        carbonReduction: 8.7,
        description: "일상 속에서 탄소발자국을 줄이는 방법을 시민들에게 알리는 캠페인 활동입니다. 참가자들은 거리 캠페인, SNS 홍보, 교육 자료 배포 등의 활동을 진행합니다.",
        imageUrl: "/volunteer/campaign.jpg",
        link: "https://www.1365.go.kr"
      },
      {
        id: "3",
        title: "폐기물 재활용 교육 봉사",
        organization: "자원순환사회연대",
        location: "대전 서구 지역아동센터",
        startDate: "2023-06-20",
        endDate: "2023-06-20",
        recruitmentPeriod: "2023-05-25 ~ 2023-06-15",
        participants: "10명",
        category: "교육봉사",
        carbonReduction: 3.5,
        description: "지역 아동들에게 올바른 재활용 방법과 자원순환의 중요성을 교육하는 봉사활동입니다. 참가자들은 교육 자료 준비 및 실습 활동을 함께 진행합니다.",
        imageUrl: "/volunteer/recycling.jpg",
        link: "https://www.1365.go.kr"
      },
      {
        id: "4",
        title: "도시농업 텃밭 가꾸기",
        organization: "대전 도시농업네트워크",
        location: "대전 중구 도시농업공원",
        startDate: "2023-06-25",
        endDate: "2023-08-25",
        recruitmentPeriod: "2023-05-30 ~ 2023-06-20",
        participants: "15명",
        category: "환경보호",
        carbonReduction: 12.3,
        description: "도시 내 유휴공간을 활용한 텃밭 가꾸기 활동을 통해 도시 녹지화와 탄소 흡수에 기여합니다. 참가자들은 정기적으로 텃밭을 관리하고 수확물은 지역 복지시설에 기부합니다.",
        imageUrl: "/volunteer/urban-farming.jpg",
        link: "https://www.1365.go.kr"
      },
      {
        id: "5",
        title: "에너지 절약 캠페인",
        organization: "기후변화대응네트워크",
        location: "대전 동구",
        startDate: "2023-07-01",
        endDate: "2023-07-15",
        recruitmentPeriod: "2023-06-01 ~ 2023-06-25",
        participants: "25명",
        category: "탄소중립",
        carbonReduction: 7.8,
        description: "가정과 사무실에서 실천할 수 있는 에너지 절약 방법을 알리는 캠페인입니다. 참가자들은 에너지 절약 체크리스트 배포 및 홍보 활동을 진행합니다.",
        imageUrl: "/volunteer/energy-saving.jpg",
        link: "https://www.1365.go.kr"
      }
    ];

    // 필터링
    let filteredActivities = mockActivities;

    if (category !== "전체") {
      filteredActivities = filteredActivities.filter(activity =>
        activity.category === category
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
      // 봉사활동 유형에 따른 탄소 절감량 계산
      let baseReduction = 0;

      if (activity.category === "환경보호") {
        baseReduction = 5.0;
      } else if (activity.category === "탄소중립") {
        baseReduction = 8.0;
      } else if (activity.category === "교육봉사") {
        baseReduction = 3.0;
      } else {
        baseReduction = 2.0;
      }

      // 활동 기간에 따른 조정
      const startDate = new Date(activity.startDate);
      const endDate = new Date(activity.endDate);
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // 최종 탄소 절감량 계산 (기본값 + 기간 조정)
      const carbonReduction = baseReduction + (durationDays > 1 ? durationDays * 0.5 : 0);

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
        category,
        keyword
      }
    });
  } catch (error) {
    console.error("봉사활동 정보를 가져오는 중 오류 발생:", error);
    return NextResponse.json({
      success: false,
      error: "봉사활동 정보를 가져오는 중 오류가 발생했습니다."
    }, { status: 500 });
  }
}
