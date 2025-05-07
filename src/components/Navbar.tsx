"use client";
import { useRouter, usePathname } from "next/navigation";
import { FaHome, FaComments, FaSeedling, FaUser } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center w-full bg-white shadow-lg pb-safe border-t border-primary-light">
      <div className="w-full max-w-[375px] flex justify-evenly items-center px-2 py-3 relative">
        <div className="flex justify-between w-full">
          {/* 홈 버튼 */}
          <button
            className={`flex flex-col items-center w-1/4 ${pathname === "/" ? "text-primary" : "text-gray-500"}`}
            onClick={() => router.push("/")}
          >
            <div className={`w-6 h-6 flex items-center justify-center mb-1 ${pathname === "/" ? "text-primary" : "text-gray-500"}`}>
              <FaHome className="text-xl" />
            </div>
            <p className={`text-xs font-medium ${pathname === "/" ? "text-primary" : "text-gray-500"}`}>홈</p>
          </button>

          {/* 커뮤니티 버튼 */}
          <button
            className={`flex flex-col items-center w-1/4 ${pathname.startsWith("/community") ? "text-primary" : "text-gray-500"}`}
            onClick={() => router.push("/community")}
          >
            <div className={`w-6 h-6 flex items-center justify-center mb-1 ${pathname.startsWith("/community") ? "text-primary" : "text-gray-500"}`}>
              <FaComments className="text-xl" />
            </div>
            <p className={`text-xs font-medium ${pathname.startsWith("/community") ? "text-primary" : "text-gray-500"}`}>커뮤니티</p>
          </button>

          {/* 캐릭터 버튼 - 로그인 상태에 따라 다르게 처리 */}
          <button
            className={`flex flex-col items-center w-1/4 ${pathname === "/character" ? "text-primary" : "text-gray-500"}`}
            onClick={() => {
              if (isLoggedIn) {
                router.push("/character");
              } else {
                router.push("/auth/login");
              }
            }}
          >
            <div className={`w-6 h-6 flex items-center justify-center mb-1 ${pathname === "/character" ? "text-primary" : "text-gray-500"}`}>
              <FaSeedling className="text-xl" />
            </div>
            <p className={`text-xs font-medium ${pathname === "/character" ? "text-primary" : "text-gray-500"}`}>캐릭터</p>
          </button>

          {/* 마이 버튼 - 로그인 상태에 따라 다르게 처리 */}
          <button
            className={`flex flex-col items-center w-1/4 ${pathname === "/dashboard" ? "text-primary" : "text-gray-500"}`}
            onClick={() => {
              if (isLoggedIn) {
                router.push("/dashboard");
              } else {
                router.push("/auth/login");
              }
            }}
          >
            <div className={`w-6 h-6 flex items-center justify-center mb-1 ${pathname === "/dashboard" ? "text-primary" : "text-gray-500"}`}>
              <FaUser className="text-xl" />
            </div>
            <p className={`text-xs font-medium ${pathname === "/dashboard" ? "text-primary" : "text-gray-500"}`}>마이</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
