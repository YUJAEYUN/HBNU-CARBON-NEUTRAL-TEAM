"use client";
import "./globals.css";
import NavBar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gradient-to-br from-primary-light via-white to-primary-light text-gray-900 flex justify-center items-center min-h-screen p-4">
        <AuthProvider>
          {/* 모바일 화면 크기 고정 - 입체적 디자인 적용 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[375px] h-[812px] bg-white shadow-card rounded-3xl overflow-hidden relative flex flex-col"
            style={{
              boxShadow: "0 20px 25px -5px rgba(76, 175, 80, 0.2), 0 10px 10px -5px rgba(76, 175, 80, 0.1)",
              transform: "perspective(1000px) rotateX(2deg)",
              transformOrigin: "center bottom"
            }}
          >
            <div className="flex-grow overflow-y-auto">{children}</div>
            <NavBar /> {/* 항상 네비게이션 바 표시 */}
          </motion.div>
        </AuthProvider>
      </body>
    </html>
  );
}
