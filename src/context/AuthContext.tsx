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
  logout: () => Promise<void>;
};

// 기본값으로 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  login: async () => false,
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (data.success) {
        await fetchUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error("로그인 실패:", error);
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
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
