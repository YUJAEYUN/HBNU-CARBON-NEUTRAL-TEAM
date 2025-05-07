"use client";
import { useRouter, usePathname } from "next/navigation";
import { FaHome, FaComments, FaSeedling, FaUser } from "react-icons/fa";
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

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center w-full">
      <div className="w-full max-w-[375px] relative">
        {/* 네비게이션 배경 - 유리 효과 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg border-t border-primary-light rounded-t-xl shadow-lg"></div>

        {/* 네비게이션 버튼 */}
        <div className="relative w-full flex justify-evenly items-center px-2 py-3">
          {/* 홈 버튼 */}
          <motion.button
            className={`flex flex-col items-center w-1/4 ${pathname === "/" ? "text-primary" : "text-gray-500"}`}
            onClick={() => router.push("/")}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className={`w-10 h-10 flex items-center justify-center mb-1 rounded-full ${pathname === "/" ? "bg-primary-light" : ""}`}
              variants={iconVariants}
              animate={pathname === "/" ? "active" : "inactive"}
            >
              <FaHome className={`text-xl ${pathname === "/" ? "text-primary" : "text-gray-500"}`} />
            </motion.div>
            <p className={`text-xs font-medium ${pathname === "/" ? "text-primary" : "text-gray-500"}`}>홈</p>
          </motion.button>

          {/* 커뮤니티 버튼 */}
          <motion.button
            className={`flex flex-col items-center w-1/4 ${pathname.startsWith("/community") ? "text-primary" : "text-gray-500"}`}
            onClick={() => router.push("/community")}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className={`w-10 h-10 flex items-center justify-center mb-1 rounded-full ${pathname.startsWith("/community") ? "bg-primary-light" : ""}`}
              variants={iconVariants}
              animate={pathname.startsWith("/community") ? "active" : "inactive"}
            >
              <FaComments className={`text-xl ${pathname.startsWith("/community") ? "text-primary" : "text-gray-500"}`} />
            </motion.div>
            <p className={`text-xs font-medium ${pathname.startsWith("/community") ? "text-primary" : "text-gray-500"}`}>커뮤니티</p>
          </motion.button>

          {/* 캐릭터 버튼 */}
          <motion.button
            className={`flex flex-col items-center w-1/4 ${pathname === "/character" ? "text-primary" : "text-gray-500"}`}
            onClick={() => {
              if (isLoggedIn) {
                router.push("/character");
              } else {
                router.push("/auth/login");
              }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className={`w-10 h-10 flex items-center justify-center mb-1 rounded-full ${pathname === "/character" ? "bg-primary-light" : ""}`}
              variants={iconVariants}
              animate={pathname === "/character" ? "active" : "inactive"}
            >
              <FaSeedling className={`text-xl ${pathname === "/character" ? "text-primary" : "text-gray-500"}`} />
            </motion.div>
            <p className={`text-xs font-medium ${pathname === "/character" ? "text-primary" : "text-gray-500"}`}>캐릭터</p>
          </motion.button>

          {/* 마이 버튼 */}
          <motion.button
            className={`flex flex-col items-center w-1/4 ${pathname === "/dashboard" ? "text-primary" : "text-gray-500"}`}
            onClick={() => {
              if (isLoggedIn) {
                router.push("/dashboard");
              } else {
                router.push("/auth/login");
              }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className={`w-10 h-10 flex items-center justify-center mb-1 rounded-full ${pathname === "/dashboard" ? "bg-primary-light" : ""}`}
              variants={iconVariants}
              animate={pathname === "/dashboard" ? "active" : "inactive"}
            >
              <FaUser className={`text-xl ${pathname === "/dashboard" ? "text-primary" : "text-gray-500"}`} />
            </motion.div>
            <p className={`text-xs font-medium ${pathname === "/dashboard" ? "text-primary" : "text-gray-500"}`}>마이</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
