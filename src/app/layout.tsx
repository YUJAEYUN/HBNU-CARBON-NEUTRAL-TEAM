"use client";
import "./globals.css";
import NavBar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-primary-light text-gray-900 flex justify-center items-center min-h-screen">
        <AuthProvider>
          {/* ✅ 모바일 화면 크기 고정 */}
          <div className="w-[375px] h-[812px] bg-white shadow-xl rounded-2xl overflow-hidden relative flex flex-col">
            <div className="flex-grow overflow-y-auto">{children}</div>
            <NavBar /> {/* 항상 네비게이션 바 표시 */}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
