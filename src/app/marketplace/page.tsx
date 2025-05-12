"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSearch, FaPlus, FaLeaf } from "react-icons/fa";
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

// 카테고리 타입 정의
type Category = "전체" | "의류" | "신발" | "책" | "가전" | "가구" | "기타";

export default function MarketplacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);

  // 카테고리 목록
  const categories: Category[] = ["전체", "의류", "신발", "책", "가전", "가구", "기타"];

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
        description: "3번 정도 신은 나이키 에어포스 1입니다. 사이즈 265, 상태 좋습니다.",
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
        description: "컴퓨터공학과 전공 교재입니다. 필기 없이 깨끗하게 사용했습니다.",
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
        description: "사이즈 100, 한 번도 안 입은 새 상품입니다.",
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
        description: "배터리 지속시간 약 6시간, 음질 좋은 블루투스 스피커입니다.",
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
        description: "자취방에서 사용하던 접이식 책상입니다. 상태 양호합니다.",
        location: "한밭대 후문",
        seller: "정지구",
        createdAt: "2023-05-06",
        carbonSaved: 5.2
      }
    ];

    // 데이터 로드 후 상태 업데이트
    setProducts(mockProducts);
    
    // 총 탄소 절감량 계산
    const total = mockProducts.reduce((sum, product) => sum + product.carbonSaved, 0);
    setTotalCarbonSaved(total);
    
    setLoading(false);
  }, []);

  // 카테고리 필터링
  const filteredProducts = products.filter(product => {
    // 검색어 필터링
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 카테고리 필터링
    const matchesCategory = selectedCategory === "전체" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // 로딩 상태 표시
  if (loading) {
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
            onClick={() => router.push("/")}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">중고장터</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
            <FaLeaf className="text-green-500 mr-1" />
            <span className="text-sm text-gray-700 font-medium">{totalCarbonSaved.toFixed(1)}kg 절감</span>
          </div>
        </div>
      </div>

      {/* 검색 바 */}
      <div className="p-4 bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="상품명, 설명으로 검색"
            className="ios-input pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="px-4 py-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`py-1.5 px-4 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="ios-card overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/marketplace/${product.id}`)}
              >
                <div className="relative h-40 bg-gray-200">
                  {/* 실제 구현에서는 이미지 경로 수정 필요 */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-4xl">{
                      product.category === "의류" ? "👕" :
                      product.category === "신발" ? "👟" :
                      product.category === "책" ? "📚" :
                      product.category === "가전" ? "🔌" :
                      product.category === "가구" ? "🪑" : "📦"
                    }</span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    <FaLeaf className="inline mr-1" />
                    {product.carbonSaved}kg 절감
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 truncate">{product.title}</h3>
                  <p className="text-primary font-bold mt-1">{product.price.toLocaleString()}원</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{product.location}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{product.condition}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
            <p className="text-sm text-gray-400">다른 검색어나 카테고리를 선택해보세요</p>
          </div>
        )}
      </div>

      {/* 상품 등록 버튼 (플로팅 버튼) */}
      <motion.button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push("/marketplace/new")}
      >
        <FaPlus size={20} />
      </motion.button>
    </div>
  );
}
