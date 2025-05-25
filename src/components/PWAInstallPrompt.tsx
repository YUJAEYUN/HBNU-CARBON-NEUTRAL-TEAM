"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaTimes, FaApple, FaAndroid } from 'react-icons/fa';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // iOS 감지
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // 이미 설치된 PWA인지 확인
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // beforeinstallprompt 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 이미 설치되지 않았고, 이전에 거부하지 않았다면 프롬프트 표시
      const hasDeclined = localStorage.getItem('pwa-install-declined');
      if (!hasDeclined && !standalone) {
        setTimeout(() => setShowPrompt(true), 1000); // 1초 후 표시 (더 빠르게)
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS에서는 수동으로 프롬프트 표시 (Safari에서 beforeinstallprompt 지원 안함)
    if (iOS && !standalone) {
      const hasDeclined = localStorage.getItem('pwa-install-declined');
      if (!hasDeclined) {
        setTimeout(() => setShowPrompt(true), 5000); // 5초 후 표시
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome에서 설치
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('PWA 설치됨');
      } else {
        localStorage.setItem('pwa-install-declined', 'true');
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (isIOS) {
      // iOS에서는 수동 설치 안내
      setShowPrompt(false);
      // iOS 설치 안내 모달 표시 (별도 구현 가능)
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-declined', 'true');
  };

  // 이미 설치되었거나 프롬프트를 표시하지 않는 경우
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 left-4 right-4 z-50"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mx-auto max-w-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-toss-green/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">C-nergy 설치</h3>
                  <p className="text-sm text-gray-600">홈 화면에 추가하기</p>
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
              앱을 홈 화면에 추가하면 더 빠르고 편리하게 이용할 수 있어요!
            </p>

            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-toss-green text-white py-2 px-4 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 hover:bg-toss-green/90 transition-colors"
              >
                {isIOS ? <FaApple /> : <FaAndroid />}
                <span>설치하기</span>
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
              >
                나중에
              </button>
            </div>

            {isIOS && (
              <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-800">
                  <strong>iOS 설치 방법:</strong><br />
                  Safari에서 공유 버튼 → "홈 화면에 추가" 선택
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
