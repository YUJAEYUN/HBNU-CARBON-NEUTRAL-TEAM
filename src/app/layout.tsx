"use client";
import "./globals.css";
import NavBar from "@/components/Navbar";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import PWAUpdatePrompt from "@/components/PWAUpdatePrompt";
import { AuthProvider } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <title>C-nergy - 탄소중립 실천 앱</title>
        <meta name="description" content="일상 속 탄소중립 실천을 통해 지구를 지키고 보상도 받는 대학생 전용 앱" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

        {/* PWA 메타 태그 */}
        <meta name="application-name" content="C-nergy" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="C-nergy" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#22C55E" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#22C55E" />

        {/* 매니페스트 링크 */}
        <link rel="manifest" href="/manifest.json" />

        {/* 파비콘 및 아이콘 */}
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/icons/icon-32x32.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/icons/icon-16x16.svg" />
        <link rel="shortcut icon" href="/icons/favicon.svg" />

        {/* Apple 터치 아이콘 */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.svg" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.svg" />

        {/* Apple 스플래시 스크린 */}
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-2048-2732.jpg" sizes="2048x2732" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1668-2224.jpg" sizes="1668x2224" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1536-2048.jpg" sizes="1536x2048" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1125-2436.jpg" sizes="1125x2436" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1242-2208.jpg" sizes="1242x2208" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-750-1334.jpg" sizes="750x1334" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-640-1136.jpg" sizes="640x1136" />
      </head>
      <body className="bg-toss-gray-50 text-toss-gray-900 min-h-screen">
        <AuthProvider>
          {/* 토스 스타일 모바일 레이아웃 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md mx-auto h-full min-h-screen bg-toss-white relative flex flex-col pb-[4.5rem] shadow-toss-1"
          >
            <div className="flex-grow overflow-y-auto overflow-x-hidden">{children}</div>
            <NavBar />
            <PWAInstallPrompt />
            <PWAUpdatePrompt />
          </motion.div>
        </AuthProvider>
      </body>
    </html>
  );
}
