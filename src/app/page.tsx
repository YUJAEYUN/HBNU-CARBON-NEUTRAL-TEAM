"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">탄소중립 프로젝트</h1>
      <div className="flex space-x-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => router.push("/auth/login")}
        >
          로그인
        </button>
        <button
          className="px-6 py-2 bg-green-500 text-white rounded-md"
          onClick={() => router.push("/auth/signup")}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
