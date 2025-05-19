

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaThumbsUp, FaTrophy, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const CommunityPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("자유");
  const [showEventBanner, setShowEventBanner] = useState(true);
  const [rankingTab, setRankingTab] = useState("단과대");
  const [fallenApples, setFallenApples] = useState<number[]>([]);
  const [shakingApples, setShakingApples] = useState<number[]>([]);
  const [showRanking, setShowRanking] = useState(false);
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  
  // 사용자 단과대 (실제로는 API에서 가져올 수 있음)
  const userCollege = "환경공학대학";
  
  // 사용자 소속 학과 (실제로는 API에서 가져올 수 있음)
  const userDepartment = "에너지시스템공학과";
  
  // 사과 클릭 핸들러 수정
  const handleAppleClick = (deptId: number) => {
    // 이미 떨어진 사과나 흔들리는 사과는 다시 클릭할 수 없음
    if (fallenApples.includes(deptId) || shakingApples.includes(deptId)) return;
    
    // 클릭한 학과 정보 가져오기
    const dept = departmentRankings.find(d => d.id === deptId);
    if (!dept) return;
    
    // 에너지시스템공학과의 ID를 직접 확인 (ID가 2인 경우만 사과가 떨어짐)
    const isEnergySystemsEngineering = deptId === 2; // 에너지시스템공학과의 ID는 2
    
    // 사과 흔들림 상태 업데이트
    setShakingApples(prev => [...prev, deptId]);
    
    if (isEnergySystemsEngineering) {
      // 에너지시스템공학과인 경우에만 사과가 떨어짐
      setTimeout(() => {
        setShakingApples(prev => prev.filter(id => id !== deptId));
        setFallenApples(prev => [...prev, deptId]);
        
        // 에너지시스템공학과의 사과인 경우 클로즈업 및 랭킹 표시
        setSelectedDept(deptId);
        
        // 1초 후에 랭킹 표시
        setTimeout(() => {
          setShowRanking(true);
        }, 500);
        
        // 5초 후에 사과만 다시 나타나게 하기
        setTimeout(() => {
          setFallenApples(prev => prev.filter(id => id !== deptId));
          // 랭킹 화면은 닫지 않음
        }, 5000);
      }, 1000);
    } else {
      // 에너지시스템공학과가 아닌 경우에는 흔들리기만 하고 2초 후에 멈춤
      setTimeout(() => {
        setShakingApples(prev => prev.filter(id => id !== deptId));
      }, 2000);
    }
  };

  // 랭킹 닫기 핸들러 추가
  const handleCloseRanking = () => {
    setShowRanking(false);
    setSelectedDept(null);
  };

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
    { id: 1, name: "환경공학대학", score: 1250, change: "up", treeImage: "/tree/tree_large.png" },
    { id: 2, name: "인문대학", score: 980, change: "down", treeImage: "/tree/tree_medium.png" },
    { id: 3, name: "자연과학대학", score: 920, change: "up", treeImage: "/tree/tree_small.png" },
  ];

  // 학과 랭킹 데이터 - 환경공학대학 소속 학과만 필터링
  const departmentRankings = [
    { id: 1, name: "환경공학과", score: 450, apples: 5, college: "환경공학대학" },
    { id: 2, name: "에너지시스템공학과", score: 380, apples: 4, college: "환경공학대학" },
    { id: 3, name: "지구환경과학과", score: 320, apples: 3, college: "환경공학대학" },
    { id: 4, name: "인문학과", score: 280, apples: 2, college: "인문대학" },
    { id: 5, name: "경영학과", score: 250, apples: 2, college: "경영대학" },
    { id: 6, name: "컴퓨터공학과", score: 220, apples: 1, college: "공과대학" },
  ];

  // 사용자 단과대에 속한 학과만 필터링
  const userCollegeDepartments = departmentRankings.filter(
    dept => dept.college === userCollege
  );

  // 개인 랭킹 데이터
  const userRankings = [
    { id: 1, name: "에코마스터", dept: "환경공학과", score: 120, avatar: "👨‍🌾" },
    { id: 2, name: "그린워커", dept: "에너지시스템공학과", score: 115, avatar: "👩‍🌾" },
    { id: 3, name: "지구지킴이", dept: "지구환경과학과", score: 105, avatar: "🧑‍🌾" },
    { id: 4, name: "에너지세이버", dept: "에너지시스템공학과", score: 95, avatar: "👨‍🔬" },
    { id: 5, name: "탄소중립맨", dept: "에너지시스템공학과", score: 85, avatar: "👩‍🔬" },
  ];

  // 사용자 학과에 속한 랭킹만 필터링하는 함수
  const getDepartmentUserRankings = (department: string) => {
    return userRankings.filter(user => user.dept === department);
  };

  // 현재 탭에 해당하는 게시글만 필터링
  const filteredPosts = posts.filter(post => 
    activeTab === "자유" ? post.category === "자유" :
    activeTab === "비밀" ? post.category === "비밀" :
    activeTab === "랭킹" ? post.isEvent === true :
    true // 기본값 (모든 게시글 표시)
  );

  // 학과별 위치 계산 (트리에 사과 배치)
  const getDepartmentPositions = () => {
    // 학과 수에 따라 동적으로 위치 계산
    const positions: Array<{
      top: string;
      left?: string;
      right?: string;
      rotate: number;
    }> = [];
    
    // 버블 차트처럼 나무 위에 배치할 위치 정의
    const bubblePositions = [
      { top: "20%", left: "25%", rotate: -5 },
      { top: "15%", right: "30%", rotate: 8 },
      { top: "30%", left: "15%", rotate: -10 },
      { top: "25%", right: "20%", rotate: 12 },
      { top: "40%", left: "35%", rotate: -3 },
      { top: "35%", right: "25%", rotate: 7 },
    ];
    
    // 모든 학과에 대한 위치 생성
    departmentRankings.forEach((dept, index) => {
      if (index < bubblePositions.length) {
        positions.push(bubblePositions[index]);
      } else {
        // 추가 학과가 있을 경우 랜덤 위치 생성
        positions.push({
          top: `${15 + Math.random() * 30}%`,
          left: `${10 + Math.random() * 60}%`,
          rotate: Math.random() * 20 - 10
        });
      }
    });
    
    return positions as Array<{
      top: string;
      left?: string;
      right?: string;
      rotate: number;
    }>;
  };

  const departmentPositions = getDepartmentPositions();

  return (
    <div className="flex-1 flex flex-col h-full pb-[50px]">
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
        {["전체", "자유", "비밀", "랭킹"].map((tab) => (
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
          // 랭킹 화면 - 통합 디자인
          <div className="p-2">
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <h2 className="text-lg font-bold text-primary-dark mb-3">에코 포인트 랭킹</h2>
              
              {/* 학과별 나무 UI (먼저 표시) */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-primary-dark mb-3">학과별 에코 포인트</h3>
                
                {/* 큰 나무 이미지 - 학교 표현 - 더 크게 수정 */}
                <div className="w-[300px] h-[400px] mx-auto relative">
                  <Image
                    src="/tree/tree_large.png"
                    alt="학교 나무"
                    width={300}
                    height={400}
                    className="object-contain"
                  />
                  
                  {/* 사과들 - 학과별, 포인트에 비례한 크기로 배치 (클릭 시 떨어짐) */}
                  <AnimatePresence>
                    {userCollegeDepartments.map((dept, index) => {
                      // 이미 떨어진 사과는 렌더링하지 않음
                      if (fallenApples.includes(dept.id)) return null;
                      
                      // 포인트에 비례하는 크기 계산 (최소 50px, 최대 100px으로 확대)
                      const minSize = 50;
                      const maxSize = 100; // 최대 크기 확대
                      const scoreRange = 450 - 320; // 최고 점수와 최저 점수의 차이
                      const normalizedScore = dept.score - 320; // 최저 점수를 0으로 정규화
                      const sizeRange = maxSize - minSize;
                      
                      // 비선형 스케일링 적용 (제곱 함수 사용)
                      const normalizedRatio = Math.pow(normalizedScore / scoreRange, 1.5);
                      const size = minSize + (normalizedRatio * sizeRange);
                      
                      // 위치 설정 - 나무 잎 부분에만 배치하되 라벨이 컨테이너를 넘지 않도록 조정
                      // 사과 크기가 커졌으므로 위치 조정
                      const positions = [
                        { top: "15%", left: "15%", rotate: -5 },  // 왼쪽 상단 (환경공학과)
                        { top: "12%", right: "20%", rotate: 8 },  // 오른쪽 상단 (에너지시스템공학과)
                        { top: "40%", left: "30%", rotate: -10 }, // 왼쪽 중간 (지구환경과학과)
                      ];
                      
                      const position = positions[index % positions.length];
                      
                      // 흔들리는 효과 설정
                      const isShaking = shakingApples.includes(dept.id);
                      
                      return (
                        <motion.div 
                          key={dept.id}
                          className="absolute cursor-pointer"
                          style={{
                            top: position.top,
                            left: position.left || "auto",
                            right: position.right || "auto",
                            zIndex: showRanking ? 10 : dept.score // 랭킹이 표시될 때는 낮은 z-index 적용
                          }}
                          animate={isShaking ? {
                            rotate: [position.rotate, position.rotate - 10, position.rotate + 10, position.rotate - 10, position.rotate + 10, position.rotate]
                          } : {
                            rotate: position.rotate
                          }}
                          transition={isShaking ? {
                            duration: 0.8,
                            repeat: 0,
                            ease: "easeInOut"
                          } : {}}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAppleClick(dept.id)}
                        >
                          <div className="relative">
                            {/* 사과 이미지와 점수 */}
                            <div className="relative">
                              <Image
                                src="/apple/apple.png"
                                alt={dept.name}
                                width={size}
                                height={size}
                                className="object-contain"
                              />
                              {/* 점수 표시 - 사과 내부에 표시 */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-green-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm border border-green-500">
                                {dept.score}
                              </div>
                            </div>
                            
                            {/* 학과명 라벨 - 점수 표시 아래에 배치 */}
                            <div 
                              className="absolute top-[60%] left-1/2 transform -translate-x-1/2 bg-white px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm whitespace-nowrap border-2 border-gray-200"
                            >
                              {dept.name}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  {/* 떨어지는 사과 애니메이션 */}
                  <AnimatePresence>
                    {fallenApples
                      .filter(appleId => appleId === 2) // 에너지시스템공학과(ID: 2)의 사과만 표시
                      .map(appleId => {
                        const dept = departmentRankings.find(d => d.id === appleId);
                        if (!dept) return null;
                        
                        const index = userCollegeDepartments.findIndex(d => d.id === appleId);
                        
                        // 포인트에 비례하는 크기 계산 (최소 25px, 최대 70px)
                        // 더 극명한 차이를 위해 비례 계수 조정
                        const minSize = 25;
                        const maxSize = 70;
                        const scoreRange = 450 - 320; // 최고 점수와 최저 점수의 차이
                        const normalizedScore = dept.score - 320; // 최저 점수를 0으로 정규화
                        const sizeRange = maxSize - minSize;
                        
                        // 비선형 스케일링 적용 (제곱 함수 사용)
                        const normalizedRatio = Math.pow(normalizedScore / scoreRange, 1.5);
                        const size = minSize + (normalizedRatio * sizeRange);
                        
                        // 위치 계산 - 이미지와 유사하게 배치
                        const positions = [
                          { top: "15%", left: "15%", rotate: -5 },  // 왼쪽 상단 (환경공학과)
                          { top: "15%", right: "15%", rotate: 5 },  // 오른쪽 상단 (에너지시스템공학과)
                          { top: "35%", left: "25%", rotate: -3 },  // 왼쪽 중간 (지구환경과학과)
                        ];
                        
                        const position = positions[index % positions.length];
                        
                        return (
                          <motion.div
                            key={`falling-${appleId}`}
                            className="absolute"
                            initial={{
                              top: position.top,
                              left: position.left || "auto",
                              right: position.right || "auto",
                              rotate: position.rotate
                            }}
                            animate={{
                              top: "100%",
                              rotate: position.rotate + 360,
                              opacity: 0
                            }}
                            transition={{
                              type: "spring",
                              duration: 1.5,
                              bounce: 0.1
                            }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="relative">
                              <div className="relative">
                                <Image
                                  src="/apple/apple.png"
                                  alt={`${dept.name} 떨어지는 사과`}
                                  width={size}
                                  height={size}
                                  className="object-contain"
                                />
                                {/* 점수 표시 - 사과 위에 표시 */}
                                <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                                  {dept.score}
                                </div>
                              </div>
                              <div 
                                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm whitespace-nowrap"
                                style={{ width: `${Math.max(size * 1.2, 80)}px` }}
                              >
                                {dept.name}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </AnimatePresence>
                </div>
                
                {/* 사과 클릭 안내 문구 추가 */}
                <div className="text-center mt-4">
                  <motion.div
                    className="inline-block bg-primary-light px-4 py-2 rounded-full shadow-sm"
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <div className="flex items-center">
                      <Image
                        src="/apple/apple.png"
                        alt="사과"
                        width={20}
                        height={20}
                        className="mr-1.5"
                      />
                      <p className="text-sm font-medium text-primary-dark">
                        사과를 클릭하여 랭킹을 확인하세요!
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* 여백 추가하여 구분 */}
              <div className="h-10"></div>
              
              {/* 단과대 랭킹 섹션 (스크롤해서 볼 수 있음) */}
              <div className="mt-6">
                <h3 className="text-base font-bold text-primary-dark mb-3">단과대 랭킹</h3>
                
                <div className="space-y-3">
                  {collegeRankings.map((college, index) => (
                    <div 
                      key={college.id}
                      className={`flex items-center p-3 rounded-lg ${
                        college.name === userCollege ? 'bg-primary-light bg-opacity-20' : 'bg-gray-50'
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-full text-white font-bold mr-3">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-800">
                            {college.name}
                            {college.name === userCollege && (
                              <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                내 단과대
                              </span>
                            )}
                          </h4>
                          <div className="ml-2">
                            {college.change === "up" ? (
                              <span className="text-green-500 text-xs">▲</span>
                            ) : (
                              <span className="text-red-500 text-xs">▼</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-1">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ 
                                width: `${(college.score / collegeRankings[0].score) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="ml-3 text-sm font-medium text-primary-dark">
                            {college.score}점
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 랭킹 설명 */}
                <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <p>• 단과대 랭킹은 소속 학과들의 에코 포인트 합산으로 결정됩니다.</p>
                  <p>• 매주 월요일 자정에 랭킹이 갱신됩니다.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 기존 게시글 목록 코드는 그대로 유지
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

      {/* 여백 추가하여 나무 UI와 분리 */}
      <div className="h-10"></div>

      {/* 단과대 랭킹 섹션 제거 */}
      {/* 여기서부터 아래 코드 삭제 */}
      {/* <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-base font-bold text-primary-dark mb-3">단과대 랭킹</h3>
        
        <div className="space-y-3">
          {collegeRankings.map((college, index) => (
            <div 
              key={college.id}
              className={`flex items-center p-3 rounded-lg ${
                college.name === userCollege ? 'bg-primary-light bg-opacity-20' : 'bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-full text-white font-bold mr-3">
                {index + 1}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-800">
                    {college.name}
                    {college.name === userCollege && (
                      <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                        내 단과대
                      </span>
                    )}
                  </h4>
                  <div className="ml-2">
                    {college.change === "up" ? (
                      <span className="text-green-500 text-xs">▲</span>
                    ) : (
                      <span className="text-red-500 text-xs">▼</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center mt-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ 
                        width: `${(college.score / collegeRankings[0].score) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-primary-dark">
                    {college.score}점
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p>• 단과대 랭킹은 소속 학과들의 에코 포인트 합산으로 결정됩니다.</p>
          <p>• 매주 월요일 자정에 랭킹이 갱신됩니다.</p>
        </div>
      </div> */}

      {/* NavBar 컴포넌트는 레이아웃에서 자동으로 추가됩니다 */}
      {/* 사과 모양 랭킹 팝업 */}
      <AnimatePresence>
        {showRanking && selectedDept && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-[100]" // z-index 더 높게 설정
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseRanking} // 배경 클릭 시 닫히도록 수정
          >
            <motion.div
              className="relative h-full flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 사과 이미지를 팝업으로 사용 - 훨씬 더 크게 */}
              <div className="relative w-[800px] h-[800px]">
                <Image
                  src="/apple/apple.png"
                  alt="사과 랭킹"
                  fill
                  className="object-contain"
                />
                
                {/* 랭킹 내용 - 사과 이미지 위에 직접 표시 */}
                <div className="absolute inset-0 flex flex-col justify-center items-center" style={{ paddingTop: "100px" }}>
                  {/* 헤더 - 배경 있는 컨테이너 */}
                  <div className="w-[280px] bg-white rounded-t-lg p-3 shadow-md">
                    <h3 className="text-base font-bold text-primary-dark text-center">개인 랭킹</h3>
                  </div>
                  
                  {/* 랭킹 목록 */}
                  <div className="w-[280px] bg-white p-3 rounded-b-lg shadow-md">
                    {getDepartmentUserRankings(userDepartment).map((user, index) => (
                      <div 
                        key={user.id}
                        className="flex items-center mb-2 last:mb-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center mr-3">
                          <span className="text-sm">{user.avatar}</span>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                              <p className="text-xs text-gray-600">{user.dept}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary-dark text-sm">{user.score}점</p>
                              <p className="text-xs text-gray-600">#{index + 1}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 닫기 버튼 */}
                  <div className="w-[280px] mt-3">
                    <button
                      className="w-full bg-green-500 text-white py-2 rounded-lg font-medium"
                      onClick={handleCloseRanking}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;
