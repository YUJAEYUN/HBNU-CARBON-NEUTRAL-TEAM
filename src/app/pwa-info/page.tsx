"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaDownload, FaSync, FaWifi } from 'react-icons/fa';
import { MdSignalWifiOff } from 'react-icons/md';
import { usePWA } from '@/hooks/usePWA';

export default function PWAInfoPage() {
  const { isInstalled, isStandalone, isOnline, canInstall, isIOS, isAndroid } = usePWA();
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<string>('확인 중...');
  const [manifestStatus, setManifestStatus] = useState<string>('확인 중...');
  const [isHttps, setIsHttps] = useState<boolean>(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;

    // HTTPS 확인
    setIsHttps(window.location.protocol === 'https:');

    // Service Worker 상태 확인
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setServiceWorkerStatus('등록됨');
      }).catch(() => {
        setServiceWorkerStatus('등록 실패');
      });
    } else {
      setServiceWorkerStatus('지원되지 않음');
    }

    // Manifest 상태 확인
    fetch('/manifest.json')
      .then(response => {
        if (response.ok) {
          setManifestStatus('사용 가능');
        } else {
          setManifestStatus('로드 실패');
        }
      })
      .catch(() => {
        setManifestStatus('로드 실패');
      });
  }, []);

  const StatusItem = ({
    label,
    status,
    isGood
  }: {
    label: string;
    status: string;
    isGood: boolean;
  }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
      <span className="font-medium text-gray-900">{label}</span>
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${isGood ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </span>
        {isGood ? (
          <FaCheck className="text-green-600" />
        ) : (
          <FaTimes className="text-red-600" />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-toss-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📱</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PWA 상태</h1>
          <p className="text-gray-600">Progressive Web App 설정 확인</p>
        </div>

        {/* 현재 상태 */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">현재 상태</h2>
          <div className="space-y-3">
            <StatusItem
              label="PWA 설치됨"
              status={isInstalled ? "예" : "아니오"}
              isGood={isInstalled}
            />
            <StatusItem
              label="스탠드얼론 모드"
              status={isStandalone ? "예" : "아니오"}
              isGood={isStandalone}
            />
            <StatusItem
              label="설치 가능"
              status={canInstall ? "예" : "아니오"}
              isGood={canInstall}
            />
            <StatusItem
              label="온라인 상태"
              status={isOnline ? "온라인" : "오프라인"}
              isGood={isOnline}
            />
          </div>
        </div>

        {/* 플랫폼 정보 */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">플랫폼 정보</h2>
          <div className="space-y-3">
            <StatusItem
              label="iOS"
              status={isIOS ? "예" : "아니오"}
              isGood={isIOS}
            />
            <StatusItem
              label="Android"
              status={isAndroid ? "예" : "아니오"}
              isGood={isAndroid}
            />
          </div>
        </div>

        {/* 기술적 상태 */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">기술적 상태</h2>
          <div className="space-y-3">
            <StatusItem
              label="Service Worker"
              status={serviceWorkerStatus}
              isGood={serviceWorkerStatus === '등록됨'}
            />
            <StatusItem
              label="Web App Manifest"
              status={manifestStatus}
              isGood={manifestStatus === '사용 가능'}
            />
            <StatusItem
              label="HTTPS"
              status={isHttps ? "예" : "아니오"}
              isGood={isHttps}
            />
          </div>
        </div>

        {/* 네트워크 상태 */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            {isOnline ? <FaWifi className="text-green-600" /> : <MdSignalWifiOff className="text-red-600" />}
            <span>네트워크 상태</span>
          </h2>
          <div className="text-center">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? <FaWifi /> : <MdSignalWifiOff />}
              <span className="font-medium">
                {isOnline ? '온라인' : '오프라인'}
              </span>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          {canInstall && (
            <button className="w-full bg-toss-green text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-toss-green/90 transition-colors">
              <FaDownload />
              <span>앱 설치하기</span>
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <FaSync />
            <span>새로고침</span>
          </button>
        </div>

        {/* 도움말 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-bold text-blue-900 mb-2">PWA 설치 방법</h3>
          <div className="text-sm text-blue-800 space-y-1">
            {isIOS ? (
              <>
                <p><strong>iOS (Safari):</strong></p>
                <p>1. 공유 버튼 (↗️) 탭</p>
                <p>2. "홈 화면에 추가" 선택</p>
                <p>3. "추가" 버튼 탭</p>
              </>
            ) : (
              <>
                <p><strong>Android (Chrome):</strong></p>
                <p>1. 브라우저 메뉴 (⋮) 탭</p>
                <p>2. "홈 화면에 추가" 선택</p>
                <p>3. "설치" 버튼 탭</p>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
