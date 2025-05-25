"use client";
import { motion } from "framer-motion";
import { ACTIVITY_DATA, ActivityTabType } from "../constants";

interface ActivityTabsProps {
  activeTab: ActivityTabType;
  setActiveTab: (tab: ActivityTabType) => void;
}

export default function ActivityTabs({ activeTab, setActiveTab }: ActivityTabsProps) {
  return (
    <>
      {/* 활동량 표시 - 토스 스타일 탭 버튼 */}
      <div className="w-full max-w-xs mb-6">
        <div className="flex bg-toss-gray-100 p-1 rounded-xl">
          <button
            className={`flex-1 py-2 px-3 text-center rounded-lg font-medium text-sm transition-all ${
              activeTab === "daily"
                ? "bg-white text-toss-gray-900 shadow-toss-1"
                : "text-toss-gray-600 hover:text-toss-gray-800"
            }`}
            onClick={() => setActiveTab("daily")}
          >
            오늘
          </button>
          <button
            className={`flex-1 py-2 px-3 text-center rounded-lg font-medium text-sm transition-all ${
              activeTab === "weekly"
                ? "bg-white text-toss-gray-900 shadow-toss-1"
                : "text-toss-gray-600 hover:text-toss-gray-800"
            }`}
            onClick={() => setActiveTab("weekly")}
          >
            이번주
          </button>
          <button
            className={`flex-1 py-2 px-3 text-center rounded-lg font-medium text-sm transition-all ${
              activeTab === "monthly"
                ? "bg-white text-toss-gray-900 shadow-toss-1"
                : "text-toss-gray-600 hover:text-toss-gray-800"
            }`}
            onClick={() => setActiveTab("monthly")}
          >
            이번달
          </button>
        </div>
      </div>

      {/* 활동 결과 - 토스 스타일 카드 */}
      <motion.div
        className="w-full max-w-xs bg-white rounded-2xl p-5 shadow-toss-2 border border-toss-gray-200 mb-4"
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-toss-gray-900 font-bold mb-4 text-lg">{ACTIVITY_DATA[activeTab].title}</h2>
        <div className="space-y-3">
          {ACTIVITY_DATA[activeTab].items.map((item) => (
            <div key={`${activeTab}-${item.label}`} className="flex justify-between items-center">
              <span className="text-toss-gray-700">{item.label}:</span>
              <span className="text-toss-green font-medium">{item.value}</span>
            </div>
          ))}
          <div className="flex justify-between items-center border-t border-toss-gray-200 pt-3 mt-3">
            <span className="text-toss-gray-900 font-bold">총 절감량:</span>
            <span className="text-toss-green font-bold text-lg">{ACTIVITY_DATA[activeTab].total}</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
