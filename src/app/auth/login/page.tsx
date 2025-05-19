"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      const success = await login(email, password);
      if (success) {
        router.push("/"); // 로그인 성공 후 홈 화면으로 이동
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleIntegratedLogin = async () => {
    // 통합학사 로그인 로직 (실제로는 구현 필요)
    alert("통합학사 로그인 기능은 아직 구현되지 않았습니다.");
  };

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

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

      {/* 로고 및 로그인 폼 */}
      <div className="flex-1 flex flex-col px-6 pb-8">
        {/* 로고 */}
        <div className="flex flex-col items-center mb-10 mt-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">C-NERGY</h1>
          <p className="text-xs text-gray-600 tracking-wider">CARBON NEUTRAL ENERGY REVOLUTION GUIDE YOU</p>
        </div>

        {/* 로그인 폼 */}
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

          <button
            className="w-full py-3 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors"
            onClick={handleLogin}
          >
            로그인
          </button>

          {/* 통합학사 로그인 */}
          <div className="mt-4">
            <button
              className="w-full py-3 bg-green-500 text-white rounded-md font-medium flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
              onClick={handleIntegratedLogin}
            >
              <span>통합학사로 로그인</span>
            </button>
          </div>

          {/* 아이디/비밀번호 찾기 및 회원가입 */}
          <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
            <Link href="/auth/find-email" className="hover:underline">아이디 찾기</Link>
            <Link href="/auth/find-password" className="hover:underline">비밀번호 찾기</Link>
            <Link href="/auth/signup" className="hover:underline">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
