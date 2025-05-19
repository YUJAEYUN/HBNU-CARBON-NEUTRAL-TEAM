import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

// 카풀 목록 조회
export async function GET(request: NextRequest) {
  try {
    // URL 파라미터 확인
    const { searchParams } = new URL(request.url);
    const carpoolId = searchParams.get("id");
    const carpoolType = searchParams.get("type");
    const myCarpool = searchParams.get("my") === "true";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // 특정 카풀 조회
    if (carpoolId) {
      const { data: carpool, error } = await supabase
        .from("carpools")
        .select("*, profiles!carpools_creator_id_fkey(id, nickname, school), carpool_participants(*, profiles(id, nickname, school))")
        .eq("id", carpoolId)
        .single();

      if (error) {
        return NextResponse.json({ error: "카풀을 찾을 수 없습니다." }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: carpool });
    }

    // 내 카풀 조회 (로그인 필요)
    if (myCarpool) {
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

      // 내가 생성한 카풀 또는 참여한 카풀 조회
      const { data: myCarpools, error: carpoolsError } = await supabase
        .from("carpools")
        .select("*, profiles!carpools_creator_id_fkey(id, nickname, school), carpool_participants(*, profiles(id, nickname, school))")
        .or(`creator_id.eq.${userId},carpool_participants.user_id.eq.${userId}`)
        .order("carpool_date", { ascending: true })
        .order("carpool_time", { ascending: true });

      if (carpoolsError) {
        return NextResponse.json({ error: "카풀 목록을 가져오는 중 오류가 발생했습니다." }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data: myCarpools,
        meta: {
          total: myCarpools.length
        }
      });
    }

    // 카풀 목록 쿼리 구성
    let query = supabase
      .from("carpools")
      .select("*, profiles!carpools_creator_id_fkey(id, nickname, school), carpool_participants(*, profiles(id, nickname, school))", { count: "exact" });

    // 카풀 유형 필터링
    if (carpoolType) {
      query = query.eq("carpool_type", carpoolType);
    }

    // 활성 상태 필터링
    query = query.eq("status", "active");

    // 페이지네이션 및 정렬
    query = query
      .order("carpool_date", { ascending: true })
      .order("carpool_time", { ascending: true })
      .range(offset, offset + limit - 1);

    // 쿼리 실행
    const { data: carpools, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "카풀 목록을 가져오는 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: carpools,
      meta: {
        total: count || 0,
        offset,
        limit,
        carpoolType: carpoolType || "전체"
      }
    });
  } catch (error) {
    console.error("카풀 목록 조회 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 카풀 등록
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
    const {
      departure,
      destination,
      carpool_date,
      carpool_time,
      max_participants,
      vehicle_type,
      trip_type,
      estimated_cost,
      carpool_type
    } = await request.json();

    if (!departure || !destination || !carpool_date || !carpool_time || !max_participants || !vehicle_type || !trip_type) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    // 탄소 절감량 계산 (실제로는 더 정교한 계산 필요)
    // 기본 계산: 참가자 수 * 0.5kg (1인당 평균 탄소 절감량)
    const co2Reduction = max_participants * 0.5;

    // 새 카풀 등록
    const { data: carpoolData, error: carpoolError } = await supabase
      .from("carpools")
      .insert([
        {
          creator_id: userId,
          departure,
          destination,
          carpool_date,
          carpool_time,
          max_participants,
          vehicle_type,
          trip_type,
          estimated_cost: estimated_cost || "",
          co2_reduction: parseFloat(co2Reduction.toFixed(1)),
          carpool_type: carpool_type || "일반",
          status: "active"
        }
      ])
      .select();

    if (carpoolError) {
      return NextResponse.json({ error: "카풀 등록 중 오류가 발생했습니다." }, { status: 500 });
    }

    // 생성자를 참가자로 자동 추가
    const carpoolId = carpoolData[0].id;
    const { error: participantError } = await supabase
      .from("carpool_participants")
      .insert([
        {
          carpool_id: carpoolId,
          user_id: userId,
          status: "확정"
        }
      ]);

    if (participantError) {
      console.error("참가자 추가 오류:", participantError);
      // 참가자 추가 실패해도 카풀 생성은 성공으로 처리
    }

    // 생성된 카풀 정보 반환
    const { data: carpool, error: getError } = await supabase
      .from("carpools")
      .select("*, profiles!carpools_creator_id_fkey(id, nickname, school), carpool_participants(*, profiles(id, nickname, school))")
      .eq("id", carpoolId)
      .single();

    if (getError) {
      return NextResponse.json({ success: true, data: carpoolData[0] }, { status: 201 });
    }

    return NextResponse.json({ success: true, data: carpool }, { status: 201 });
  } catch (error) {
    console.error("카풀 등록 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 카풀 정보 수정
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
    const {
      id,
      departure,
      destination,
      carpool_date,
      carpool_time,
      max_participants,
      vehicle_type,
      trip_type,
      estimated_cost,
      status
    } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "카풀 ID가 필요합니다." }, { status: 400 });
    }

    // 카풀 소유자 확인
    const { data: carpool, error: carpoolError } = await supabase
      .from("carpools")
      .select("*")
      .eq("id", id)
      .eq("creator_id", userId)
      .single();

    if (carpoolError || !carpool) {
      return NextResponse.json({ error: "카풀을 찾을 수 없거나 접근 권한이 없습니다." }, { status: 404 });
    }

    // 업데이트할 필드 구성
    const updateFields: any = {};
    if (departure !== undefined) updateFields.departure = departure;
    if (destination !== undefined) updateFields.destination = destination;
    if (carpool_date !== undefined) updateFields.carpool_date = carpool_date;
    if (carpool_time !== undefined) updateFields.carpool_time = carpool_time;
    if (max_participants !== undefined) updateFields.max_participants = max_participants;
    if (vehicle_type !== undefined) updateFields.vehicle_type = vehicle_type;
    if (trip_type !== undefined) updateFields.trip_type = trip_type;
    if (estimated_cost !== undefined) updateFields.estimated_cost = estimated_cost;
    if (status !== undefined) updateFields.status = status;
    updateFields.updated_at = new Date();

    // 카풀 정보 업데이트
    const { data, error } = await supabase
      .from("carpools")
      .update(updateFields)
      .eq("id", id)
      .eq("creator_id", userId)
      .select();

    if (error) {
      return NextResponse.json({ error: "카풀 정보 업데이트 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    console.error("카풀 정보 업데이트 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 카풀 삭제
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

    // URL 파라미터에서 카풀 ID 가져오기
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "카풀 ID가 필요합니다." }, { status: 400 });
    }

    // 카풀 소유자 확인
    const { data: carpool, error: carpoolError } = await supabase
      .from("carpools")
      .select("*")
      .eq("id", id)
      .eq("creator_id", userId)
      .single();

    if (carpoolError || !carpool) {
      return NextResponse.json({ error: "카풀을 찾을 수 없거나 접근 권한이 없습니다." }, { status: 404 });
    }

    // 카풀 삭제 (실제로는 상태만 변경)
    const { error } = await supabase
      .from("carpools")
      .update({ status: "deleted", updated_at: new Date() })
      .eq("id", id)
      .eq("creator_id", userId);

    if (error) {
      return NextResponse.json({ error: "카풀 삭제 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "카풀이 삭제되었습니다." });
  } catch (error) {
    console.error("카풀 삭제 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
