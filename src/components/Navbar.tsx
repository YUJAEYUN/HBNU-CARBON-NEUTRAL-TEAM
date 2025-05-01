"use client";
import { useRouter, usePathname } from "next/navigation";
import { FaHome, FaComments, FaCamera, FaBolt, FaUser } from "react-icons/fa";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center w-full bg-white shadow-lg pb-safe border-t border-primary-light">
      <div className="w-full max-w-[375px] flex justify-evenly items-center px-2 py-3 relative">
        <div className="flex justify-between w-full">
          <button
            className={`flex flex-col items-center w-[20%] ${pathname === "/" ? "text-primary" : "text-gray-500"}`}
            onClick={() => router.push("/")}
          >
            <FaHome className={`text-xl mb-1 ${pathname === "/" ? "text-primary" : "text-gray-500"}`} />
            <p className={`text-xs font-medium ${pathname === "/" ? "text-primary" : "text-gray-500"}`}>홈</p>
          </button>
          <button
            className={`flex flex-col items-center w-[20%] ${pathname.startsWith("/community") ? "text-primary" : "text-gray-500"}`}
            onClick={() => router.push("/community")}
          >
            <FaComments className={`text-xl mb-1 ${pathname.startsWith("/community") ? "text-primary" : "text-gray-500"}`} />
            <p className={`text-xs font-medium ${pathname.startsWith("/community") ? "text-primary" : "text-gray-500"}`}>커뮤니티</p>
          </button>
          <div className="w-[20%] relative">
            <button className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-0 flex flex-col items-center justify-center bg-primary text-white p-4 rounded-full shadow-lg">
              <FaCamera className="text-2xl" />
            </button>
          </div>
          <button
            className={`flex flex-col items-center w-[20%] ${pathname === "/energy" ? "text-primary" : "text-gray-500"}`}
            onClick={() => router.push("/energy")}
          >
            <FaBolt className={`text-xl mb-1 ${pathname === "/energy" ? "text-primary" : "text-gray-500"}`} />
            <p className={`text-xs font-medium ${pathname === "/energy" ? "text-primary" : "text-gray-500"}`}>에너지</p>
          </button>
          <button
            className={`flex flex-col items-center w-[20%] ${pathname === "/dashboard" ? "text-primary" : "text-gray-500"}`}
            onClick={() => router.push("/dashboard")}
          >
            <FaUser className={`text-xl mb-1 ${pathname === "/dashboard" ? "text-primary" : "text-gray-500"}`} />
            <p className={`text-xs font-medium ${pathname === "/dashboard" ? "text-primary" : "text-gray-500"}`}>마이</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
