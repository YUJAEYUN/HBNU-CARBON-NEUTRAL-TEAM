"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaThumbsUp, FaTrophy, FaTimes, FaPlus, FaSearch, FaEnvelope } from "react-icons/fa";

const CommunityPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("자유");
  const [showEventBanner, setShowEventBanner] = useState(true);
  const [isEventBannerCollapsed, setIsEventBannerCollapsed] = useState(false);
  const [rankingTab, setRankingTab] = useState("단과대");
  const [fallenApples, setFallenApples] = useState<number[]>([]);
  const [shakingApples, setShakingApples] = useState<number[]>([]);
  const [showRanking, setShowRanking] = useState(false);
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [showCuttingApple, setShowCuttingApple] = useState(false);
  const [showWholeApple, setShowWholeApple] = useState(false);
  const [isAppleCutting, setIsAppleCutting] = useState(false);

  // 게시글 작성 관련 상태 추가
  const [isWritingPost, setIsWritingPost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [postType, setPostType] = useState<"일반" | "환경활동">("일반"); // 게시글 타입 상태 추가
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 사용자 단과대 (실제로는 API에서 가져올 수 있음)
  const userCollege = "정보기술대학";

  // 사용자 소속 학과 (실제로는 API에서 가져올 수 있음)
  const userDepartment = "정보통신공학과";

  // 현재 시간 상태 추가
  const [currentTime, setCurrentTime] = useState<string>("");
  const [updateTime, setUpdateTime] = useState<string>("06:00"); // 포인트 반영 기준 시간

  // 현재 시간 설정을 위한 useEffect 추가
  useEffect(() => {
    // 현재 시간 포맷팅 함수
    const formatCurrentTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    // 초기 시간 설정
    setCurrentTime(formatCurrentTime());

    // 1분마다 시간 업데이트
    const interval = setInterval(() => {
      setCurrentTime(formatCurrentTime());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 페이지 로드 시 이벤트 배너 상태 초기화
  useEffect(() => {
    // 페이지가 로드될 때마다 배너를 다시 표시
    setIsEventBannerCollapsed(false);
  }, []);

  // 배너 닫기 후 일정 시간 후 다시 표시하는 기능
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isEventBannerCollapsed) {
      // 배너를 닫은 후 30초 후에 다시 표시
      timer = setTimeout(() => {
        setIsEventBannerCollapsed(false);
      }, 30000); // 30초
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isEventBannerCollapsed]);

  // 검색어 상태 추가
  const [searchTerm, setSearchTerm] = useState("");

  // 게시글 데이터 타입 정의
  interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    time: string;
    likes: number;
    category: string;
    postType: "일반" | "환경활동"; // 게시글 타입 추가
    isEvent?: boolean;
    images?: string[];
  }

  // 게시글 데이터
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "학교 내 카페에서 텀블러 사용하면 할인!",
      content: "스타벅스, 투썸 모두 500원씩 할인되네요",
      author: "환경지킴이",
      time: "14시간 전",
      likes: 34,
      category: "자유",
      postType: "일반",
      images: []
    },
    {
      id: 2,
      title: "이번주 재식 메뉴 맛있는거 추천좀요",
      content: "제1식당 두부스테이크 괜찮던데 다른 추천?",
      author: "식단관리",
      time: "24시간 전",
      likes: 22,
      category: "자유",
      postType: "일반",
      images: []
    },
    {
      id: 3,
      title: "기숙사 전기/수도 절약 팁 공유해요",
      content: "빨래 모아서 하면 세제/전기 절약됩니다!",
      author: "기숙사생",
      time: "34시간 전",
      likes: 18,
      category: "자유",
      postType: "일반",
      images: []
    },
    {
      id: 4,
      title: "내일 환경공학 시험 족보 있나요?",
      content: "김교수님 기출문제 찾습니다 ㅠㅠ",
      author: "시험공부중",
      time: "41시간 전",
      likes: 12,
      category: "비밀",
      postType: "일반",
      images: []
    },
    {
      id: 5,
      title: "학교 환경동아리 봉사활동 모집",
      content: "5월 15일 교내 쓰레기 줍기 • 참여시 CO₂ 1.2kg 절감",
      author: "참여신청",
      time: "2일 전",
      likes: 0,
      category: "자유",
      postType: "환경활동",
      isEvent: true,
      images: []
    },
    {
      id: 6,
      title: "캠퍼스 내 일회용품 줄이기 캠페인",
      content: "다음 주 월요일부터 금요일까지 중앙도서관 앞에서 일회용품 줄이기 캠페인을 진행합니다.",
      author: "그린캠퍼스",
      time: "1일 전",
      likes: 7,
      category: "자유",
      postType: "환경활동",
      isEvent: true,
      images: []
    },
    {
      id: 7,
      title: "환경 관련 학술대회 참가자 모집",
      content: "다음 달 15일 개최되는 '대학생 기후변화 대응 포럼'에 함께 참여할 학우를 모집합니다.",
      author: "기후변화연구회",
      time: "3일 전",
      likes: 15,
      category: "자유",
      postType: "환경활동",
      isEvent: true,
      images: []
    }
  ]);

  // 초기화 여부를 추적하는 ref 추가
  const initializedRef = useRef(false);

  // 컴포넌트 마운트 시 로컬 스토리지에서 게시글 불러오기
  useEffect(() => {
    // 이미 초기화되었으면 실행하지 않음
    if (initializedRef.current) return;

    try {
      // 로컬 스토리지에서 게시글 데이터 가져오기
      const storedPostsString = localStorage.getItem('community_posts');

      // 기본 게시글 좋아요 상태 불러오기
      const defaultPostsLikesString = localStorage.getItem('default_posts_likes');
      let defaultPostsLikes = [];

      if (defaultPostsLikesString) {
        try {
          defaultPostsLikes = JSON.parse(defaultPostsLikesString);
          if (!Array.isArray(defaultPostsLikes)) {
            defaultPostsLikes = [];
          }
        } catch (error) {
          console.error("기본 게시글 좋아요 상태 파싱 오류:", error);
          defaultPostsLikes = [];
        }
      }

      // 기본 게시글에 좋아요 상태 적용
      const updatedPosts = posts.map(post => {
        const likeInfo = defaultPostsLikes.find(p => p.id === post.id);
        if (likeInfo) {
          return {
            ...post,
            likes: likeInfo.likes,
            likedByCurrentUser: likeInfo.likedByCurrentUser
          };
        }
        return post;
      });

      // 로컬 스토리지에 저장된 게시글이 있으면 추가
      if (storedPostsString) {
        const storedPosts = JSON.parse(storedPostsString);
        if (Array.isArray(storedPosts) && storedPosts.length > 0) {
          // 기존 게시글과 저장된 게시글 합치기
          const allPosts = [...updatedPosts, ...storedPosts];

          // ID 중복 제거 (ID가 같은 경우 로컬 스토리지의 게시글 우선)
          const uniquePosts = allPosts.reduce<Post[]>((acc, current) => {
            const x = acc.find(item => item.id === current.id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

          setPosts(uniquePosts);
          console.log("로컬 스토리지에서 게시글을 불러왔습니다:", uniquePosts.length);
        } else {
          // 저장된 게시글이 없으면 기본 게시글만 업데이트
          setPosts(updatedPosts);
        }
      } else {
        // 저장된 게시글이 없으면 기본 게시글만 업데이트
        setPosts(updatedPosts);
      }

      // 초기화 완료 표시
      initializedRef.current = true;
    } catch (error) {
      console.error("로컬 스토리지 접근 오류:", error);
      // 오류가 발생해도 초기화 완료 표시
      initializedRef.current = true;
    }
  }, []);  // 의존성 배열에서 posts 제거

  // 단과대 랭킹 데이터
  const collegeRankings = [
    { id: 1, name: "정보기술대학", score: 1250, change: "up", treeImage: "/tree/tree_large.png" },
    { id: 2, name: "인문사회대학", score: 980, change: "down", treeImage: "/tree/tree_medium.png" },
    { id: 3, name: "공과대학", score: 920, change: "up", treeImage: "/tree/tree_small.png" },
  ];

  // 학과 랭킹 데이터 - 정보기술대학 소속 학과만 필터링
  const departmentRankings = [
    { id: 1, name: "컴퓨터공학과", score: 450, apples: 5, college: "정보기술대학" },
    { id: 2, name: "정보통신공학과", score: 380, apples: 4, college: "정보기술대학" },
    { id: 3, name: "모바일융합공학과", score: 320, apples: 3, college: "정보기술대학" },
    { id: 4, name: "공공행정학과", score: 280, apples: 2, college: "인문사회대학" },
    { id: 5, name: "경제학과", score: 250, apples: 2, college: "경상대학" },
    { id: 6, name: "신소재공학과", score: 220, apples: 1, college: "공과대학" },
  ];

  // 사용자 단과대에 속한 학과만 필터링
  const userCollegeDepartments = departmentRankings.filter(
    dept => dept.college === userCollege
  );

  // 개인 랭킹 데이터
  const userRankings = [
    // 컴퓨터공학과 사용자
    { id: 1, name: "에코마스터", dept: "컴퓨터공학과", score: 120, avatar: "👨‍🌾" },
    { id: 6, name: "그린리더", dept: "컴퓨터공학과", score: 110, avatar: "👩‍🔬" },
    { id: 7, name: "환경수호자", dept: "컴퓨터공학과", score: 105, avatar: "🧑‍🔧" },

    // 정보통신공학과 사용자
    { id: 2, name: "그린워커", dept: "정보통신공학과", score: 115, avatar: "👩‍🌾" },
    { id: 4, name: "에너지세이버", dept: "정보통신공학과", score: 95, avatar: "👨‍🔬" },
    { id: 5, name: "탄소중립맨", dept: "정보통신공학과", score: 85, avatar: "👩‍🔬" },

    // 모바일융합공학과 사용자
    { id: 3, name: "지구지킴이", dept: "모바일융합공학과", score: 105, avatar: "🧑‍🌾" },
    { id: 8, name: "지구사랑", dept: "모바일융합공학과", score: 100, avatar: "👨‍🚀" },
    { id: 9, name: "에코사이언티스트", dept: "모바일융합공학과", score: 90, avatar: "👩‍🚀" },
  ];

  // 학과별 개인 랭킹 데이터를 가져오는 함수 추가
  const getDepartmentUserRankings = (deptName: string) => {
    // 학과명이 일치하는 사용자만 필터링
    return userRankings.filter(user => user.dept === deptName);
  };

  // 현재 탭에 해당하는 게시글만 필터링
  const filteredPosts = posts.filter(post => {
    // 탭 필터링
    const matchesTab =
      activeTab === "전체" ? true :
      activeTab === "자유" ? post.category === "자유" :
      activeTab === "비밀" ? post.category === "비밀" :
      activeTab === "랭킹" ? post.isEvent === true :
      true; // 기본값 (모든 게시글 표시)

    // 검색어 필터링
    const matchesSearch = searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

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

  // 나뭇잎 생성 및 애니메이션 효과 useEffect 제거

  // 게시글 작성 처리 함수
  const handlePostSubmit = () => {
    // 제목과 내용이 비어있는지 확인
    if (!postTitle.trim() || !postContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // 새 게시글 ID 생성 (기존 게시글 ID 중 최대값 + 1)
    const maxId = Math.max(...posts.map(post => post.id), 0);
    const newId = maxId + 1;

    // 새 게시글 객체 생성
    const newPost = {
      id: newId,
      title: postTitle,
      content: postContent,
      author: isAnonymous ? "익명" : "환경지킴이", // 실제로는 로그인한 사용자 정보 사용
      time: "방금 전",
      likes: 0,
      category: activeTab === "비밀" ? "비밀" : "자유",
      // 비밀 게시판인 경우 항상 일반 게시글로 설정
      postType: activeTab === "비밀" ? "일반" : postType,
      // 환경활동 게시글이고 비밀 게시판이 아닌 경우에만 이벤트로 표시
      isEvent: activeTab !== "비밀" && postType === "환경활동",
      images: attachedImages // 첨부 이미지 추가
    };

    console.log("새 게시글 생성:", newPost); // 로그 추가

    // 게시글 목록에 추가 (실제로는 API 호출로 서버에 저장)
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);

    // 로컬 스토리지에 게시글 저장
    try {
      // 기존 저장된 게시글 가져오기
      const storedPostsString = localStorage.getItem('community_posts');
      let storedPosts = [];

      if (storedPostsString) {
        storedPosts = JSON.parse(storedPostsString);
        if (!Array.isArray(storedPosts)) {
          storedPosts = [];
        }
      }

      // 새 게시글 추가
      storedPosts.push(newPost);

      // 로컬 스토리지에 저장
      localStorage.setItem('community_posts', JSON.stringify(storedPosts));
      console.log("게시글이 로컬 스토리지에 저장되었습니다:", newPost);
    } catch (error) {
      console.error("로컬 스토리지 저장 오류:", error);
    }

    // 폼 초기화 및 닫기
    setPostTitle("");
    setPostContent("");
    setIsAnonymous(false);
    setAttachedImages([]);
    setPostType("일반");
    setIsWritingPost(false);
  };

  // 게시글 작성 취소 핸들러
  const handleCancelPost = () => {
    // 폼 초기화 및 닫기
    setPostTitle("");
    setPostContent("");
    setIsAnonymous(false);
    setAttachedImages([]);
    setPostType("일반");
    setIsWritingPost(false);
  };

  // 이미지 첨부 처리 함수
  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 실제 구현에서는 서버에 업로드하고 URL을 받아와야 함
    // 여기서는 임시로 File 객체를 URL로 변환하여 사용
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setAttachedImages([...attachedImages, ...newImages]);

    // 파일 입력 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 첨부 이미지 제거 함수
  const removeAttachedImage = (index: number) => {
    const newImages = [...attachedImages];
    // URL.revokeObjectURL(newImages[index]); // 메모리 누수 방지
    newImages.splice(index, 1);
    setAttachedImages(newImages);
  };

  // 사과 클릭 핸들러 함수 수정
  const handleAppleClick = (deptId: number) => {
    // 이미 떨어진 사과인지 확인
    if (fallenApples.includes(deptId)) return;

    // 흔들리는 효과 추가
    setShakingApples(prev => [...prev, deptId]);

    // 0.8초 후 흔들림 효과 제거하고 떨어지는 효과 추가 (1.2초에서 0.8초로 단축)
    setTimeout(() => {
      setShakingApples(prev => prev.filter(id => id !== deptId));
      setFallenApples(prev => [...prev, deptId]);

      // 1초 후 (사과가 바닥에 닿은 후) 랭킹 표시 (1.8초에서 1초로 단축)
      setTimeout(() => {
        setSelectedDept(deptId);
        setShowWholeApple(true);

        // 0.8초 후 사과 자르기 애니메이션 시작 (1초에서 0.8초로 단축)
        setTimeout(() => {
          setIsAppleCutting(true);

          // 0.5초 후 쪼개진 사과 표시 (유지)
          setTimeout(() => {
            setShowWholeApple(false);
            setShowCuttingApple(true);
            setIsAppleCutting(false);
            setShowRanking(true);

            // 3초 후 떨어진 사과 목록에서 제거하여 다시 생성되도록 함 (유지)
            setTimeout(() => {
              setFallenApples(prev => prev.filter(id => id !== deptId));
            }, 3000);
          }, 500);
        }, 800);
      }, 1000);
    }, 800);
  };

  // 구름 상태 수정 - 시작 위치를 오른쪽으로, 속도 빠르게, 분산 배치
  const [clouds, setClouds] = useState<Array<{
    id: number,
    image: string,
    top: string,
    left: string,
    size: number,
    speed: number,
    delay: number,
    zIndex: number
  }>>([
    {
      id: 1,
      image: "/cloud_1.png",
      top: "8%",
      left: "0%", // 시작 위치를 화면 왼쪽 경계로 조정
      size: 80,
      speed: 60, // 속도 2배 빠르게 (120초 → 60초)
      delay: 0,
      zIndex: 1
    },
    {
      id: 2,
      image: "/cloud_2.png",
      top: "25%", // 더 아래로 이동
      left: "10%", // 첫 번째 구름보다 오른쪽에서 시작
      size: 60,
      speed: 75, // 속도 2배 빠르게 (150초 → 75초)
      delay: 5, // 지연 시간 줄임
      zIndex: 2
    },
    {
      id: 3,
      image: "/cloud_1.png",
      top: "3%", // 더 위로 이동
      left: "30%", // 더 오른쪽에서 시작
      size: 70,
      speed: 90, // 속도 2배 빠르게 (180초 → 90초)
      delay: 10, // 지연 시간 줄임
      zIndex: 1
    },
    {
      id: 4,
      image: "/cloud_2.png",
      top: "18%", // 위치 조정
      left: "50%", // 화면 중앙에서 시작
      size: 50,
      speed: 70, // 속도 2배 빠르게 (140초 → 70초)
      delay: 15, // 지연 시간 줄임
      zIndex: 2
    }
  ]);

  // 구름 애니메이션 관리를 위한 useEffect 수정
  useEffect(() => {
    // 구름 애니메이션이 끝나면 새로운 구름 생성
    const cloudInterval = setInterval(() => {
      // 랜덤한 구름 속성 생성
      const newCloud = {
        id: Date.now(),
        image: Math.random() > 0.5 ? "/cloud_1.png" : "/cloud_2.png",
        top: `${3 + Math.random() * 25}%`, // 더 넓은 범위로 분산 (3% ~ 28%)
        left: `${-20 + Math.random() * 40}%`, // 시작 위치를 -20% ~ 20% 사이로 랜덤하게 설정
        size: 50 + Math.random() * 40, // 50px ~ 90px
        speed: 40 + Math.random() * 30, // 40초 ~ 70초 (더 빠르게)
        delay: Math.random() * 5, // 지연 시간 줄임 (0 ~ 5초)
        zIndex: Math.random() > 0.5 ? 1 : 2
      };

      // 구름 배열에 추가 (최대 6개까지만 유지 - 더 적게 유지하여 분산)
      setClouds(prev => {
        const updated = [...prev, newCloud];
        // 구름이 6개를 초과하면 가장 오래된 구름 제거
        return updated.length > 6 ? updated.slice(-6) : updated;
      });
    }, 15000); // 20초에서 15초로 줄여 더 자주 생성

    return () => clearInterval(cloudInterval);
  }, []);

  // 이벤트 팝업 상태 추가
  const [showEventPopup, setShowEventPopup] = useState(false);

  // 이벤트 배너 클릭 핸들러
  const handleEventBannerClick = () => {
    setShowEventPopup(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-toss-gray-50">
      {/* 상단 헤더 - 토스 스타일 */}
      <div className="w-full bg-white py-4 px-5 flex justify-between items-center border-b border-toss-gray-200 sticky top-0 z-50">
        <h1 className="text-xl font-bold text-toss-gray-900">커뮤니티</h1>
        <button
          className="w-10 h-10 bg-toss-gray-100 rounded-full flex items-center justify-center hover:bg-toss-gray-200 transition-colors"
          onClick={() => router.push("/messages")}
          aria-label="쪽지함"
        >
          <FaEnvelope className="text-toss-gray-600 text-lg" />
        </button>
      </div>

      {/* 이벤트 배너 */}
      {!isEventBannerCollapsed && (
        <motion.div
          className="bg-primary-light p-3 flex justify-between items-center cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          onClick={handleEventBannerClick}
        >
          <p className="text-sm text-primary-dark">
            <span className="font-bold">🎉 5월 환경 챌린지</span> - 학과 대항전에 참여하세요!
          </p>
          <button
            className="text-xs text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              setIsEventBannerCollapsed(true);
            }}
          >
            닫기
          </button>
        </motion.div>
      )}

      {/* 오른쪽 상단 화살표 버튼 (배너 닫힘 시만) */}
      {isEventBannerCollapsed && (
        <button
          className="absolute top-5 right-20 z-50 bg-white rounded-full shadow p-1 border border-gray-200 hover:bg-gray-50 transition"
          onClick={() => setIsEventBannerCollapsed(false)}
          aria-label="이벤트 배너 열기"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* 탭 메뉴 - 토스 스타일 */}
      <div className="bg-white px-5 py-3 border-b border-toss-gray-200 sticky top-[68px] z-40">
        <div className="flex bg-toss-gray-100 p-1 rounded-xl">
          {["전체", "자유", "비밀", "랭킹"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 px-3 text-center rounded-lg font-medium text-sm transition-all ${
                activeTab === tab
                  ? "bg-white text-toss-gray-900 shadow-toss-1"
                  : "text-toss-gray-600 hover:text-toss-gray-800"
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
      </div>

      {/* 검색 바 추가 - 고정 */}
      <div className="bg-white p-3 border-b sticky top-[112px] z-30 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="제목, 내용, 작성자 검색"
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setSearchTerm("")}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* 글쓰기 버튼 (랭킹 탭이 아닐 때만 표시) - 토스 스타일 */}
      {activeTab !== "랭킹" && !isWritingPost && (
        <div className="bg-white px-5 py-3 border-b border-toss-gray-200 sticky top-[164px] z-20">
          <button
            className="w-full py-3 bg-toss-green text-white rounded-xl font-medium flex items-center justify-center hover:bg-toss-green/90 transition-colors shadow-toss-1"
            onClick={() => setIsWritingPost(true)}
          >
            <FaPlus className="mr-2" />
            {activeTab === "비밀" ? "비밀 게시글 작성" : "자유 게시글 작성"}
          </button>
        </div>
      )}

      {/* 랭킹 또는 게시글 목록 또는 글쓰기 화면 */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20">
        {isWritingPost ? (
          // 게시글 작성 화면 - 토스 스타일
          <div className="bg-white rounded-2xl p-6 shadow-toss-2 border border-toss-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-toss-gray-900">
                {activeTab === "비밀" ? "비밀 게시글 작성" : "자유 게시글 작성"}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-toss-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  className="w-full p-4 border border-toss-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-toss-green focus:border-toss-green transition-colors"
                  placeholder="제목을 입력하세요"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
              </div>

              {/* 게시글 타입 선택 - 비밀 게시판이 아닐 때만 표시 */}
              {activeTab !== "비밀" && (
                <div>
                  <label className="block text-sm font-medium text-toss-gray-700 mb-2">게시글 타입</label>
                  <div className="flex bg-toss-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                        postType === "일반"
                          ? "bg-white text-toss-gray-900 shadow-toss-1"
                          : "text-toss-gray-600 hover:text-toss-gray-800"
                      }`}
                      onClick={() => setPostType("일반")}
                    >
                      일반 게시글
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                        postType === "환경활동"
                          ? "bg-white text-toss-gray-900 shadow-toss-1"
                          : "text-toss-gray-600 hover:text-toss-gray-800"
                      }`}
                      onClick={() => setPostType("환경활동")}
                    >
                      환경활동 게시글
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-toss-gray-700 mb-2">내용</label>
                <textarea
                  className="w-full p-4 border border-toss-gray-300 rounded-xl h-64 resize-none focus:outline-none focus:ring-2 focus:ring-toss-green focus:border-toss-green transition-colors"
                  placeholder="내용을 입력하세요"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>

              {/* 이미지 첨부 영역 */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-toss-gray-700">이미지 첨부</label>
                  <button
                    type="button"
                    className="text-sm text-toss-green font-medium flex items-center bg-toss-green/10 px-3 py-1 rounded-full hover:bg-toss-green/20 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaPlus className="mr-1" size={12} />
                    이미지 추가
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageAttach}
                  />
                </div>

                {/* 첨부된 이미지 미리보기 */}
                {attachedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {attachedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`첨부 이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeAttachedImage(index)}
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {activeTab === "비밀" && (
                <div className="flex items-center bg-toss-gray-50 p-4 rounded-xl">
                  <input
                    type="checkbox"
                    id="anonymous"
                    className="mr-3 w-4 h-4 text-toss-green bg-gray-100 border-gray-300 rounded focus:ring-toss-green focus:ring-2"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <label htmlFor="anonymous" className="text-sm text-toss-gray-700 font-medium">익명으로 게시하기</label>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  className="px-6 py-3 bg-toss-gray-200 text-toss-gray-700 rounded-xl font-medium hover:bg-toss-gray-300 transition-colors"
                  onClick={handleCancelPost}
                >
                  취소
                </button>
                <button
                  className="px-6 py-3 bg-toss-green text-white rounded-xl font-medium hover:bg-toss-green/90 transition-colors shadow-toss-1"
                  onClick={handlePostSubmit}
                >
                  게시하기
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === "랭킹" ? (
          // 랭킹 화면 - 토스 스타일
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-toss-2 border border-toss-gray-200 mb-6">
              <h2 className="text-xl font-bold text-toss-gray-900 mb-4">에코 포인트 랭킹</h2>

              {/* 학과별 나무 UI */}
              <div className="mb-6 relative overflow-hidden rounded-lg">
                {/* 배경 이미지 추가 - 전체 섹션 커버 */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/background.png"
                    alt="배경"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority
                  />

                  {/* 움직이는 구름 애니메이션 */}
                  <div className="absolute inset-0 overflow-hidden">
                    {clouds.map((cloud) => (
                      <motion.div
                        key={`cloud-${cloud.id}`}
                        className="absolute"
                        style={{
                          top: cloud.top,
                          left: cloud.left,
                          zIndex: cloud.zIndex
                        }}
                        initial={{ x: "0%", y: 0 }}
                        animate={{
                          x: "120%",
                          y: [0, -10, 5, -5, 0, 10, -5, 0] // 위아래로 살짝 움직이는 애니메이션 추가
                        }}
                        transition={{
                          x: {
                            duration: cloud.speed * 0.7,
                            delay: cloud.delay,
                            ease: "linear"
                          },
                          y: {
                            duration: cloud.speed * 0.3, // 위아래 움직임은 더 빠르게
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut"
                          }
                        }}
                        exit={{ opacity: 0 }}
                        onAnimationComplete={() => {
                          setTimeout(() => {
                            setClouds(prev => prev.filter(c => c.id !== cloud.id));
                          }, 300);
                        }}
                      >
                        <Image
                          src={cloud.image}
                          alt="구름"
                          width={cloud.size}
                          height={cloud.size / 2}
                          className="object-contain opacity-70"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 p-3">
                  <h3 className="text-base font-bold text-primary-dark mb-1 bg-white p-2 rounded-lg shadow-sm inline-flex items-center">
                    학과별 에코 포인트
                  </h3>

                  <div className="text-xs text-gray-600 mb-3 bg-white bg-opacity-90 px-2 py-1 rounded-full shadow-sm border border-gray-100 inline-flex items-center">
                    <span className="mr-1 text-primary">🕒</span>
                    <span className="font-medium">현재:</span> {currentTime} <span className="mx-1 text-gray-300">|</span> <span className="font-medium">갱신:</span> {updateTime}
                  </div>

                  {/* 큰 나무 이미지 - 학교 표현 - 500x500 비율에 맞게 수정, 아래로 내림 */}
                  <div className="w-[375px] h-[500px] mx-auto relative pt-12">
                    <Image
                      src="/tree/tree_large.png"
                      alt="학교 나무"
                      width={375}
                      height={500}
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

                        // 점수에 따라 다른 사과 이미지 선택
                        const appleImage =
                          dept.score >= 400 ? "/apple/apple.png" :
                          dept.score >= 350 ? "/yellow_apple.png" :
                          "/green_apple.png";

                        // 위치 설정 - 나무가 아래로 내려간 것에 맞춰 조정
                        const positions = [
                          { top: "25%", left: "15%", rotate: -5 },  // 왼쪽 상단 (환경공학과 - 빨간 사과)
                          { top: "22%", right: "20%", rotate: 8 },  // 오른쪽 상단 (에너지시스템공학과 - 노란 사과)
                          { top: "45%", right: "25%", rotate: -10 }, // 오른쪽 중간 (지구환경과학과 - 녹색 사과)
                        ];

                        const position = positions[index % positions.length];

                        // 흔들리는 효과 설정
                        const isShaking = shakingApples.includes(dept.id);

                        return (
                          <motion.div
                            key={`apple-${dept.id}`}
                            className="absolute"
                            style={{
                              top: position.top,
                              left: position.left || "auto",
                              right: position.right || "auto",
                              zIndex: 20 - index // 앞쪽에 있는 사과가 더 위에 표시되도록
                            }}
                            animate={isShaking ? {
                              rotate: [position.rotate, position.rotate - 5, position.rotate + 5, position.rotate - 8, position.rotate + 8,
                                      position.rotate - 10, position.rotate + 10, position.rotate - 8, position.rotate + 8,
                                      position.rotate - 5, position.rotate + 5, position.rotate],
                              x: [0, -2, 2, -3, 3, -4, 4, -3, 3, -2, 2, 0],
                              y: [0, 1, -1, 2, -2, 2, -2, 2, -2, 1, -1, 0]
                            } : {
                              rotate: position.rotate
                            }}
                            transition={isShaking ? {
                              duration: 1.2,
                              ease: "easeInOut",
                              times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1]
                            } : {}}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAppleClick(dept.id)}
                          >
                            <div className="relative">
                              {/* 사과 이미지와 점수 */}
                              <div className="relative">
                                <Image
                                  src={appleImage}
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

                              {/* 학과명 라벨 제거 */}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {/* 떨어지는 사과 애니메이션 */}
                    <AnimatePresence>
                      {fallenApples.map(appleId => {
                        const dept = departmentRankings.find(d => d.id === appleId);
                        if (!dept) return null;

                        const index = userCollegeDepartments.findIndex(d => d.id === appleId);

                        // 포인트에 비례하는 크기 계산 (최소 50px, 최대 100px으로 확대)
                        const minSize = 50;
                        const maxSize = 100; // 최대 크기 확대
                        const scoreRange = 450 - 320; // 최고 점수와 최저 점수의 차이
                        const normalizedScore = dept.score - 320; // 최저 점수를 0으로 정규화
                        const sizeRange = maxSize - minSize;

                        // 비선형 스케일링 적용 (제곱 함수 사용)
                        const normalizedRatio = Math.pow(normalizedScore / scoreRange, 1.5);
                        const size = minSize + (normalizedRatio * sizeRange);

                        // 점수에 따라 다른 사과 이미지 선택
                        const appleImage =
                          dept.score >= 400 ? "/apple/apple.png" :
                          dept.score >= 350 ? "/yellow_apple.png" :
                          "/green_apple.png";

                        // 위치 계산 - 원래 사과 위치와 일치하게 배치 (조정됨)
                        const positions = [
                          { top: "25%", left: "15%", rotate: -5 },  // 왼쪽 상단 (환경공학과 - 빨간 사과)
                          { top: "22%", right: "20%", rotate: 8 },  // 오른쪽 상단 (에너지시스템공학과 - 노란 사과)
                          { top: "45%", right: "25%", rotate: -10 }, // 오른쪽 중간 (지구환경과학과 - 녹색 사과)
                        ];

                        const position = positions[index % positions.length];

                        // 바닥 위치 계산 (컨테이너 높이의 약 90%)
                        const floorPosition = "90%";

                        // 좌우 이동 방향 결정 (왼쪽에 있으면 오른쪽으로, 오른쪽에 있으면 왼쪽으로)
                        const horizontalDirection = position.left ? 1 : -1;
                        const horizontalOffset = horizontalDirection * (10 + Math.random() * 15);

                        return (
                          <motion.div
                            key={`falling-${appleId}`}
                            className="absolute"
                            initial={{
                              top: position.top,
                              left: position.left || "auto",
                              right: position.right || "auto",
                              rotate: position.rotate,
                              scale: 1
                            }}
                            animate={{
                              top: floorPosition,
                              rotate: position.rotate + (Math.random() > 0.5 ? 180 : -180),
                              x: [0, horizontalOffset * 0.3, horizontalOffset * 0.6, horizontalOffset],
                              opacity: [1, 1, 1, 0],
                              zIndex: 50
                            }}
                            transition={{
                              top: {
                                duration: 0.8, // 떨어지는 속도를 1.5초에서 0.8초로 단축
                                ease: "easeIn"
                              },
                              rotate: {
                                duration: 0.8, // 회전 속도도 동일하게 단축
                                ease: "easeIn"
                              },
                              x: {
                                duration: 0.8, // 좌우 이동 속도도 동일하게 단축
                                times: [0, 0.3, 0.6, 1],
                                ease: "easeOut"
                              },
                              opacity: {
                                duration: 0.8, // 투명도 변화 속도도 동일하게 단축
                                times: [0, 0.7, 0.9, 1],
                                ease: "easeOut"
                              },
                              zIndex: {
                                delay: 0
                              }
                            }}
                          >
                            <div className="relative">
                              <div className="relative">
                                <Image
                                  src={appleImage}
                                  alt={`${dept.name} 떨어지는 사과`}
                                  width={size}
                                  height={size}
                                  className="object-contain"
                                />
                                {/* 점수 표시 - 사과 중앙에 표시 */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-green-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm border border-green-500">
                                  {dept.score}
                                </div>
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
                      animate={{
                        y: [0, -5, 0, -5, 0],
                        opacity: 1
                      }}
                      transition={{
                        y: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        },
                        opacity: { duration: 0.5 }
                      }}
                    >
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-dark">
                          사과를 클릭하여 랭킹을 확인하세요!
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* 범례(Legend) 추가 */}
              <div className="mt-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-sm">
                <h4 className="text-sm font-bold text-primary-dark mb-2">학과별 에코 포인트</h4>
                <div className="space-y-2">
                  {userCollegeDepartments.map((dept) => (
                    <div key={`legend-${dept.id}`} className="flex items-center py-2">
                      <div className="w-6 h-6 mr-3">
                        <Image
                          src={
                            dept.score >= 400 ? "/apple/apple.png" :
                            dept.score >= 350 ? "/yellow_apple.png" :
                            "/green_apple.png"
                          }
                          alt={dept.name}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-sm font-medium leading-none">{dept.name}</span>
                      </div>
                      <span className="text-sm text-primary-dark ml-auto font-bold">{dept.score}점</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 여백 줄임 */}
              <div className="h-4"></div>

              {/* 단과대 랭킹 섹션 */}
              <div className="mt-2">
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
              </div>
            </div>
          </div>
        ) : (
          // 게시글 목록 - 토스 스타일
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                className={`p-5 rounded-2xl shadow-toss-1 border cursor-pointer transition-all hover:shadow-toss-2 ${
                  post.postType === "환경활동"
                    ? "bg-toss-green/5 border-toss-green/20"
                    : "bg-white border-toss-gray-200"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => router.push(`/community/post/${post.id}`)}
              >
                {/* 게시글 타입 표시 */}
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    post.postType === "환경활동"
                      ? "bg-toss-green text-white"
                      : "bg-toss-gray-100 text-toss-gray-700"
                  }`}>
                    {post.postType}
                  </span>
                  <span className="text-xs text-toss-gray-500">{post.time}</span>
                </div>

                <h2 className="text-lg font-bold text-toss-gray-900 mb-2">{post.title}</h2>
                <p className="text-toss-gray-600 mb-3 line-clamp-2">{post.content}</p>

                {/* 첨부 이미지가 있는 경우 표시 */}
                {post.images && post.images.length > 0 && (
                  <div className="mb-3">
                    <div className="grid grid-cols-3 gap-2">
                      {post.images.map((image, index) => (
                        <div key={index} className="w-full h-24 bg-toss-gray-100 rounded-xl overflow-hidden">
                          <img
                            src={image}
                            alt={`${post.title} 이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-toss-gray-500 text-sm">
                    {post.author} • {post.time}
                  </div>
                  <div className="flex items-center text-toss-green">
                    {post.isEvent ? (
                      <span className="text-toss-green font-medium">👍 {post.author}</span>
                    ) : (
                      <>
                        <FaThumbsUp className="mr-1" />
                        <span>{post.likes}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
        {(showWholeApple || showCuttingApple) && selectedDept && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowRanking(false);
              setShowWholeApple(false);
              setShowCuttingApple(false);
              setSelectedDept(null);
            }}
          >
            <motion.div
              className="relative h-full flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 멀쩡한 사과 이미지 */}
              {showWholeApple && (
                <motion.div
                  className="relative w-[375px] h-[375px] md:w-[500px] md:h-[500px]"
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: isAppleCutting ? [0, -5, 5, -5, 5, 0] : 0
                  }}
                  transition={{
                    scale: { type: "spring", damping: 15, stiffness: 100, duration: 0.5 },
                    rotate: {
                      duration: 0.5,
                      repeat: isAppleCutting ? Infinity : 0,
                      repeatType: "loop"
                    }
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* 선택된 학과의 점수에 따라 다른 사과 이미지 표시 */}
                    {selectedDept && (() => {
                      const dept = departmentRankings.find(d => d.id === selectedDept);
                      if (!dept) return null;

                      const appleImage =
                        dept.score >= 400 ? "/apple/apple.png" :
                        dept.score >= 350 ? "/yellow_apple.png" :
                        "/green_apple.png";

                      return (
                        <Image
                          src={appleImage}
                          alt="사과"
                          width={450}
                          height={450}
                          className="object-contain"
                        />
                      );
                    })()}
                  </div>
                </motion.div>
              )}

              {/* 쪼개진 사과 이미지 */}
              {showCuttingApple && (
                <motion.div
                  className="relative w-[375px] h-[375px] md:w-[500px] md:h-[500px]"
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1
                  }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 100,
                    duration: 0.8
                  }}
                >
                  {selectedDept && (() => {
                    const dept = departmentRankings.find(d => d.id === selectedDept);
                    if (!dept) return null;

                    // 점수에 따라 다른 쪼개진 사과 이미지 선택
                    const cuttingAppleImage =
                      dept.score >= 400 ? "/cutting_apple.png" :
                      dept.score >= 350 ? "/cutting_yellow_apple.png" :
                      "/cutting_green_apple.png";

                    return (
                      <div className="relative w-full h-full">
                        <Image
                          src={cuttingAppleImage}
                          alt="쪼개진 사과"
                          width={500}
                          height={500}
                          className="object-contain"
                        />
                      </div>
                    );
                  })()}

                  {/* 랭킹 내용 - 사과 이미지 위에 직접 표시 */}
                  <AnimatePresence>
                    {showRanking && (
                      <motion.div
                        className="absolute inset-0 flex flex-col justify-center items-center"
                        style={{ paddingTop: "50px" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* 헤더 - 배경 있는 컨테이너 */}
                        <div className="w-[200px] md:w-[250px] bg-white bg-opacity-80 rounded-t-lg p-2 shadow-md">
                          <h3 className="text-base md:text-lg font-bold text-primary-dark text-center">
                            {selectedDept && departmentRankings.find(d => d.id === selectedDept)?.name} 개인 랭킹
                          </h3>
                        </div>

                        {/* 랭킹 목록 */}
                        <div className="w-[200px] md:w-[250px] bg-white bg-opacity-80 p-2 rounded-b-lg shadow-md">
                          {selectedDept && (() => {
                            const deptName = departmentRankings.find(d => d.id === selectedDept)?.name || "";
                            const deptUsers = getDepartmentUserRankings(deptName);

                            // 해당 학과의 사용자가 없는 경우 메시지 표시
                            if (deptUsers.length === 0) {
                              return (
                                <div className="text-center py-2 text-gray-500 text-sm md:text-base">
                                  이 학과의 개인 랭킹 데이터가 없습니다.
                                </div>
                              );
                            }

                            return deptUsers.map((user, index) => (
                              <div key={user.id} className="flex items-center py-1 border-b border-gray-100 last:border-0">
                                <div className="w-6 h-6 flex items-center justify-center text-sm md:text-base">
                                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
                                </div>
                                <div className="w-6 h-6 flex items-center justify-center text-base md:text-lg">
                                  {user.avatar}
                                </div>
                                <div className="ml-1 flex-1">
                                  <div className="font-medium text-sm md:text-base">{user.name}</div>
                                  <div className="text-xs md:text-sm text-gray-500">{user.dept}</div>
                                </div>
                                <div className="font-bold text-primary-dark text-sm md:text-base">{user.score}점</div>
                              </div>
                            ));
                          })()}
                        </div>

                        {/* 닫기 버튼 */}
                        <div className="w-[200px] mt-2">
                          <button
                            className="w-full bg-green-500 text-white py-1 rounded-lg font-medium text-base hover:bg-green-600 transition-colors"
                            onClick={() => {
                              setShowRanking(false);
                              setShowWholeApple(false);
                              setShowCuttingApple(false);
                              setSelectedDept(null);
                            }}
                          >
                            닫기
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 게시글 작성 폼 모달 - 삭제 */}
      {/* <AnimatePresence>
        {showPostForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPostForm(false)}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-md p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary-dark">
                  {activeTab === "비밀" ? "비밀 게시글 작성" : "자유 게시글 작성"}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPostForm(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="제목을 입력하세요"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="내용을 입력하세요"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                </div>

                {activeTab === "비밀" && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      className="mr-2"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-700">익명으로 게시하기</label>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    onClick={() => setShowPostForm(false)}
                  >
                    취소
                  </button>
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    onClick={handlePostSubmit}
                  >
                    게시하기
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
      {/* 이벤트 팝업 */}
      <AnimatePresence>
        {showEventPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEventPopup(false)}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-md p-5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary-dark flex items-center">
                  <span className="text-2xl mr-2">🏆</span> 5월 환경 챌린지: 학과 대항전
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowEventPopup(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-4">
                <div className="bg-primary-light p-3 rounded-lg mb-3">
                  <p className="text-primary-dark font-medium">
                    여러분의 환경 활동이 학과의 승리를 결정합니다!
                  </p>
                </div>

                <p className="text-gray-700 mb-3">
                  5월 한 달 동안 진행되는 학과 대항전에 참여하여 여러분의 학과가 1등을 차지할 수 있도록 도와주세요.
                </p>

                <h3 className="font-bold text-gray-800 mb-2">참여 방법</h3>
                <ul className="list-disc pl-5 mb-3 text-gray-700 space-y-1">
                  <li>환경 관련 활동을 하고 인증하기</li>
                  <li>커뮤니티에 환경 활동 게시글 작성하기</li>
                  <li>캠퍼스 내 분리수거 참여하기</li>
                  <li>친환경 제품 사용 인증하기</li>
                  <li>대중교통 이용 인증하기</li>
                </ul>

                <h3 className="font-bold text-gray-800 mb-2">상품</h3>
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="font-medium text-gray-800 mb-1">🥇 1등 학과</p>
                  <p className="text-gray-700 mb-2">학과 전체 에코 포인트 5,000점 + 친환경 텀블러 제공</p>

                  <p className="font-medium text-gray-800 mb-1">🥈 2등 학과</p>
                  <p className="text-gray-700 mb-2">학과 전체 에코 포인트 3,000점</p>

                  <p className="font-medium text-gray-800 mb-1">🥉 3등 학과</p>
                  <p className="text-gray-700">학과 전체 에코 포인트 1,000점</p>
                </div>

                <p className="text-sm text-gray-500">
                  * 대회 기간: 2023년 5월 1일 ~ 5월 31일<br />
                  * 결과 발표: 2023년 6월 5일
                </p>
              </div>

              <button
                className="w-full py-3 bg-primary text-white rounded-lg font-medium"
                onClick={() => setShowEventPopup(false)}
              >
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;