"use client";
import { useRouter, usePathname } from "next/navigation";
import { FaHome, FaComments, FaCamera, FaBolt, FaUser } from "react-icons/fa";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 확인

  return (
    <div className="absolute bottom-0 left-0 w-[375px] bg-white shadow-md p-3 flex justify-around rounded-t-lg">
      <button
        className={`flex flex-col items-center ${pathname === "/" ? "text-green-500" : "text-gray-700"}`}
        onClick={() => router.push("/")}
      >
        <FaHome className="text-xl" />
        <p className="text-sm">홈</p>
      </button>
      <button
        className={`flex flex-col items-center ${pathname.startsWith("/community") ? "text-green-500" : "text-gray-700"}`}
        onClick={() => router.push("/community")}
      >
        <FaComments className="text-xl" />
        <p className="text-sm">커뮤니티</p>
      </button>
      <button className="flex flex-col items-center bg-green-500 text-white p-3 rounded-full shadow-lg">
        <FaCamera className="text-2xl" />
      </button>
      <button
        className={`flex flex-col items-center ${pathname === "/energy" ? "text-green-500" : "text-gray-700"}`}
        onClick={() => router.push("/energy")}
      >
        <FaBolt className="text-xl" />
        <p className="text-sm">에너지 현황</p>
      </button>
      <button
        className={`flex flex-col items-center ${pathname === "/dashboard" ? "text-green-500" : "text-gray-700"}`}
        onClick={() => router.push("/dashboard")}
      >
        <FaUser className="text-xl" />
        <p className="text-sm">마이페이지</p>
      </button>
    </div>
  );
};

export default NavBar;
