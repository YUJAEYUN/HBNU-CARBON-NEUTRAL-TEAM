import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

// 시간표에 수업 추가
export async function POST(request: NextRequest) {
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

    const userId = userData.user.id;

    // 요청 본문 파싱
    const { timetable_id, subject, location, day, start_hour, end_hour, color } = await request.json();

    if (!timetable_id || !subject || !day || start_hour === undefined || end_hour === undefined) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    // 시간표 소유자 확인
    const { data: timetable, error: timetableError } = await supabase
      .from("timetables")
      .select("*")
      .eq("id", timetable_id)
      .eq("user_id", userId)
      .single();

    if (timetableError || !timetable) {
      return NextResponse.json({ error: "시간표를 찾을 수 없거나 접근 권한이 없습니다." }, { status: 404 });
    }

    // 수업 시간 충돌 확인
    const { data: existingClasses, error: classesError } = await supabase
      .from("timetable_classes")
      .select("*")
      .eq("timetable_id", timetable_id)
      .eq("day", day);

    if (!classesError && existingClasses) {
      const hasConflict = existingClasses.some(
        (cls) =>
          (start_hour < cls.end_hour && end_hour > cls.start_hour) ||
          (start_hour === cls.start_hour && end_hour === cls.end_hour)
      );

      if (hasConflict) {
        return NextResponse.json({ error: "해당 시간에 이미 다른 수업이 있습니다." }, { status: 409 });
      }
    }

    // 새 수업 추가
    const { data, error } = await supabase
      .from("timetable_classes")
      .insert([
        {
          timetable_id,
          subject,
          location: location || "",
          day,
          start_hour,
          end_hour,
          color: color || "#9FC5E8" // 기본 색상
        }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: "수업 추가 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error) {
    console.error("수업 추가 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 시간표의 수업 목록 조회
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

    const userId = userData.user.id;

    // URL 파라미터에서 시간표 ID 가져오기
    const { searchParams } = new URL(request.url);
    const timetableId = searchParams.get("timetable_id");

    if (!timetableId) {
      return NextResponse.json({ error: "시간표 ID가 필요합니다." }, { status: 400 });
    }

    // 시간표 소유자 확인
    const { data: timetable, error: timetableError } = await supabase
      .from("timetables")
      .select("*")
      .eq("id", timetableId)
      .eq("user_id", userId)
      .single();

    if (timetableError || !timetable) {
      return NextResponse.json({ error: "시간표를 찾을 수 없거나 접근 권한이 없습니다." }, { status: 404 });
    }

    // 수업 목록 조회
    const { data: classes, error: classesError } = await supabase
      .from("timetable_classes")
      .select("*")
      .eq("timetable_id", timetableId)
      .order("day", { ascending: true })
      .order("start_hour", { ascending: true });

    if (classesError) {
      return NextResponse.json({ error: "수업 목록을 가져오는 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: classes });
  } catch (error) {
    console.error("수업 목록 조회 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 수업 삭제
export async function DELETE(request: NextRequest) {
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

    const userId = userData.user.id;

    // URL 파라미터에서 수업 ID 가져오기
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("id");

    if (!classId) {
      return NextResponse.json({ error: "수업 ID가 필요합니다." }, { status: 400 });
    }

    // 수업 정보 조회
    const { data: classData, error: classError } = await supabase
      .from("timetable_classes")
      .select("*, timetables!inner(*)")
      .eq("id", classId)
      .single();

    if (classError || !classData) {
      return NextResponse.json({ error: "수업을 찾을 수 없습니다." }, { status: 404 });
    }

    // 시간표 소유자 확인
    if (classData.timetables.user_id !== userId) {
      return NextResponse.json({ error: "이 수업에 대한 접근 권한이 없습니다." }, { status: 403 });
    }

    // 수업 삭제
    const { error } = await supabase
      .from("timetable_classes")
      .delete()
      .eq("id", classId);

    if (error) {
      return NextResponse.json({ error: "수업 삭제 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "수업이 삭제되었습니다." });
  } catch (error) {
    console.error("수업 삭제 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
