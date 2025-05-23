"use client";
import "./globals.css";
import NavBar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="bg-gray-100 text-gray-900 flex justify-center items-center min-h-screen p-4">
        <AuthProvider>
          {/* 모바일 화면 크기 고정 - iOS 스타일 적용 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[375px] h-[812px] bg-white shadow-ios relative flex flex-col"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              borderRadius: "38px" // iOS 스타일 둥근 모서리
            }}
          >
            {/* 상태 표시줄 */}
            <div className="h-6 w-full bg-white z-50"></div>

            {/* 노치 (iPhone 스타일) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl z-50"></div>

            <div className="flex-grow overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100% - 83px)' }}>{children}</div>
            <NavBar /> {/* 네비게이션 바는 Navbar 컴포넌트 내에서 로그인 상태에 따라 표시 여부 결정 */}
          </motion.div>
        </AuthProvider>
      </body>
    </html>
  );
}
