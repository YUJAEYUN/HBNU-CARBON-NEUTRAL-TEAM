"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaThumbsUp, FaRegThumbsUp, FaComment, FaShare, FaEnvelope, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { use } from "react";

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
  likedByCurrentUser?: boolean; // 현재 사용자가 좋아요 눌렀는지 여부
}

interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
  likes: number;
}

// 댓글 데이터
const COMMENTS: Record<number, Comment[]> = {
  1: [
    {
      id: 1,
      author: "에코라이프",
      content: "저도 텀블러 사용하고 있어요! 환경도 지키고 할인도 받고 일석이조네요.",
      time: "12시간 전",
      likes: 5
    },
    {
      id: 2,
      author: "커피러버",
      content: "텀블러 세척은 어떻게 하시나요? 저는 항상 세척이 귀찮아서...",
      time: "10시간 전",
      likes: 3
    },
    {
      id: 3,
      author: "그린캠퍼스",
      content: "좋은 정보 공유 감사합니다! 학교 내 카페에서도 텀블러 사용을 적극 권장하고 있어요.",
      time: "8시간 전",
      likes: 7
    }
  ],
  2: [
    {
      id: 1,
      author: "맛집탐방",
      content: "오늘 제2식당 비빔밥 괜찮았어요!",
      time: "22시간 전",
      likes: 4
    },
    {
      id: 2,
      author: "학식러",
      content: "저는 오늘 돈까스 먹었는데 맛있었어요~",
      time: "20시간 전",
      likes: 2
    }
  ],
  3: [
    {
      id: 1,
      author: "절약왕",
      content: "세탁기는 꽉 채워서 돌리는게 좋아요! 물과 전기 모두 절약됩니다.",
      time: "30시간 전",
      likes: 8
    }
  ],
  4: [
    {
      id: 1,
      author: "시험고수",
      content: "저번 학기 족보 있어요. DM 주세요.",
      time: "38시간 전",
      likes: 15
    }
  ]
};

