"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCamera, FaLeaf, FaInfoCircle } from "react-icons/fa";

// 카테고리 타입 정의
type Category = "의류" | "신발" | "책" | "가전" | "가구" | "기타";

// 상품 상태 타입 정의
type Condition = "새 것" | "거의 새 것" | "중고" | "오래됨";

export default function NewProductPage() {
  const router = useRouter();
  
  // 상품 정보 상태
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Category>("의류");
  const [condition, setCondition] = useState<Condition>("중고");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  
  // 탄소 절감량 계산 관련 상태
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [showCarbonInfo, setShowCarbonInfo] = useState(false);
  
  // 카테고리 목록
  const categories: Category[] = ["의류", "신발", "책", "가전", "가구", "기타"];
  
  // 상품 상태 목록
  const conditions: Condition[] = ["새 것", "거의 새 것", "중고", "오래됨"];
  
  // 카테고리 변경 시 탄소 절감량 계산
  useEffect(() => {
    calculateCarbonSaving();
  }, [category, condition]);
  
  // 탄소 절감량 계산 함수
  const calculateCarbonSaving = () => {
    // 카테고리별 기본 탄소 절감량 (kg)
    const baseCarbonSavings = {
      "의류": 2.0,
      "신발": 2.5,
      "책": 1.2,
      "가전": 4.0,
      "가구": 5.0,
      "기타": 1.0
    };
    
    // 상품 상태에 따른 계수
    const conditionMultiplier = {
      "새 것": 0.9,
      "거의 새 것": 0.8,
      "중고": 0.7,
      "오래됨": 0.5
    };
    
    // 탄소 절감량 계산
    const baseSaving = baseCarbonSavings[category];
    const multiplier = conditionMultiplier[condition];
    const calculatedSaving = baseSaving * multiplier;
    
    setCarbonSaved(parseFloat(calculatedSaving.toFixed(1)));
  };
  
  // 상품 등록 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 입력값 검증
    if (!title || !price || !description || !location) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }
    
    // 실제 구현에서는 API 호출로 상품 등록
    console.log({
      title,
      price: parseInt(price),
      category,
      condition,
      description,
      location,
      carbonSaved
    });
    
    // 등록 성공 메시지
    alert("상품이 등록되었습니다!");
    
    // 목록 페이지로 이동
    router.push("/marketplace");
  };
  
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
          <h1 className="text-xl font-semibold text-gray-800">상품 등록</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center bg-green-100 rounded-full px-3 py-1">
            <FaLeaf className="text-green-500 mr-1" />
            <span className="text-sm text-green-700 font-medium">{carbonSaved}kg 절감</span>
            <button 
              className="ml-1 text-green-600"
              onClick={() => setShowCarbonInfo(!showCarbonInfo)}
            >
              <FaInfoCircle size={14} />
            </button>
          </div>
        </div>
      </div>
      
      {/* 탄소 절감량 정보 모달 */}
      {showCarbonInfo && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowCarbonInfo(false)}
        >
          <motion.div 
            className="bg-white rounded-xl p-5 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-3">탄소 절감량 계산 방식</h3>
            <p className="text-gray-600 mb-4">
              중고 거래를 통해 새 제품 생산 시 발생하는 탄소 배출량을 절감할 수 있습니다.
              카테고리별 기본 탄소 절감량에 상품 상태를 고려하여 계산됩니다.
            </p>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">카테고리별 기본 절감량</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>의류: 2.0kg</li>
                <li>신발: 2.5kg</li>
                <li>책: 1.2kg</li>
                <li>가전: 4.0kg</li>
                <li>가구: 5.0kg</li>
                <li>기타: 1.0kg</li>
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">상태별 계수</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>새 것: 0.9</li>
                <li>거의 새 것: 0.8</li>
                <li>중고: 0.7</li>
                <li>오래됨: 0.5</li>
              </ul>
            </div>
            <button 
              className="w-full py-2 bg-primary text-white rounded-lg font-medium"
              onClick={() => setShowCarbonInfo(false)}
            >
              확인
            </button>
          </motion.div>
        </motion.div>
      )}
      
      {/* 상품 등록 폼 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이미지 업로드 영역 */}
          <div className="bg-gray-100 h-60 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                <FaCamera className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 text-sm">이미지를 업로드하세요</p>
              <p className="text-gray-400 text-xs mt-1">최대 5장까지 가능</p>
            </div>
          </div>
          
          {/* 상품명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상품명 *</label>
            <input
              type="text"
              className="ios-input"
              placeholder="상품명을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          {/* 가격 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가격 *</label>
            <div className="relative">
              <input
                type="number"
                className="ios-input pr-12"
                placeholder="가격을 입력하세요"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">원</span>
            </div>
          </div>
          
          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    category === cat
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* 상품 상태 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상품 상태 *</label>
            <div className="grid grid-cols-4 gap-2">
              {conditions.map((cond) => (
                <button
                  key={cond}
                  type="button"
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    condition === cond
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setCondition(cond)}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>
          
          {/* 상품 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상품 설명 *</label>
            <textarea
              className="ios-input min-h-[100px]"
              placeholder="상품에 대한 설명을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          {/* 거래 장소 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">거래 장소 *</label>
            <input
              type="text"
              className="ios-input"
              placeholder="거래 희망 장소를 입력하세요"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          {/* 등록 버튼 */}
          <motion.button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-xl font-medium text-lg mt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            상품 등록하기
          </motion.button>
        </form>
      </div>
    </div>
  );
}
