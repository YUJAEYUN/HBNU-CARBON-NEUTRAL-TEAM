"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

// Google Identity Services 타입 정의
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle, isLoading } = useAuth();

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

  // Supabase 구글 OAuth 로그인
  const handleGoogleLogin = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error("구글 로그인 오류:", error);
        alert("구글 로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      alert("구글 로그인 중 오류가 발생했습니다.");
    }
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

          {/* 구글 로그인 버튼 */}
          <div className="pt-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>구글로 로그인</span>
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
