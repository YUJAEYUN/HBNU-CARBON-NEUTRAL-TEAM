import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

// 중고장터 상품 목록 조회
export async function GET(request: NextRequest) {
  try {
    // URL 파라미터 확인
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");
    const category = searchParams.get("category");
    const searchTerm = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // 특정 상품 조회
    if (productId) {
      const { data: product, error } = await supabase
        .from("marketplace_products")
        .select("*, profiles(id, nickname, school)")
        .eq("id", productId)
        .single();

      if (error) {
        return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: product });
    }

    // 상품 목록 쿼리 구성
    let query = supabase
      .from("marketplace_products")
      .select("*, profiles(id, nickname, school)", { count: "exact" });

    // 카테고리 필터링
    if (category && category !== "전체") {
      query = query.eq("category", category);
    }

    // 검색어 필터링
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // 페이지네이션 및 정렬
    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // 쿼리 실행
    const { data: products, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "상품 목록을 가져오는 중 오류가 발생했습니다." }, { status: 500 });
    }

    // 총 탄소 절감량 계산
    const totalCarbonSaved = products.reduce((sum, product) => sum + (product.carbon_saved || 0), 0);

    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        total: count || 0,
        totalCarbonSaved,
        offset,
        limit,
        category: category || "전체",
        searchTerm: searchTerm || ""
      }
    });
  } catch (error) {
    console.error("상품 목록 조회 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 중고장터 상품 등록
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
    const { title, price, description, category, condition, image_url } = await request.json();

    if (!title || !price || !description || !category) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    // 카테고리별 탄소 절감량 계산 (실제로는 더 정교한 계산 필요)
    let carbonSaved = 0;
    switch (category) {
      case "의류":
        carbonSaved = 3.5;
        break;
      case "신발":
        carbonSaved = 4.2;
        break;
      case "책":
        carbonSaved = 1.8;
        break;
      case "가전":
        carbonSaved = 8.5;
        break;
      case "가구":
        carbonSaved = 12.0;
        break;
      default:
        carbonSaved = 2.5;
    }

    // 상품 상태에 따른 조정
    if (condition === "새상품") {
      carbonSaved *= 0.8; // 새 상품은 탄소 절감 효과 감소
    } else if (condition === "중고") {
      carbonSaved *= 1.0; // 기본값
    } else if (condition === "오래됨") {
      carbonSaved *= 1.2; // 오래된 상품일수록 재사용 가치 증가
    }

    // 새 상품 등록
    const { data, error } = await supabase
      .from("marketplace_products")
      .insert([
        {
          seller_id: userId,
          title,
          price,
          description,
          category,
          condition: condition || "중고",
          image_url: image_url || null,
          carbon_saved: parseFloat(carbonSaved.toFixed(1)),
          status: "판매중"
        }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: "상품 등록 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error) {
    console.error("상품 등록 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 상품 정보 수정
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
    const { id, title, price, description, category, condition, image_url, status } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "상품 ID가 필요합니다." }, { status: 400 });
    }

    // 상품 소유자 확인
    const { data: product, error: productError } = await supabase
      .from("marketplace_products")
      .select("*")
      .eq("id", id)
      .eq("seller_id", userId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "상품을 찾을 수 없거나 접근 권한이 없습니다." }, { status: 404 });
    }

    // 업데이트할 필드 구성
    const updateFields: any = {};
    if (title !== undefined) updateFields.title = title;
    if (price !== undefined) updateFields.price = price;
    if (description !== undefined) updateFields.description = description;
    if (category !== undefined) updateFields.category = category;
    if (condition !== undefined) updateFields.condition = condition;
    if (image_url !== undefined) updateFields.image_url = image_url;
    if (status !== undefined) updateFields.status = status;
    updateFields.updated_at = new Date();

    // 상품 정보 업데이트
    const { data, error } = await supabase
      .from("marketplace_products")
      .update(updateFields)
      .eq("id", id)
      .eq("seller_id", userId)
      .select();

    if (error) {
      return NextResponse.json({ error: "상품 정보 업데이트 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    console.error("상품 정보 업데이트 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 상품 삭제
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

    // URL 파라미터에서 상품 ID 가져오기
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "상품 ID가 필요합니다." }, { status: 400 });
    }

    // 상품 소유자 확인
    const { data: product, error: productError } = await supabase
      .from("marketplace_products")
      .select("*")
      .eq("id", id)
      .eq("seller_id", userId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "상품을 찾을 수 없거나 접근 권한이 없습니다." }, { status: 404 });
    }

    // 상품 삭제
    const { error } = await supabase
      .from("marketplace_products")
      .delete()
      .eq("id", id)
      .eq("seller_id", userId);

    if (error) {
      return NextResponse.json({ error: "상품 삭제 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "상품이 삭제되었습니다." });
  } catch (error) {
    console.error("상품 삭제 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
