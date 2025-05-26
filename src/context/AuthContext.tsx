"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 사용자 타입 정의
type User = {
  id: string;
  email: string;
  nickname: string;
  school: string;
  trees: number;
  level: number;
} | null;

// 인증 컨텍스트 타입 정의
type AuthContextType = {
  user: User;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

// 기본값으로 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  login: async () => false,
  loginWithGoogle: async () => false,
  logout: async () => {},
});

// 컨텍스트 훅
export const useAuth = () => useContext(AuthContext);

// 프로바이더 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 사용자 정보 가져오기
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("로그인 시도:", email); // 디버깅용

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("로그인 응답:", data); // 디버깅용

      if (!response.ok) {
        console.error("로그인 실패 응답:", data.error);
        return false;
      }

      if (data.success) {
        console.log("로그인 성공, 사용자 정보 가져오기");
        await fetchUser();
        return true;
      }

      return false;
    } catch (error) {
      console.error("로그인 실패 (예외):", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 로그인 함수
  const loginWithGoogle = async (credential: string) => {
    try {
      setIsLoading(true);
      console.log("구글 로그인 시도"); // 디버깅용

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();
      console.log("구글 로그인 응답:", data); // 디버깅용

      if (!response.ok) {
        console.error("구글 로그인 실패 응답:", data.error);
        return false;
      }

      if (data.success) {
        console.log("구글 로그인 성공, 사용자 정보 가져오기");
        await fetchUser();
        return true;
      }

      return false;
    } catch (error) {
      console.error("구글 로그인 실패 (예외):", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 시 사용자 정보 가져오기
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
