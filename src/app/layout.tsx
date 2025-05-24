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
          </motion.div>
        </AuthProvider>
      </body>
    </html>
  );
}
