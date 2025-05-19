'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const TabMenu = () => {
  const [activeTab, setActiveTab] = useState<string>("한식");
  
  // 메뉴 데이터 (실제로는 API에서 가져올 수 있음)
  const menuData = {
    "한식": [
      { name: "제육덮밥", price: "5,500원", description: "매콤한 제육볶음이 올라간 덮밥" },
      { name: "김치찌개", price: "5,500원", description: "돼지고기와 김치로 끓인 찌개" },
      { name: "된장찌개", price: "5,500원", description: "두부와 야채가 들어간 된장찌개" },
      { name: "비빔밥", price: "5,500원", description: "다양한 나물과 고추장이 들어간 비빔밥" }
    ],
    "양식": [
      { name: "오므라이스", price: "5,500원", description: "계란으로 감싼 볶음밥과 소스" },
      { name: "함박스테이크", price: "6,000원", description: "특제 소스를 곁들인 함박스테이크" },
      { name: "치킨까스", price: "5,500원", description: "바삭한 치킨까스와 소스" }
    ],
    "일품": [
      { name: "김치볶음밥", price: "5,000원", description: "김치와 햄이 들어간 볶음밥" },
      { name: "짜장면", price: "5,000원", description: "춘장 소스와 야채가 들어간 면요리" },
      { name: "우동", price: "5,000원", description: "일본식 우동면과 국물" }
    ]
  };

  return (
    <div>
      {/* 탭 버튼 */}
      <div className="flex border-b mb-4">
        {Object.keys(menuData).map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} 메뉴
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <motion.div
        key={activeTab}
        className="ios-card p-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className={`text-lg font-bold mb-4 border-b pb-2 ${
          activeTab === "한식" ? "text-primary" :
          activeTab === "양식" ? "text-blue-600" : "text-green-600"
        }`}>
          {activeTab} 메뉴
        </h2>
        
        <div className="space-y-3">
          {menuData[activeTab as keyof typeof menuData].map((item, index) => (
            <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <span className="text-sm font-medium">{item.price}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TabMenu;
