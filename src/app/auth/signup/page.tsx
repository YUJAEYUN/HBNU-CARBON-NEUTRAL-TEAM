"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [school, setSchool] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname, school }),
      });

      if (!response.ok) throw new Error("회원가입 실패");

      alert("회원가입이 완료되었습니다! 메인 화면으로 이동합니다."); // ✅ 팝업 메시지 표시
      router.push("/"); // ✅ 메인 화면으로 이동
    } catch (error) {
      console.error(error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800">회원가입</h2>
        <input type="email" placeholder="이메일" className="mt-4 w-full p-2 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="비밀번호" className="mt-2 w-full p-2 border rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="닉네임" className="mt-2 w-full p-2 border rounded-md" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <input type="text" placeholder="학교명" className="mt-2 w-full p-2 border rounded-md" value={school} onChange={(e) => setSchool(e.target.value)} />
        <button className="mt-4 w-full bg-green-500 text-white p-2 rounded-md" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </div>
  );
}
