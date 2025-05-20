import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

// 카풀 참가 신청
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
    const { carpool_id } = await request.json();

    if (!carpool_id) {
      return NextResponse.json({ error: "카풀 ID가 필요합니다." }, { status: 400 });
    }

    // 카풀 정보 확인
    const { data: carpool, error: carpoolError } = await supabase
      .from("carpools")
      .select("*, carpool_participants(*)")
      .eq("id", carpool_id)
      .eq("status", "active")
      .single();

    if (carpoolError || !carpool) {
      return NextResponse.json({ error: "카풀을 찾을 수 없습니다." }, { status: 404 });
    }

    // 이미 참가 신청한 경우 확인
    const alreadyJoined = carpool.carpool_participants.some(
      (participant: any) => participant.user_id === userId
    );

    if (alreadyJoined) {
      return NextResponse.json({ error: "이미 참가 신청한 카풀입니다." }, { status: 409 });
    }

    // 참가자 수 확인
    if (carpool.carpool_participants.length >= carpool.max_participants) {
      return NextResponse.json({ error: "카풀 정원이 가득 찼습니다." }, { status: 409 });
    }

    // 참가 신청
    const { data, error } = await supabase
      .from("carpool_participants")
      .insert([
        {
          carpool_id,
          user_id: userId,
          status: "대기중" // 기본 상태는 대기중
        }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: "참가 신청 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error) {
    console.error("참가 신청 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 참가 상태 변경 (확정/취소)
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
    const { id, status, participant_id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "참가 ID가 필요합니다." }, { status: 400 });
    }

    if (!status || !["확정", "대기중", "취소"].includes(status)) {
      return NextResponse.json({ error: "유효한 상태가 필요합니다." }, { status: 400 });
    }

    // 참가 정보 확인
    const { data: participant, error: participantError } = await supabase
      .from("carpool_participants")
      .select("*, carpools(*)")
      .eq("id", id)
      .single();

    if (participantError || !participant) {
      return NextResponse.json({ error: "참가 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // 권한 확인 (본인 또는 카풀 생성자만 변경 가능)
    const isCreator = participant.carpools.creator_id === userId;
    const isParticipant = participant.user_id === userId;

    if (!isCreator && !isParticipant) {
      return NextResponse.json({ error: "참가 상태를 변경할 권한이 없습니다." }, { status: 403 });
    }

    // 카풀 생성자가 아닌 경우, 본인의 참가 상태만 '취소'로 변경 가능
    if (!isCreator && status !== "취소") {
      return NextResponse.json({ error: "본인의 참가 상태는 취소만 가능합니다." }, { status: 403 });
    }

    // 참가 상태 업데이트
    const { data, error } = await supabase
      .from("carpool_participants")
      .update({ status, updated_at: new Date() })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: "참가 상태 변경 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    console.error("참가 상태 변경 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 참가 취소
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

    // URL 파라미터에서 참가 ID 가져오기
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const carpoolId = searchParams.get("carpool_id");

    // ID 또는 카풀 ID로 조회
    if (!id && !carpoolId) {
      return NextResponse.json({ error: "참가 ID 또는 카풀 ID가 필요합니다." }, { status: 400 });
    }

    // ID로 조회하는 경우
    if (id) {
      // 참가 정보 확인
      const { data: participant, error: participantError } = await supabase
        .from("carpool_participants")
        .select("*, carpools(*)")
        .eq("id", id)
        .single();

      if (participantError || !participant) {
        return NextResponse.json({ error: "참가 정보를 찾을 수 없습니다." }, { status: 404 });
      }

      // 권한 확인 (본인 또는 카풀 생성자만 삭제 가능)
      const isCreator = participant.carpools.creator_id === userId;
      const isParticipant = participant.user_id === userId;

      if (!isCreator && !isParticipant) {
        return NextResponse.json({ error: "참가 정보를 삭제할 권한이 없습니다." }, { status: 403 });
      }

      // 참가 정보 삭제
      const { error } = await supabase
        .from("carpool_participants")
        .delete()
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: "참가 취소 중 오류가 발생했습니다." }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "참가가 취소되었습니다." });
    }

    // 카풀 ID로 조회하는 경우 (본인의 참가만 취소)
    if (carpoolId) {
      // 참가 정보 확인
      const { data: participant, error: participantError } = await supabase
        .from("carpool_participants")
        .select("*")
        .eq("carpool_id", carpoolId)
        .eq("user_id", userId)
        .single();

      if (participantError || !participant) {
        return NextResponse.json({ error: "참가 정보를 찾을 수 없습니다." }, { status: 404 });
      }

      // 참가 정보 삭제
      const { error } = await supabase
        .from("carpool_participants")
        .delete()
        .eq("carpool_id", carpoolId)
        .eq("user_id", userId);

      if (error) {
        return NextResponse.json({ error: "참가 취소 중 오류가 발생했습니다." }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "참가가 취소되었습니다." });
    }

    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  } catch (error) {
    console.error("참가 취소 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
