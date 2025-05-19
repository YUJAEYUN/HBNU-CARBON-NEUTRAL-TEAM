"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaHeart, FaRegHeart, FaLeaf, FaShare, FaComment } from "react-icons/fa";
import Image from "next/image";

// 상품 타입 정의
interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  image: string;
  description: string;
  location: string;
  seller: string;
  createdAt: string;
  carbonSaved: number; // 탄소 절감량 (kg)
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [liked, setLiked] = useState(false);

  // 목업 데이터 로드
  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const mockProducts: Product[] = [
      {
        id: "1",
        title: "나이키 에어포스 1",
        price: 50000,
        category: "신발",
        condition: "거의 새 것",
        image: "/products/shoes1.jpg",
        description: "3번 정도 신은 나이키 에어포스 1입니다. 사이즈 265, 상태 좋습니다. 직거래 우선이며, 택배 거래도 가능합니다. 문의사항은 채팅으로 부탁드립니다.",
        location: "한밭대 기숙사",
        seller: "김탄소",
        createdAt: "2023-05-10",
        carbonSaved: 2.3
      },
      {
        id: "2",
        title: "자바 프로그래밍 교재",
        price: 15000,
        category: "책",
        condition: "중고",
        image: "/products/book1.jpg",
        description: "컴퓨터공학과 전공 교재입니다. 필기 없이 깨끗하게 사용했습니다. 학교 도서관에서 거래 가능합니다.",
        location: "한밭대 도서관",
        seller: "이그린",
        createdAt: "2023-05-09",
        carbonSaved: 1.2
      },
      {
        id: "3",
        title: "유니클로 히트텍 맨투맨",
        price: 20000,
        category: "의류",
        condition: "새 것",
        image: "/products/clothes1.jpg",
        description: "사이즈 100, 한 번도 안 입은 새 상품입니다. 직거래만 가능하며, 정문에서 만나서 거래하길 원합니다.",
        location: "한밭대 정문",
        seller: "박에코",
        createdAt: "2023-05-08",
        carbonSaved: 1.8
      },
      {
        id: "4",
        title: "미니 블루투스 스피커",
        price: 30000,
        category: "가전",
        condition: "중고",
        image: "/products/electronics1.jpg",
        description: "배터리 지속시간 약 6시간, 음질 좋은 블루투스 스피커입니다. 충전기 포함이며, 박스는 없습니다.",
        location: "한밭대 공학관",
        seller: "최친환",
        createdAt: "2023-05-07",
        carbonSaved: 3.5
      },
      {
        id: "5",
        title: "접이식 책상",
        price: 40000,
        category: "가구",
        condition: "중고",
        image: "/products/furniture1.jpg",
        description: "자취방에서 사용하던 접이식 책상입니다. 상태 양호합니다. 직접 가지러 오실 수 있는 분만 연락주세요.",
        location: "한밭대 후문",
        seller: "정지구",
        createdAt: "2023-05-06",
        carbonSaved: 5.2
      }
    ];

    // 현재 ID에 해당하는 상품 찾기
    const foundProduct = mockProducts.find(p => p.id === params.id);

    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // 상품이 없으면 목록 페이지로 리다이렉트
      router.push("/marketplace");
    }

    setLoading(false);
  }, [params.id, router]);

  // 좋아요 토글
  const toggleLike = () => {
    setLiked(!liked);
  };

  // 공유하기
  const shareProduct = () => {
    // 실제 구현에서는 공유 API 사용
    alert("공유 기능은 준비 중입니다.");
  };

  // 채팅하기
  const startChat = () => {
    // 실제 구현에서는 채팅 페이지로 이동
    alert("채팅 기능은 준비 중입니다.");
  };

  // 로딩 상태 표시
  if (loading || !product) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 - iOS 스타일 */}
      <div className="ios-header sticky top-0 z-10">
        <div className="flex items-center">
          <button
            className="text-gray-500 mr-2"
            onClick={() => router.push("/marketplace")}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">상품 상세</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleLike}>
            {liked ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-500" />
            )}
          </button>
          <button onClick={shareProduct}>
            <FaShare className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* 상품 상세 정보 */}
      <div className="flex-1 overflow-y-auto">
        {/* 상품 이미지 */}
        <div className="relative h-80 bg-gray-200">
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-8xl">{
              product.category === "의류" ? "👕" :
              product.category === "신발" ? "👟" :
              product.category === "책" ? "📚" :
              product.category === "가전" ? "🔌" :
              product.category === "가구" ? "🪑" : "📦"
            }</span>
          </div>
          <div className="absolute bottom-4 right-4 bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
            <FaLeaf className="inline mr-1" />
            탄소 {product.carbonSaved}kg 절감
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">{product.title}</h2>
            <p className="text-2xl font-bold text-primary mt-1">{product.price.toLocaleString()}원</p>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">{product.category}</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">{product.condition}</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">{product.location}</span>
          </div>

          <div className="border-t border-b py-4 mb-4">
            <h3 className="font-medium text-gray-800 mb-2">상품 설명</h3>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-2">판매자 정보</h3>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-lg">{product.seller.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{product.seller}</p>
                <p className="text-xs text-gray-500">판매 상품 5개 • 평점 4.8</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-2">탄소 절감 효과</h3>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <FaLeaf className="text-green-500 mr-2" />
                <p className="font-medium text-green-800">이 상품을 중고로 구매하면</p>
              </div>
              <p className="text-green-700">
                약 <span className="font-bold text-lg">{product.carbonSaved}kg</span>의 탄소 배출을 절감할 수 있어요!
              </p>
              <p className="text-xs text-green-600 mt-2">
                (30년생 소나무 {Math.round(product.carbonSaved / 0.5)}그루가 1일 동안 흡수하는 양)
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-400 mb-20">
            <p>등록일: {product.createdAt}</p>
            <p>상품 ID: {product.id}</p>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-[76px] left-1/2 transform -translate-x-1/2 w-full max-w-[375px] bg-white border-t p-3 flex items-center space-x-3">
        <motion.button
          className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-xl font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startChat}
        >
          <FaComment className="inline mr-2" />
          채팅하기
        </motion.button>
        <motion.button
          className="flex-1 py-3 bg-primary text-white rounded-xl font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => alert("구매 기능은 준비 중입니다.")}
        >
          구매하기
        </motion.button>
      </div>
    </div>
  );
}
