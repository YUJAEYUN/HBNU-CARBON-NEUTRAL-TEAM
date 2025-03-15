"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("인증 실패");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
        router.push("/auth/login");
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">대시보드</h1>
      {user ? (
        <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md">
          <p className="text-lg"><strong>닉네임:</strong> {user.nickname}</p>
          <p className="text-lg"><strong>이메일:</strong> {user.email}</p>
          <p className="text-lg"><strong>학교:</strong> {user.school}</p>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
      <button className="mt-4 bg-red-500 text-white p-2 rounded-md" onClick={() => {
        localStorage.removeItem("token");
        router.push("/");
      }}>
        로그아웃
      </button>
    </div>
  );
}
