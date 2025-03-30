"use client";
import { useRouter, usePathname } from "next/navigation";
import { FaHome, FaComments, FaCamera, FaBolt, FaUser } from "react-icons/fa";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center w-full bg-white shadow-md pb-safe">
      <div className="w-full max-w-[375px] flex justify-evenly items-center px-2 py-4 relative">
        <div className="flex justify-between w-full">
          <button
            className={`flex flex-col items-center w-[20%] ${pathname === "/" ? "text-green-500" : "text-gray-700"}`}
            onClick={() => router.push("/")}
          >
            <FaHome className="text-xl mb-1" />
            <p className="text-xs">홈</p>
          </button>
          <button
            className={`flex flex-col items-center w-[20%] ${pathname.startsWith("/community") ? "text-green-500" : "text-gray-700"}`}
            onClick={() => router.push("/community")}
          >
            <FaComments className="text-xl mb-1" />
            <p className="text-xs">커뮤니티</p>
          </button>
          <div className="w-[20%] relative">
            <button className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-0 flex flex-col items-center justify-center bg-green-500 text-white p-4 rounded-full shadow-lg">
              <FaCamera className="text-2xl" />
            </button>
          </div>
          <button
            className={`flex flex-col items-center w-[20%] ${pathname === "/energy" ? "text-green-500" : "text-gray-700"}`}
            onClick={() => router.push("/energy")}
          >
            <FaBolt className="text-xl mb-1" />
            <p className="text-xs">에너지 현황</p>
          </button>
          <button
            className={`flex flex-col items-center w-[20%] ${pathname === "/dashboard" ? "text-green-500" : "text-gray-700"}`}
            onClick={() => router.push("/dashboard")}
          >
            <FaUser className="text-xl mb-1" />
            <p className="text-xs">마이페이지</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
