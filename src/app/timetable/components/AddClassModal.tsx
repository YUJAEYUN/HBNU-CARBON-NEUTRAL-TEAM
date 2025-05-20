'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ClassItem } from '../types';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  newClass: Partial<ClassItem>;
  setNewClass: (classItem: Partial<ClassItem>) => void;
  addClass: () => void;
}

const AddClassModal = ({
  isOpen,
  onClose,
  newClass,
  setNewClass,
  addClass
}: AddClassModalProps) => {
  // 시간 옵션
  const timeOptions = Array.from({ length: 10 }, (_, i) => i + 8); // 8시부터 17시까지

  // 요일 옵션
  const dayOptions = ["월", "화", "수", "목", "금"];

  // 색상 옵션
  const colorOptions = [
    "#FFD966", // 노랑
    "#9FC5E8", // 파랑
    "#F4CCCC", // 빨강
    "#F9CB9C", // 주황
    "#B6D7A8", // 초록
    "#D5A6BD"  // 보라
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50">
          {/* 배경 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto w-[375px] mx-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

            <h2 className="text-xl font-bold mb-4">수업 추가</h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                과목명
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="예: 자료구조"
                value={newClass.subject || ""}
                onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                장소
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="예: 공학관(302)"
                value={newClass.location || ""}
                onChange={(e) => setNewClass({ ...newClass, location: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                요일
              </label>
              <div className="flex space-x-2">
                {dayOptions.map((day) => (
                  <button
                    key={day}
                    className={`px-3 py-1 rounded-full ${
                      newClass.day === day
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setNewClass({ ...newClass, day })}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                시작 시간
              </label>
              <select
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newClass.startHour || 9}
                onChange={(e) => setNewClass({ ...newClass, startHour: parseInt(e.target.value) })}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}:00
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                종료 시간
              </label>
              <select
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newClass.endHour || 10}
                onChange={(e) => setNewClass({ ...newClass, endHour: parseInt(e.target.value) })}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}:00
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                색상
              </label>
              <div className="flex space-x-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full ${
                      newClass.color === color ? "ring-2 ring-gray-500" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewClass({ ...newClass, color })}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                onClick={onClose}
              >
                취소
              </button>
              <button
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                onClick={addClass}
              >
                추가
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddClassModal;
