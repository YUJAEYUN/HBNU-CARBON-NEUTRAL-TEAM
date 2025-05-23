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
      <body className="bg-white text-gray-900 min-h-screen">
        <AuthProvider>
          {/* 반응형 레이아웃 - 모든 화면 크기에 맞게 조정 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md mx-auto h-full min-h-screen bg-white relative flex flex-col pb-[4.5rem]"
          >
            <div className="flex-grow overflow-y-auto overflow-x-hidden">{children}</div>
            <NavBar /> {/* 네비게이션 바는 Navbar 컴포넌트 내에서 로그인 상태에 따라 표시 여부 결정 */}
          </motion.div>
        </AuthProvider>
      </body>
    </html>
  );
}
