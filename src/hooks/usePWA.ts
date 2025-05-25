"use client";
import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  canInstall: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export function usePWA(): PWAState {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isStandalone: false,
    isOnline: true,
    canInstall: false,
    isIOS: false,
    isAndroid: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 플랫폼 감지
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    // 스탠드얼론 모드 감지 (PWA로 설치되어 실행 중인지)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;

    // 온라인 상태
    const isOnline = navigator.onLine;

    // 초기 상태 설정
    setPwaState(prev => ({
      ...prev,
      isStandalone,
      isOnline,
      isIOS,
      isAndroid,
      isInstalled: isStandalone,
    }));

    // beforeinstallprompt 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaState(prev => ({ ...prev, canInstall: true }));
    };

    // 온라인/오프라인 상태 변경 리스너
    const handleOnline = () => {
      setPwaState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setPwaState(prev => ({ ...prev, isOnline: false }));
    };

    // 앱이 설치되었을 때 (beforeinstallprompt가 더 이상 발생하지 않음)
    const handleAppInstalled = () => {
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        canInstall: false 
      }));
    };

    // 이벤트 리스너 등록
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 정리 함수
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return pwaState;
}

// PWA 설치 함수
export function installPWA(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    // beforeinstallprompt 이벤트가 저장되어 있는지 확인
    const deferredPrompt = (window as any).deferredPrompt;
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA 설치됨');
          resolve(true);
        } else {
          console.log('PWA 설치 거부됨');
          resolve(false);
        }
        (window as any).deferredPrompt = null;
      });
    } else {
      resolve(false);
    }
  });
}

// 네트워크 상태 확인
export function getNetworkStatus(): {
  isOnline: boolean;
  connectionType?: string;
  effectiveType?: string;
} {
  if (typeof window === 'undefined') {
    return { isOnline: true };
  }

  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;

  return {
    isOnline: navigator.onLine,
    connectionType: connection?.type,
    effectiveType: connection?.effectiveType,
  };
}
