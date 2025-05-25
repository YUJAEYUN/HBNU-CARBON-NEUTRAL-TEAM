"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync, FaTimes } from 'react-icons/fa';

export default function PWAUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // 새로운 서비스 워커가 활성화되면 페이지 새로고침
        window.location.reload();
      });

      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 새로운 버전이 설치되었고 기존 버전이 실행 중일 때
                setWaitingWorker(newWorker);
                setShowUpdatePrompt(true);
              }
            });
          }
        });

        // 이미 대기 중인 서비스 워커가 있는지 확인
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowUpdatePrompt(true);
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // 대기 중인 서비스 워커에게 skipWaiting 메시지 전송
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdatePrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <AnimatePresence>
      {showUpdatePrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 left-4 right-4 z-50"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mx-auto max-w-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaSync className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">업데이트 가능</h3>
                  <p className="text-sm text-gray-600">새로운 버전이 있어요</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              더 나은 기능과 성능 개선이 포함된 새 버전으로 업데이트하세요!
            </p>

            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <FaSync />
                <span>업데이트</span>
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
              >
                나중에
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
