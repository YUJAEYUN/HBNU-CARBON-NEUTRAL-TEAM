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
    <div className="flex flex-col h-screen bg-toss-gray-50">
      {/* 상단 헤더 - 토스 스타일 */}
      <div className="toss-header">
        <div></div>
        <h1 className="toss-header-title">로그인</h1>
        <button
          onClick={() => router.push("/")}
          className="toss-icon-button"
        >
          <FaTimes className="text-toss-gray-600 text-lg" />
        </button>
      </div>

      {/* 로그인 폼 */}
      <div className="flex-1 flex flex-col px-toss-5 pt-toss-8">
        {/* 로고 */}
        <div className="flex flex-col items-center mb-toss-10">
          <h1 className="text-toss-h1 font-bold text-toss-gray-900 mb-2">C-NERGY</h1>
          <p className="text-toss-body2 text-toss-gray-600 text-center">탄소중립 에너지 혁신을 이끄는 플랫폼</p>
        </div>

        {/* 로그인 폼 - 토스 스타일 */}
        <div className="space-y-toss-4">
          <div>
            <label htmlFor="email" className="block text-toss-body2 font-medium text-toss-gray-700 mb-toss-2">이메일 주소</label>
            <input
              id="email"
              type="email"
              placeholder="예) cnergy@cnergy.co.kr"
              className="toss-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-toss-body2 font-medium text-toss-gray-700 mb-toss-2">비밀번호</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                className="toss-input pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-toss-3 top-1/2 transform -translate-y-1/2 text-toss-gray-500 p-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="pt-toss-4">
            <button
              className="toss-button w-full"
              onClick={handleIntegratedLogin}
            >
              통합학사로 로그인
            </button>
          </div>

          <button
            className="toss-button-secondary w-full"
            onClick={handleLogin}
          >
            일반 로그인
          </button>

          {/* 아이디/비밀번호 찾기 및 회원가입 */}
          <div className="flex items-center justify-center space-x-toss-6 text-toss-body2 text-toss-gray-600 pt-toss-6">
            <Link href="/auth/find-email" className="hover:text-toss-blue transition-colors">아이디 찾기</Link>
            <div className="w-px h-4 bg-toss-gray-300"></div>
            <Link href="/auth/find-password" className="hover:text-toss-blue transition-colors">비밀번호 찾기</Link>
            <div className="w-px h-4 bg-toss-gray-300"></div>
            <Link href="/auth/signup" className="hover:text-toss-blue transition-colors">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
