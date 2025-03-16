"use client";
import "./globals.css";
import NavBar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token); // ✅ 토큰 존재 여부 업데이트
    };

    checkAuth(); // ✅ 최초 실행 시 토큰 확인
    window.addEventListener("storage", checkAuth); // ✅ 다른 탭에서 토큰 변경 감지
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    router.refresh(); // ✅ 토큰 변경 시 강제 리렌더링
  }, [isLoggedIn]);
  
  return (
    <html lang="ko">
      <body className="bg-gray-100 text-gray-900 flex justify-center items-center min-h-screen">
        {/* ✅ 모바일 화면 크기 고정 */}
        <div className="w-[375px] h-[812px] bg-white shadow-lg rounded-lg overflow-hidden relative flex flex-col">
          <div className="flex-grow overflow-y-auto">{children}</div>
          {isLoggedIn && <NavBar />} {/* ✅ 로그인한 경우에만 네비게이션 바 표시 */}
        </div>
      </body>
    </html>
  );
}
