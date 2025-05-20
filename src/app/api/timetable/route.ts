import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

// 사용자의 시간표 목록 조회
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

    // URL 파라미터 확인
    const { searchParams } = new URL(request.url);
    const timetableId = searchParams.get("id");

    // 특정 시간표 조회
    if (timetableId) {
      const { data: timetable, error: timetableError } = await supabase
        .from("timetables")
        .select("*, classes(*)")
        .eq("id", timetableId)
        .eq("user_id", userId)
        .single();

      if (timetableError) {
        return NextResponse.json({ error: "시간표를 찾을 수 없습니다." }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: timetable });
    }

    // 모든 시간표 조회
    const { data: timetables, error: timetablesError } = await supabase
      .from("timetables")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (timetablesError) {
      return NextResponse.json({ error: "시간표 목록을 가져오는 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: timetables });
  } catch (error) {
    console.error("시간표 조회 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 새 시간표 생성
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
    const { name, semester } = await request.json();

    if (!name || !semester) {
      return NextResponse.json({ error: "이름과 학기 정보가 필요합니다." }, { status: 400 });
    }

    // 새 시간표 생성
    const { data, error } = await supabase
      .from("timetables")
      .insert([
        {
          user_id: userId,
          name,
          semester,
          is_active: false
        }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: "시간표 생성 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error) {
    console.error("시간표 생성 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 시간표 수정 (PATCH 메서드)
export async function PATCH(request: NextRequest) {
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
    const { id, name, semester, is_active } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "시간표 ID가 필요합니다." }, { status: 400 });
    }

    // 시간표 소유자 확인
    const { data: timetable, error: timetableError } = await supabase
      .from("timetables")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (timetableError || !timetable) {
      return NextResponse.json({ error: "시간표를 찾을 수 없거나 접근 권한이 없습니다." }, { status: 404 });
    }

    // 업데이트할 필드 구성
    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (semester !== undefined) updateFields.semester = semester;
    if (is_active !== undefined) updateFields.is_active = is_active;
    updateFields.updated_at = new Date();

    // 시간표 활성화 시 다른 시간표 비활성화
    if (is_active) {
      await supabase
        .from("timetables")
        .update({ is_active: false })
        .eq("user_id", userId)
        .neq("id", id);
    }

    // 시간표 업데이트
    const { data, error } = await supabase
      .from("timetables")
      .update(updateFields)
      .eq("id", id)
      .eq("user_id", userId)
      .select();

    if (error) {
      return NextResponse.json({ error: "시간표 업데이트 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    console.error("시간표 업데이트 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 시간표 삭제
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

    // URL 파라미터에서 시간표 ID 가져오기
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "시간표 ID가 필요합니다." }, { status: 400 });
    }

    // 시간표 소유자 확인
    const { data: timetable, error: timetableError } = await supabase
      .from("timetables")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (timetableError || !timetable) {
      return NextResponse.json({ error: "시간표를 찾을 수 없거나 접근 권한이 없습니다." }, { status: 404 });
    }

    // 시간표 삭제
    const { error } = await supabase
      .from("timetables")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: "시간표 삭제 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "시간표가 삭제되었습니다." });
  } catch (error) {
    console.error("시간표 삭제 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
