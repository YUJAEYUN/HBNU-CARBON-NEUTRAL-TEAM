import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

// 즐겨찾기 학식 메뉴 목록 조회
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

    // 즐겨찾기 목록 조회
    const { data: favorites, error } = await supabase
      .from("hansik_favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "즐겨찾기 목록을 가져오는 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: favorites });
  } catch (error) {
    console.error("즐겨찾기 목록 조회 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 즐겨찾기 추가
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
    const { restaurant_name, menu_name, menu_type } = await request.json();

    if (!restaurant_name || !menu_name) {
      return NextResponse.json({ error: "식당 이름과 메뉴 이름이 필요합니다." }, { status: 400 });
    }

    // 이미 즐겨찾기에 있는지 확인
    const { data: existingFavorite, error: checkError } = await supabase
      .from("hansik_favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("restaurant_name", restaurant_name)
      .eq("menu_name", menu_name)
      .maybeSingle();

    if (existingFavorite) {
      return NextResponse.json({ error: "이미 즐겨찾기에 추가된 메뉴입니다." }, { status: 409 });
    }

    // 즐겨찾기 추가
    const { data, error } = await supabase
      .from("hansik_favorites")
      .insert([
        {
          user_id: userId,
          restaurant_name,
          menu_name,
          menu_type: menu_type || "중식" // 기본값은 중식
        }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: "즐겨찾기 추가 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error) {
    console.error("즐겨찾기 추가 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 즐겨찾기 삭제
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

    // URL 파라미터에서 즐겨찾기 ID 가져오기
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "즐겨찾기 ID가 필요합니다." }, { status: 400 });
    }

    // 즐겨찾기 소유자 확인
    const { data: favorite, error: favoriteError } = await supabase
      .from("hansik_favorites")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (favoriteError || !favorite) {
      return NextResponse.json({ error: "즐겨찾기를 찾을 수 없거나 접근 권한이 없습니다." }, { status: 404 });
    }

    // 즐겨찾기 삭제
    const { error } = await supabase
      .from("hansik_favorites")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: "즐겨찾기 삭제 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "즐겨찾기가 삭제되었습니다." });
  } catch (error) {
    console.error("즐겨찾기 삭제 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
