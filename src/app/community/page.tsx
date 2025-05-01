"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaThumbsUp } from "react-icons/fa";

const CommunityPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("자유");

  // 게시글 데이터
  const posts = [
    {
      id: 1,
      title: "학교 내 카페에서 텀블러 사용하면 할인!",
      content: "스타벅스, 투썸 모두 500원씩 할인되네요",
      author: "환경지킴이",
      time: "14시간 전",
      likes: 34,
      category: "자유"
    },
    {
      id: 2,
      title: "이번주 재식 메뉴 맛있는거 추천좀요",
      content: "제1식당 두부스테이크 괜찮던데 다른 추천?",
      author: "식단관리",
      time: "24시간 전",
      likes: 22,
      category: "자유"
    },
    {
      id: 3,
      title: "기숙사 전기/수도 절약 팁 공유해요",
      content: "빨래 모아서 하면 세제/전기 절약됩니다!",
      author: "기숙사생",
      time: "34시간 전",
      likes: 18,
      category: "자유"
    },
    {
      id: 4,
      title: "내일 환경공학 시험 족보 있나요?",
      content: "김교수님 기출문제 찾습니다 ㅠㅠ",
      author: "시험공부중",
      time: "41시간 전",
      likes: 12,
      category: "정보"
    },
    {
      id: 5,
      title: "학교 환경동아리 봉사활동 모집",
      content: "5월 15일 교내 쓰레기 줍기 • 참여시 CO₂ 1.2kg 절감",
      author: "참여신청",
      time: "2일 전",
      likes: 0,
      category: "친환경",
      isEvent: true
    }
  ];

  // 현재 탭에 해당하는 게시글만 필터링
  const filteredPosts = activeTab === "전체"
    ? posts
    : posts.filter(post => post.category === activeTab);

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 */}
      <div className="w-full bg-primary py-4 px-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-white">커뮤니티</h1>
        <button className="bg-primary-light bg-opacity-30 text-white p-2 rounded-full">
          <FaPlus />
        </button>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex bg-gray-100 p-2 space-x-2">
        {["자유", "정보", "친환경"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 px-4 text-center rounded-full font-medium ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 게시글 목록 */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-2">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className={`mb-3 p-4 rounded-lg ${
              post.isEvent
                ? "bg-primary-light"
                : "bg-white"
            } border ${post.isEvent ? "border-primary-medium" : "border-gray-100"}`}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">{post.title}</h2>
            <p className="text-gray-600 mb-2">{post.content}</p>
            <div className="flex justify-between items-center">
              <div className="text-gray-500 text-sm">
                {post.author} • {post.time}
              </div>
              <div className="flex items-center text-primary">
                {post.isEvent ? (
                  <span className="text-primary font-medium">👍 {post.author}</span>
                ) : (
                  <>
                    <FaThumbsUp className="mr-1" />
                    <span>{post.likes}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NavBar 컴포넌트는 레이아웃에서 자동으로 추가됩니다 */}
    </div>
  );
};

export default CommunityPage;
