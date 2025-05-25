"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaApple, FaAndroid } from 'react-icons/fa';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
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
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS에서는 항상 설치 가능하다고 표시 (수동 설치)
    if (iOS && !standalone) {
      setCanInstall(true);
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
        setCanInstall(false);
      }
      
      setDeferredPrompt(null);
    } else if (isIOS) {
      // iOS 설치 안내 알림
      alert('iOS에서 설치하려면:\n1. Safari 공유 버튼 (↗️) 탭\n2. "홈 화면에 추가" 선택\n3. "추가" 버튼 탭');
    }
  };

  // 이미 설치되었거나 설치할 수 없는 경우 숨김
  if (isStandalone || !canInstall) {
    return null;
  }

  return (
    <motion.button
      onClick={handleInstallClick}
      className="w-full bg-gradient-to-r from-toss-green to-green-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-toss-green/90 hover:to-green-600/90 transition-all shadow-lg"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isIOS ? <FaApple /> : <FaAndroid />}
      <FaDownload />
      <span>앱으로 설치하기</span>
    </motion.button>
  );
}