// 게시글 데이터도 컴포넌트 외부에 정의
const POSTS: Post[] = [
  {
    id: 1,
    title: "학교 내 카페에서 텀블러 사용하면 할인!",
    content: "스타벅스, 투썸 모두 500원씩 할인되네요. 텀블러 사용하면 일회용 컵 사용을 줄일 수 있어서 환경에도 좋고 할인도 받을 수 있어 일석이조입니다. 여러분도 텀블러 사용 어떠세요?",
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
    content: "제1식당 두부스테이크 괜찮던데 다른 추천? 오늘 점심 뭐 먹을지 고민중입니다. 맛있는 메뉴 있으면 알려주세요!",
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
    content: "빨래 모아서 하면 세제/전기 절약됩니다! 또한 샤워 시간을 줄이면 물 절약에 도움이 됩니다. 여러분의 절약 팁도 댓글로 공유해주세요.",
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
    content: "다음 주 월요일부터 금요일까지 중앙도서관 앞에서 일회용품 줄이기 캠페인을 진행합니다. 많은 참여 부탁드립니다!",
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
    content: "다음 달 15일 개최되는 '대학생 기후변화 대응 포럼'에 함께 참여할 학우를 모집합니다. 관심 있는 분들의 많은 지원 바랍니다.",
    author: "기후변화연구회",
    time: "3일 전",
    likes: 15,
    category: "자유",
    postType: "환경활동",
    isEvent: true,
    images: []
  }
];

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [likedComments, setLikedComments] = useState<number[]>([]);
  const [hasParticipated, setHasParticipated] = useState(false);
  
  // 쪽지 관련 상태 추가
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(""); // 쪽지 받는 사람
  const [messagePostTitle, setMessagePostTitle] = useState(""); // 관련 게시글 제목
  
  // params를 React.use()로 풀어서 사용
  const resolvedParams = use(params);
  const postId = parseInt(resolvedParams.id);

  console.log("Rendering PostDetailPage with ID:", postId);
  
  // 컴포넌트가 마운트될 때 한 번만 실행
  useEffect(() => {
    console.log("PostDetailPage useEffect - postId:", postId);
    
    // 로컬 스토리지에서 게시글 데이터 가져오기
    try {
      // 기본 게시글 데이터
      let allPosts = [...POSTS]; 
      
      // 기본 게시글 좋아요 상태 불러오기
      const defaultPostsLikesString = localStorage.getItem('default_posts_likes');
      if (defaultPostsLikesString) {
        try {
          const defaultPostsLikes = JSON.parse(defaultPostsLikesString);
          if (Array.isArray(defaultPostsLikes)) {
            // 기본 게시글에 좋아요 상태 적용
            allPosts = allPosts.map(post => {
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
            console.log("기본 게시글 좋아요 상태 적용:", defaultPostsLikes.length);
          }
        } catch (parseError) {
          console.error("기본 게시글 좋아요 상태 파싱 오류:", parseError);
        }
      }
      
      // 로컬 스토리지에 저장된 게시글 가져오기
      const storedPostsString = localStorage.getItem('community_posts');
      
      // 로컬 스토리지에 저장된 게시글이 있으면 추가
      if (storedPostsString) {
        try {
          const storedPosts = JSON.parse(storedPostsString);
          if (Array.isArray(storedPosts)) {
            // 로컬 스토리지의 게시글을 기본 게시글 앞에 추가 (최신순)
            allPosts = [...storedPosts, ...allPosts];
            console.log("로컬 스토리지에서 불러온 게시글:", storedPosts.length);
          }
        } catch (parseError) {
          console.error("로컬 스토리지 데이터 파싱 오류:", parseError);
        }
      }
      
      console.log("Available posts:", allPosts.map(p => `ID: ${p.id}, Type: ${p.postType}`));
      
      // 게시글 찾기
      const foundPost = allPosts.find(p => p.id === postId);
      console.log("Found post:", foundPost);
      
      if (foundPost) {
        // 로컬 스토리지에서 좋아요 상태 불러오기
        const savedPostLike = localStorage.getItem(`post_like_${postId}`);
        
        // 좋아요 상태에 따라 게시글 객체 업데이트
        if (savedPostLike === 'true') {
          foundPost.likedByCurrentUser = true;
          setIsLiked(true);
        } else {
          foundPost.likedByCurrentUser = false;
        }
        
        setPost(foundPost);
        console.log("게시글 타입:", foundPost.postType, "좋아요 상태:", foundPost.likedByCurrentUser);
        
        // 해당 게시글의 댓글 가져오기
        const postComments = COMMENTS[postId] || [];
        console.log("Setting comments for post ID:", postId, postComments);
        setComments(postComments);
        
        // 로컬 스토리지에서 댓글 좋아요 상태 불러오기
        const savedCommentLikes = localStorage.getItem(`comment_likes_${postId}`);
        if (savedCommentLikes) {
          setLikedComments(JSON.parse(savedCommentLikes));
        }
        
        // 로컬 스토리지에서 참여 상태 불러오기
        const participated = localStorage.getItem(`participated_${postId}`);
        if (participated === 'true') {
          setHasParticipated(true);
        }
      } else {
        // 게시글이 없으면 목록으로 리다이렉트
        console.error("게시글을 찾을 수 없음:", postId);
        alert("게시글을 찾을 수 없습니다.");
        router.push("/community");
      }
    } catch (error) {
      console.error("로컬 스토리지 접근 오류:", error);
      alert("게시글 데이터를 불러오는 중 오류가 발생했습니다.");
      router.push("/community");
    } finally {
      // 로딩 상태 업데이트
      setLoading(false);
    }
  }, [postId, router]);

  // 좋아요 토글
  const toggleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // 로컬 스토리지에 좋아요 상태 저장
    localStorage.setItem(`post_like_${postId}`, newLikedState.toString());
    
    if (post) {
      // 게시글 객체에 좋아요 상태 저장 (새로운 필드 추가)
      const updatedPost = {
        ...post,
        likes: isLiked ? post.likes - 1 : post.likes + 1,
        likedByCurrentUser: newLikedState
      };
      setPost(updatedPost);
      
      // 로컬 스토리지의 게시글 목록에서도 좋아요 수 업데이트
      updatePostInLocalStorage(updatedPost);
    }
  };

  // 로컬 스토리지의 게시글 정보 업데이트 함수
  const updatePostInLocalStorage = (updatedPost: Post) => {
    try {
      // 로컬 스토리지에서 게시글 목록 가져오기
      const storedPostsString = localStorage.getItem('community_posts');
      let updated = false;
      
      if (storedPostsString) {
        const storedPosts = JSON.parse(storedPostsString);
        if (Array.isArray(storedPosts)) {
          // 해당 게시글 찾아서 업데이트
          const updatedPosts = storedPosts.map(p => {
            if (p.id === updatedPost.id) {
              updated = true;
              return { ...p, likes: updatedPost.likes, likedByCurrentUser: updatedPost.likedByCurrentUser };
            }
            return p;
          });
          
          // 업데이트된 게시글 목록 저장
          localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
          console.log("게시글 좋아요 수가 로컬 스토리지에 업데이트되었습니다:", updatedPost.id, updatedPost.likes);
        }
      }
      
      // 기본 게시글 목록(POSTS)에 있는 경우도 처리
      // 로컬 스토리지에서 업데이트되지 않은 경우 (기본 게시글인 경우)
      if (!updated) {
        // 기본 게시글 목록에서 해당 게시글 찾기
        const defaultPostIndex = POSTS.findIndex(p => p.id === updatedPost.id);
        if (defaultPostIndex !== -1) {
          // 기본 게시글 업데이트 (메모리에만 반영)
          POSTS[defaultPostIndex] = {
            ...POSTS[defaultPostIndex],
            likes: updatedPost.likes,
            likedByCurrentUser: updatedPost.likedByCurrentUser
          };
          console.log("기본 게시글 좋아요 수가 업데이트되었습니다:", updatedPost.id, updatedPost.likes);
          
          // 기본 게시글 목록의 변경사항을 로컬 스토리지에 저장
          localStorage.setItem('default_posts_likes', JSON.stringify(
            POSTS.map(p => ({ id: p.id, likes: p.likes, likedByCurrentUser: p.likedByCurrentUser }))
          ));
        }
      }
    } catch (error) {
      console.error("로컬 스토리지 업데이트 오류:", error);
    }
  };

  // 댓글 작성
  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: comments.length + 1,
      author: "나",
      content: commentText,
      time: "방금 전",
      likes: 0
    };
    
    setComments([...comments, newComment]);
    setCommentText("");
  };

  // 댓글 좋아요
  const handleCommentLike = (commentId: number) => {
    // 이미 좋아요를 누른 댓글인지 확인
    if (likedComments.includes(commentId)) {
      return; // 이미 좋아요를 누른 경우 아무 작업도 하지 않음
    }
    
    // 좋아요 상태 업데이트
    const updatedLikedComments = [...likedComments, commentId];
    setLikedComments(updatedLikedComments);
    
    // 로컬 스토리지에 좋아요 상태 저장
    localStorage.setItem(`comment_likes_${postId}`, JSON.stringify(updatedLikedComments));
    
    // 댓글 좋아요 수 증가
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 } 
        : comment
    ));
  };

  // 공유하기
  const handleShare = () => {
    // 실제 구현에서는 공유 API 사용
    alert("공유 기능은 준비 중입니다.");
  };

  // 참여 버튼 클릭 핸들러
  const handleParticipate = () => {
    if (post?.postType === "환경활동") {
      if (!hasParticipated) {
        // 참여 처리
        setHasParticipated(true);
        localStorage.setItem(`participated_${postId}`, 'true');
        alert("참여 신청이 완료되었습니다!");
        // 실제로는 API 호출로 참여 신청 처리
      } else {
        // 참여 취소 처리
        setHasParticipated(false);
        localStorage.setItem(`participated_${postId}`, 'false');
        alert("참여 신청이 취소되었습니다.");
        // 실제로는 API 호출로 참여 취소 처리
      }
    }
  };

  // 쪽지 보내기 함수
  const handleSendMessage = () => {
    if (!messageText.trim()) {
      alert("쪽지 내용을 입력해주세요.");
      return;
    }
    
    // 실제 구현에서는 API 호출로 쪽지 전송
    console.log("쪽지 전송:", {
      to: messageRecipient,
      content: messageText,
      postId: postId,
      postTitle: messagePostTitle
    });
    
    // 쪽지 전송 성공 표시
    setMessageSent(true);
    
    // 3초 후 모달 닫기
    setTimeout(() => {
      setShowMessageModal(false);
      setMessageText("");
      setMessageSent(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 - iOS 스타일 */}
      <div className="sticky top-0 z-10 bg-primary py-4 px-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <button
            className="text-white mr-2 p-2 rounded-full hover:bg-primary-dark transition-colors"
            onClick={() => router.push("/community")}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-semibold text-white">게시글</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleLike}
            className="p-2 rounded-full hover:bg-primary-dark transition-colors"
          >
            {isLiked ? (
              <FaThumbsUp className="text-white" />
            ) : (
              <FaRegThumbsUp className="text-white" />
            )}
          </button>
          <button 
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-primary-dark transition-colors"
          >
            <FaShare className="text-white" />
          </button>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="p-4">
        <motion.div
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-4">
            {/* 게시글 타입 표시 */}
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                post.postType === "환경활동" 
                  ? "bg-primary-dark text-white" 
                  : "bg-gray-200 text-gray-700"
              }`}>
                {post.postType}
              </span>
              <span className="text-xs text-gray-500">{post.time}</span>
            </div>
            
            <h1 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h1>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 font-medium">{post.author}</span>
                {/* 쪽지 보내기 버튼 - 더 명확하게 표시 */}
                <button 
                  className="ml-2 text-xs flex items-center text-primary bg-primary-light px-2 py-1 rounded-full"
                  onClick={() => {
                    setMessageRecipient(post.author);
                    setMessagePostTitle(post.title);
                    setShowMessageModal(true);
                  }}
                >
                  <FaEnvelope className="mr-1" />
                  <span>쪽지</span>
                </button>
              </div>
              <span className="text-sm text-gray-600">좋아요 {post.likes}개</span>
            </div>
            
            <div className="border-t border-b py-4 mb-4">
              <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
            </div>
            
            {/* 환경활동 게시글인 경우 참여 버튼 표시 */}
            {post.postType === "환경활동" && (
              <div className="mb-4">
                <button
                  className={`w-full py-3 rounded-lg font-medium ${
                    hasParticipated 
                      ? "bg-gray-200 text-gray-700" 
                      : "bg-primary text-white"
                  }`}
                  onClick={handleParticipate}
                >
                  {hasParticipated ? "참여 취소하기" : "참여하기"}
                </button>
              </div>
            )}
            
            <div className="flex justify-between items-center py-3 border-t border-b">
              <button 
                className="flex items-center text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={toggleLike}
              >
                {isLiked ? (
                  <FaThumbsUp className="mr-2 text-primary" />
                ) : (
                  <FaRegThumbsUp className="mr-2" />
                )}
                <span>좋아요</span>
              </button>
              <button className="flex items-center text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <FaComment className="mr-2" />
                <span>댓글 {comments.length}</span>
              </button>
              <button 
                className="flex items-center text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={handleShare}
              >
                <FaShare className="mr-2" />
                <span>공유</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* 댓글 섹션 */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3 px-2">
            댓글 {comments.length}개
          </h3>
          
          {/* 댓글 목록 */}
          <div className="space-y-3 mb-4">
            {comments.map((comment) => (
              <motion.div 
                key={comment.id} 
                className="bg-white p-4 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">{comment.author}</span>
                    {/* 댓글 작성자에게 쪽지 보내기 버튼 */}
                    {comment.author !== "나" && (
                      <button 
                        className="ml-2 text-xs flex items-center text-primary bg-primary-light px-2 py-1 rounded-full"
                        onClick={() => {
                          setMessageRecipient(comment.author);
                          setMessagePostTitle(post.title);
                          setShowMessageModal(true);
                        }}
                      >
                        <FaEnvelope className="mr-1" />
                        <span>쪽지</span>
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{comment.time}</span>
                </div>
                <p className="text-gray-700 my-2 leading-relaxed">{comment.content}</p>
                <button 
                  className={`text-xs ${likedComments.includes(comment.id) ? 'text-primary' : 'text-gray-500'} flex items-center hover:text-primary transition-colors`}
                  onClick={() => handleCommentLike(comment.id)}
                  disabled={likedComments.includes(comment.id)}
                >
                  <FaThumbsUp className="mr-1" />
                  <span>좋아요 {comment.likes}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 댓글 작성 */}
      <div className="sticky bottom-0 p-3 bg-gray-50">
        <div className="flex items-center bg-white rounded-xl overflow-hidden border shadow-sm">
          <input
            type="text"
            className="flex-1 p-3 outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            placeholder="댓글을 입력하세요..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
          />
          <button
            className="bg-primary text-white px-4 py-3 hover:bg-primary-dark transition-colors"
            onClick={handleCommentSubmit}
          >
            등록
          </button>
        </div>
      </div>

      {/* 쪽지 보내기 모달 */}
      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !messageSent && setShowMessageModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-md p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {messageSent ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">쪽지를 보냈습니다</h3>
                  <p className="text-gray-600">
                    {messageRecipient}님에게 쪽지를 성공적으로 전송했습니다.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-primary-dark">
                      쪽지 보내기
                    </h2>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setShowMessageModal(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">받는 사람:</span>
                      <span className="ml-2 text-sm text-gray-900">{messageRecipient}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <span className="text-sm font-medium text-gray-700">게시글:</span>
                      <span className="ml-2 text-sm text-gray-900 truncate">{messagePostTitle}</span>
                    </div>
                    
                    <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="쪽지 내용을 입력하세요..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      onClick={() => setShowMessageModal(false)}
                    >
                      취소
                    </button>
                    <button
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                      onClick={handleSendMessage}
                    >
                      보내기
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
