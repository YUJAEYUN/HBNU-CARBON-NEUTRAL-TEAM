"use client";
import { useRouter, usePathname } from "next/navigation";
import { FaHome, FaComments, FaSeedling, FaUser, FaCamera } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  // 아이콘 애니메이션 설정
  const iconVariants = {
    active: {
      scale: 1.2,
      y: -4,
      transition: { type: "spring", stiffness: 300 }
    },
    inactive: {
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  // 로그인하지 않은 상태에서는 네비게이션 바를 표시하지 않음
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center w-full z-50">
      <div className="w-full max-w-[375px] relative">
        {/* 네비게이션 배경 - iOS 스타일 유리 효과 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white bg-opacity-80 backdrop-filter backdrop-blur-xl border-t border-gray-200 shadow-sm"></div>

        {/* 네비게이션 버튼 */}
        <div className="relative w-full flex justify-evenly items-center px-2 py-3">
          {/* 홈 버튼 */}
          <motion.button
            className={`flex flex-col items-center w-1/5 ${pathname === "/" ? "text-primary" : "text-gray-400"}`}
            onClick={() => router.push("/")}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-8 h-8 flex items-center justify-center mb-1"
              variants={iconVariants}
              animate={pathname === "/" ? "active" : "inactive"}
            >
              <FaHome className={`text-xl ${pathname === "/" ? "text-primary" : "text-gray-400"}`} />
            </motion.div>
            <p className={`text-[10px] font-medium ${pathname === "/" ? "text-primary" : "text-gray-400"}`}>홈</p>
          </motion.button>

          {/* 커뮤니티 버튼 */}
          <motion.button
            className={`flex flex-col items-center w-1/5 ${pathname.startsWith("/community") ? "text-primary" : "text-gray-400"}`}
            onClick={() => router.push("/community")}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-8 h-8 flex items-center justify-center mb-1"
              variants={iconVariants}
              animate={pathname.startsWith("/community") ? "active" : "inactive"}
            >
              <FaComments className={`text-xl ${pathname.startsWith("/community") ? "text-primary" : "text-gray-400"}`} />
            </motion.div>
            <p className={`text-[10px] font-medium ${pathname.startsWith("/community") ? "text-primary" : "text-gray-400"}`}>커뮤니티</p>
          </motion.button>

          {/* 인증 버튼 */}
          <motion.button
            className={`flex flex-col items-center w-1/5 ${pathname.startsWith("/certification") ? "text-primary" : "text-gray-400"}`}
            onClick={() => router.push("/certification")}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-8 h-8 flex items-center justify-center mb-1"
              variants={iconVariants}
              animate={pathname.startsWith("/certification") ? "active" : "inactive"}
            >
              <FaCamera className={`text-xl ${pathname.startsWith("/certification") ? "text-primary" : "text-gray-400"}`} />
            </motion.div>
            <p className={`text-[10px] font-medium ${pathname.startsWith("/certification") ? "text-primary" : "text-gray-400"}`}>인증</p>
          </motion.button>

          {/* 캐릭터 버튼 */}
          <motion.button
            className={`flex flex-col items-center w-1/5 ${pathname === "/character" || pathname.startsWith("/character") ? "text-primary" : "text-gray-400"}`}
            onClick={() => router.push("/character")}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-8 h-8 flex items-center justify-center mb-1"
              variants={iconVariants}
              animate={pathname === "/character" || pathname.startsWith("/character") ? "active" : "inactive"}
            >
              <FaSeedling className={`text-xl ${pathname === "/character" || pathname.startsWith("/character") ? "text-primary" : "text-gray-400"}`} />
            </motion.div>
            <p className={`text-[10px] font-medium ${pathname === "/character" || pathname.startsWith("/character") ? "text-primary" : "text-gray-400"}`}>캐릭터</p>
          </motion.button>

          {/* 마이 버튼 */}
          <motion.button
            className={`flex flex-col items-center w-1/5 ${pathname === "/dashboard" || pathname.startsWith("/dashboard") ? "text-primary" : "text-gray-400"}`}
            onClick={() => router.push("/dashboard")}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-8 h-8 flex items-center justify-center mb-1"
              variants={iconVariants}
              animate={pathname === "/dashboard" || pathname.startsWith("/dashboard") ? "active" : "inactive"}
            >
              <FaUser className={`text-xl ${pathname === "/dashboard" || pathname.startsWith("/dashboard") ? "text-primary" : "text-gray-400"}`} />
            </motion.div>
            <p className={`text-[10px] font-medium ${pathname === "/dashboard" || pathname.startsWith("/dashboard") ? "text-primary" : "text-gray-400"}`}>마이</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
