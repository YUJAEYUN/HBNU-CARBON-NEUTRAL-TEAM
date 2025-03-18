"use client";
import { useRouter } from "next/navigation";

const CommunityPage = () => {
  const router = useRouter();

  const categories = [
    { name: "학교 꿀팁 정보", path: "/community/tips" },
    { name: "학식 정보", path: "/community/hansik" },
    { name: "학교 셔틀버스 정보", path: "/community/shuttle" },
    { name: "사용자 인증 게시판", path: "/community/verification" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">커뮤니티</h1>
      <div className="flex flex-col space-y-4">
        {categories.map((category, index) => (
          <button
            key={index}
            className="p-4 bg-white shadow-md rounded-lg text-center text-lg font-semibold"
            onClick={() => router.push(category.path)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
