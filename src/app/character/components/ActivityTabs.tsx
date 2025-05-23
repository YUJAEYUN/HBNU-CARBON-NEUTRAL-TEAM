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
      {/* 활동량 표시 - 탭 버튼 */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between mb-4">
          <button
            className={`flex-1 py-2 px-4 text-center rounded-l-lg font-medium ${activeTab === "daily" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
            onClick={() => setActiveTab("daily")}
          >
            오늘
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === "weekly" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
            onClick={() => setActiveTab("weekly")}
          >
            이번주
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center rounded-r-lg font-medium ${activeTab === "monthly" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
            onClick={() => setActiveTab("monthly")}
          >
            이번달
          </button>
        </div>
      </div>

      {/* 활동 결과 - 선택된 탭에 따라 다른 내용 표시 */}
      <motion.div
        className="w-full max-w-xs ios-card p-4 mb-28"
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-gray-800 font-bold mb-3">{ACTIVITY_DATA[activeTab].title}</h2>
        <div className="space-y-2">
          {ACTIVITY_DATA[activeTab].items.map((item) => (
            <div key={`${activeTab}-${item.label}`} className="flex justify-between">
              <span className="text-gray-700">{item.label}:</span>
              <span className="text-primary-dark font-medium">{item.value}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
            <span className="text-primary-dark font-bold">총 절감량:</span>
            <span className="text-primary-dark font-bold">{ACTIVITY_DATA[activeTab].total}</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
