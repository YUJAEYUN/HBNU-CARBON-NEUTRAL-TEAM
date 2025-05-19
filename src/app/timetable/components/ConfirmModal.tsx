'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-[200]">
          {/* 배경 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            className="relative bg-white rounded-xl p-5 w-[280px] mx-auto z-[201]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-sm font-medium mb-3">{message}</h3>

            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-1.5 bg-gray-200 rounded-md text-gray-700 text-sm"
                onClick={onCancel}
              >
                취소
              </button>
              <button
                className="px-3 py-1.5 bg-red-500 rounded-md text-white text-sm"
                onClick={onConfirm}
              >
                확인
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
