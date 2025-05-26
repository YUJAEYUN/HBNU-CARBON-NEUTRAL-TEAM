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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 상단 헤더 - 개선된 스타일 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="w-10 h-10"></div> {/* 균형을 위한 빈 공간 */}
          <h1 className="text-lg font-bold text-gray-900">로그인</h1>
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-600 text-lg" />
          </button>
        </div>
      </div>

      {/* 로그인 폼 */}
      <div className="flex-1 flex flex-col px-5 pt-8">
        {/* 로고 */}
        <div className="flex flex-col items-center mb-12">
          {/* 간단한 캐릭터 애니메이션 */}
          <div className="w-16 h-16 bg-toss-green/10 rounded-full flex items-center justify-center mb-4 relative">
            <span
              className="text-2xl"
              style={{
                animation: 'gentleBounce 2s ease-in-out infinite'
              }}
            >
              🌱
            </span>
            {/* 작은 반짝이 효과 */}
            <div
              className="absolute -top-1 -right-1 w-2 h-2 bg-toss-green/30 rounded-full"
              style={{
                animation: 'sparkle 3s ease-in-out infinite'
              }}
            ></div>
          </div>

          <h1 className="text-3xl font-bold text-toss-gray-700 mb-2">C-NERGY</h1>
          <p className="text-sm text-toss-gray-500 text-center">탄소중립 에너지 혁신을 이끄는 플랫폼</p>
        </div>

        {/* 애니메이션 스타일 */}
        <style jsx>{`
          @keyframes gentleBounce {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-3px) scale(1.05); }
          }

          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 0.8; transform: scale(1.2); }
          }
        `}</style>

        {/* 로그인 폼 - 토스 스타일 */}
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-toss-gray-600 mb-2">이메일 주소</label>
            <input
              id="email"
              type="email"
              placeholder="예) cnergy@cnergy.co.kr"
              className="w-full p-4 border border-toss-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toss-green/20 focus:border-toss-green transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-toss-gray-600 mb-2">비밀번호</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                className="w-full p-4 pr-12 border border-toss-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toss-green/20 focus:border-toss-green transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-toss-gray-400 p-2 hover:text-toss-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              className="w-full bg-toss-green/90 text-white py-4 rounded-xl font-medium hover:bg-toss-green transition-colors"
              onClick={handleIntegratedLogin}
            >
              통합학사로 로그인
            </button>
          </div>

          <button
            className="w-full bg-toss-gray-100 text-toss-gray-700 py-4 rounded-xl font-medium hover:bg-toss-gray-200 transition-colors"
            onClick={handleLogin}
          >
            일반 로그인
          </button>

          {/* 아이디/비밀번호 찾기 및 회원가입 */}
          <div className="flex items-center justify-center space-x-6 text-sm text-toss-gray-500 pt-8">
            <Link href="/auth/find-email" className="hover:text-toss-green transition-colors">아이디 찾기</Link>
            <div className="w-px h-4 bg-toss-gray-300"></div>
            <Link href="/auth/find-password" className="hover:text-toss-green transition-colors">비밀번호 찾기</Link>
            <div className="w-px h-4 bg-toss-gray-300"></div>
            <Link href="/auth/signup" className="hover:text-toss-green transition-colors">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
