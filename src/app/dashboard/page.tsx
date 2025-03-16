"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[375px] h-[812px] bg-white shadow-lg rounded-lg flex flex-col p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">마이페이지</h1>

        {user ? (
          <div className="mt-6">
            <p className="text-lg font-semibold text-gray-800">이메일: <span className="font-normal">{user.email}</span></p>
            <p className="text-lg font-semibold text-gray-800">닉네임: <span className="font-normal">{user.nickname}</span></p>
            <p className="text-lg font-semibold text-gray-800">학교: <span className="font-normal">{user.school}</span></p>

            <button
              className="mt-6 w-full bg-red-500 text-white p-3 rounded-md shadow-md font-bold"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10">로딩 중...</p>
        )}
      </div>
    </div>
  );
}
