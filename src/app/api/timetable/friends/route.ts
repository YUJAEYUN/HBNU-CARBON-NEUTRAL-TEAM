import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';

// 친구 시간표 목록 조회
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
    const friendId = searchParams.get("friend_id");
    const timetableId = searchParams.get("timetable_id");

    // 특정 친구의 특정 시간표 조회
    if (friendId && timetableId) {
      const { data: timetable, error: timetableError } = await supabase
        .from("timetables")
        .select("*, timetable_classes(*)")
        .eq("id", timetableId)
        .eq("user_id", friendId)
        .single();

      if (timetableError) {
        return NextResponse.json({ error: "시간표를 찾을 수 없습니다." }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: timetable });
    }

    // 특정 친구의 모든 시간표 조회
    if (friendId) {
      const { data: timetables, error: timetablesError } = await supabase
        .from("timetables")
        .select("*")
        .eq("user_id", friendId)
        .order("created_at", { ascending: false });

      if (timetablesError) {
        return NextResponse.json({ error: "시간표 목록을 가져오는 중 오류가 발생했습니다." }, { status: 500 });
      }

      return NextResponse.json({ success: true, data: timetables });
    }

    // 모든 친구 목록 조회 (임의의 사용자들)
    const { data: friends, error: friendsError } = await supabase
      .from("profiles")
      .select("id, nickname, school")
      .neq("id", userId)
      .limit(5);

    if (friendsError) {
      return NextResponse.json({ error: "친구 목록을 가져오는 중 오류가 발생했습니다." }, { status: 500 });
    }

    // 각 친구의 활성화된 시간표 정보 가져오기
    const friendsWithTimetables = await Promise.all(
      friends.map(async (friend) => {
        const { data: timetables, error: timetablesError } = await supabase
          .from("timetables")
          .select("id, name, semester, is_active")
          .eq("user_id", friend.id)
          .eq("is_active", true)
          .limit(1);

        if (timetablesError || !timetables || timetables.length === 0) {
          return {
            ...friend,
            timetable: null
          };
        }

        return {
          ...friend,
          timetable: timetables[0]
        };
      })
    );

    return NextResponse.json({ success: true, data: friendsWithTimetables });
  } catch (error) {
    console.error("친구 시간표 조회 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
