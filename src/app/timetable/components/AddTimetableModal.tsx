'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Timetable } from '../types';

interface AddTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTimetable: Partial<Timetable>;
  setNewTimetable: (timetable: Partial<Timetable>) => void;
  addTimetable: () => void;
}

const AddTimetableModal = ({
  isOpen,
  onClose,
  newTimetable,
  setNewTimetable,
  addTimetable
}: AddTimetableModalProps) => {
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

            <h2 className="text-xl font-bold mb-4">새 시간표 추가</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                시간표 이름
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="예: 환경 지키미"
                value={newTimetable.name || ""}
                onChange={(e) => setNewTimetable({ ...newTimetable, name: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                학기
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="예: 2025년 1학기"
                value={newTimetable.semester || ""}
                onChange={(e) => setNewTimetable({ ...newTimetable, semester: e.target.value })}
              />
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
                onClick={addTimetable}
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

export default AddTimetableModal;
