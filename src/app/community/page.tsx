"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaThumbsUp, FaTrophy, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const CommunityPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("자유");
  const [showEventBanner, setShowEventBanner] = useState(true);

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
      category: "비밀"
    },
    {
      id: 5,
      title: "학교 환경동아리 봉사활동 모집",
      content: "5월 15일 교내 쓰레기 줍기 • 참여시 CO₂ 1.2kg 절감",
      author: "참여신청",
      time: "2일 전",
      likes: 0,
      category: "랭킹",
      isEvent: true
    }
  ];

  // 단과대 랭킹 데이터
  const collegeRankings = [
    { id: 1, name: "환경공학대학", score: 1250, change: "up" },
    { id: 2, name: "인문대학", score: 980, change: "down" },
    { id: 3, name: "자연과학대학", score: 920, change: "up" },
  ];

  // 현재 탭에 해당하는 게시글만 필터링
  const filteredPosts = activeTab === "전체"
    ? posts
    : posts.filter(post => post.category === activeTab || (activeTab === "랭킹" && post.isEvent));

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 */}
      <div className="w-full bg-primary py-4 px-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-white">커뮤니티</h1>
        <button className="bg-primary-light bg-opacity-30 text-white p-2 rounded-full">
          <FaPlus />
        </button>
      </div>

      {/* 이벤트 배너 */}
      {showEventBanner && (
        <motion.div
          className="bg-primary-light p-3 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-primary-dark">
            <span className="font-bold">🎉 5월 환경 챌린지</span> - 참여하고 에코 포인트 받으세요!
          </p>
          <button
            className="text-xs text-gray-500"
            onClick={() => setShowEventBanner(false)}
          >
            닫기
          </button>
        </motion.div>
      )}

      {/* 탭 메뉴 */}
      <div className="flex bg-gray-100 p-2 space-x-2">
        {["자유", "비밀", "랭킹"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 px-4 text-center rounded-full font-medium ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "랭킹" ? (
              <div className="flex items-center justify-center">
                <FaTrophy className="mr-1 text-xs" />
                <span>{tab}</span>
              </div>
            ) : (
              tab
            )}
          </button>
        ))}
      </div>

      {/* 랭킹 또는 게시글 목록 */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-2">
        {activeTab === "랭킹" ? (
          // 랭킹 화면
          <div className="p-2">
            {/* 단과대 랭킹 */}
            <div className="mb-5">
              <h2 className="text-lg font-bold text-primary-dark mb-3">단과대 랭킹</h2>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="relative mb-6 pt-4">
                  {/* 사과 달린 나무 이미지 (예시) */}
                  <div className="flex justify-around items-end">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mb-2">
                        <span className="text-2xl">🌳</span>
                      </div>
                      <div className="w-20 text-center">
                        <p className="text-xs font-bold">환경공학대학</p>
                        <p className="text-xs text-primary">1250 포인트</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mb-2">
                        <span className="text-xl">🌲</span>
                      </div>
                      <div className="w-20 text-center">
                        <p className="text-xs font-bold">인문대학</p>
                        <p className="text-xs text-primary">980 포인트</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mb-2">
                        <span className="text-lg">🌱</span>
                      </div>
                      <div className="w-20 text-center">
                        <p className="text-xs font-bold">자연과학대학</p>
                        <p className="text-xs text-primary">920 포인트</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 학과 랭킹 */}
            <div className="mb-5">
              <h2 className="text-lg font-bold text-primary-dark mb-3">학과 랭킹</h2>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="space-y-3">
                  {[
                    { name: "환경공학과", score: 450, icon: "🍎" },
                    { name: "에너지시스템공학과", score: 380, icon: "🍏" },
                    { name: "지구환경과학과", score: 320, icon: "🍐" },
                  ].map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{dept.icon}</span>
                        <span className="font-medium">{dept.name}</span>
                      </div>
                      <span className="text-primary font-medium">{dept.score} 포인트</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 개인 랭킹 */}
            <div>
              <h2 className="text-lg font-bold text-primary-dark mb-3">개인 랭킹</h2>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="space-y-3">
                  {[
                    { name: "에코마스터", dept: "환경공학과", score: 120 },
                    { name: "그린워커", dept: "에너지시스템공학과", score: 115 },
                    { name: "지구지킴이", dept: "지구환경과학과", score: 105 },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100">
                      <div>
                        <div className="flex items-center">
                          <span className="font-bold text-sm mr-2">#{index + 1}</span>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{user.dept}</span>
                      </div>
                      <span className="text-primary font-medium">{user.score} 포인트</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 일반 게시글 목록
          filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              className={`mb-3 p-4 rounded-lg ${
                post.isEvent
                  ? "bg-primary-light"
                  : "bg-white"
              } border ${post.isEvent ? "border-primary-medium" : "border-gray-100"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
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
            </motion.div>
          ))
        )}
      </div>

      {/* NavBar 컴포넌트는 레이아웃에서 자동으로 추가됩니다 */}
    </div>
  );
};

export default CommunityPage;
