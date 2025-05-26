import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';

// 과목 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 쿠키에서 토큰 가져오기
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    // 현재 로그인한 사용자 정보 가져오기
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json({ error: "인증 실패" }, { status: 401 });
    }

    // 과목 목록 조회
    const { data: courses, error: coursesError } = await supabase
      .from("timetable_classes")
      .select("*");

    if (coursesError) {
      return NextResponse.json({ error: "과목 목록을 가져오는 중 오류가 발생했습니다." }, { status: 500 });
    }

    // 과목 데이터 형식 변환
    const formattedCourses = courses.map(course => ({
      id: course.id,
      code: course.code || `COURSE${course.id}`,
      subject: course.subject,
      professor: course.professor || "교수 미정",
      location: course.location,
      credit: course.credit || 3,
      department: course.department || "전공/영역: 전공선택",
      category: course.category || "기본",
      grade: course.grade || 1,
      schedule: [
        {
          day: course.day,
          startHour: course.start_hour,
          endHour: course.end_hour
        }
      ],
      maxStudents: course.max_students || 30,
      currentStudents: course.current_students || 0
    }));

    return NextResponse.json({ success: true, data: formattedCourses });
  } catch (error) {
    console.error("과목 목록 조회 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
