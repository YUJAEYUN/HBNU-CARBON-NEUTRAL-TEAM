"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("로그인 실패");

      const { token } = await response.json();
      localStorage.setItem("token", token); // ✅ JWT 토큰 저장
      router.push("/"); // ✅ 로그인 성공 후 홈 화면(`/`)으로 이동
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800">로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          className="mt-4 w-full p-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="mt-2 w-full p-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md"
          onClick={handleLogin} // ✅ 로그인 후 홈 화면으로 이동
        >
          로그인
        </button>
      </div>
    </div>
  );
}
