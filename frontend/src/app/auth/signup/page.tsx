"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [school, setSchool] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname, school }),
      });

      if (!response.ok) throw new Error("회원가입 실패");

      alert("회원가입이 완료되었습니다! 메인 화면으로 이동합니다.");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 상단 닫기 버튼 */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => router.push("/")}
          className="p-2"
        >
          <FaTimes className="text-gray-800 text-xl" />
        </button>
      </div>

      {/* 로고 및 회원가입 폼 */}
      <div className="flex-1 flex flex-col px-6 pb-8 overflow-y-auto">
        {/* 로고 */}
        <div className="flex flex-col items-center mb-8 mt-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">C-NERGY</h1>
          <p className="text-xs text-gray-600 tracking-wider">CARBON NEUTRAL ENERGY REVOLUTION GUIDE YOU</p>
        </div>

        {/* 회원가입 폼 */}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일 주소</label>
            <input
              id="email"
              type="email"
              placeholder="예) cnergy@cnergy.co.kr"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호 확인"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
            <input
              id="nickname"
              type="text"
              placeholder="닉네임"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">학교명</label>
            <input
              id="school"
              type="text"
              placeholder="학교명"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>

          <button
            className="w-full py-3 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors mt-4"
            onClick={handleSignup}
          >
            회원가입
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            <span>이미 계정이 있으신가요? </span>
            <Link href="/auth/login" className="text-primary hover:underline">로그인</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
