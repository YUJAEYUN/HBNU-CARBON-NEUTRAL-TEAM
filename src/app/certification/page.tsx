"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCamera, FaSearch, FaCalendarAlt, FaFilter, FaCheck, FaTimes, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

const CERTIFICATION_TYPES = [
  { id: "receipt", label: "전자영수증", icon: "🧾", color: "#C8E6C9" },    // 연한 녹색 (파스텔)
  { id: "refill", label: "리필스테이션", icon: "🔄", color: "#B3E5FC" }, // 연한 파랑 (파스텔)
  { id: "container", label: "다회용기", icon: "🥡", color: "#FFECB3" },  // 연한 노란색 (파스텔)
  { id: "tumbler", label: "텀블러", icon: "☕", color: "#D7CCC8" },      // 연한 브라운 (파스텔)
  { id: "email", label: "이메일지우기", icon: "📧", color: "#CFD8DC" },  // 연한 회색 (파스텔)
  { id: "recycle", label: "전기전자폐기", icon: "♻️", color: "#DCEDC8" } // 연한 연두색 (파스텔)
];


// 샘플 인증 데이터 - 더 많은 목업 데이터 추가
const SAMPLE_CERTIFICATIONS = [
  {
    id: 1,
    type: "tumbler",
    title: "카페에서 텀블러 사용",
    date: "2023-05-10",
    time: "09:30",
    timeAgo: "10분 전",
    location: "교내 카페",
    carbonReduction: 0.12,
    verified: true,
    points: 15,
    image: "/certification/tumbler.jpg"
  },
  {
    id: 2,
    type: "container",
    title: "식당에서 다회용기 사용",
    date: "2023-05-10",
    time: "12:45",
    timeAgo: "3시간 전",
    location: "학생 식당",
    carbonReduction: 0.25,
    verified: true,
    points: 20,
    image: "/certification/container.jpg"
  },
  {
    id: 3,
    type: "receipt",
    title: "편의점 전자영수증 사용",
    date: "2023-05-10",
    time: "18:20",
    timeAgo: "오늘",
    location: "CU 편의점",
    carbonReduction: 0.05,
    verified: true,
    points: 10,
    image: "/certification/receipt.jpg"
  },
  {
    id: 4,
    type: "email",
    title: "불필요한 이메일 50개 정리",
    date: "2023-05-09",
    time: "20:15",
    timeAgo: "어제",
    location: "온라인",
    carbonReduction: 0.03,
    verified: true,
    points: 8,
    image: "/certification/email.jpg"
  },
  {
    id: 5,
    type: "refill",
    title: "샴푸 리필스테이션 이용",
    date: "2023-05-09",
    time: "14:30",
    timeAgo: "어제",
    location: "제로웨이스트샵",
    carbonReduction: 0.18,
    verified: true,
    points: 18,
    image: "/certification/refill.jpg"
  },
  {
    id: 6,
    type: "recycle",
    title: "폐휴대폰 배터리 분리배출",
    date: "2023-05-08",
    time: "11:20",
    timeAgo: "2일 전",
    location: "교내 수거함",
    carbonReduction: 0.35,
    verified: true,
    points: 25,
    image: "/certification/recycle.jpg"
  },
  {
    id: 7,
    type: "tumbler",
    title: "텀블러 사용 (스타벅스)",
    date: "2023-05-07",
    time: "15:45",
    timeAgo: "3일 전",
    location: "스타벅스",
    carbonReduction: 0.12,
    verified: true,
    points: 15,
    image: "/certification/tumbler2.jpg"
  },
  {
    id: 8,
    type: "receipt",
    title: "도서관에서 전자영수증 사용",
    date: "2023-05-06",
    time: "14:00",
    timeAgo: "4일 전",
    location: "교내 도서관",
    carbonReduction: 0.05,
    verified: true,
    points: 10,
    image: "/certification/receipt2.jpg"
  },
  {
    id: 9,
    type: "refill",
    title: "세제 리필스테이션 이용",
    date: "2023-05-05",
    time: "11:30",
    timeAgo: "5일 전",
    location: "제로웨이스트샵",
    carbonReduction: 0.20,
    verified: true,
    points: 20,
    image: "/certification/refill2.jpg"
  },
  {
    id: 10,
    type: "tumbler",
    title: "강의실에서 텀블러 사용",
    date: "2023-05-05",
    time: "09:00",
    timeAgo: "5일 전",
    location: "교내 강의실",
    carbonReduction: 0.12,
    verified: true,
    points: 15,
    image: "/certification/tumbler3.jpg"
  },
  {
    id: 11,
    type: "container",
    title: "테이크아웃 다회용기 사용",
    date: "2023-05-04",
    time: "13:20",
    timeAgo: "6일 전",
    location: "교내 카페",
    carbonReduction: 0.25,
    verified: true,
    points: 20,
    image: "/certification/container2.jpg"
  },
  {
    id: 12,
    type: "email",
    title: "불필요한 이메일 100개 삭제",
    date: "2023-05-04",
    time: "16:00",
    timeAgo: "6일 전",
    location: "온라인",
    carbonReduction: 0.05,
    verified: true,
    points: 12,
    image: "/certification/email2.jpg"
  },
  {
    id: 13,
    type: "recycle",
    title: "폐건전지 분리배출",
    date: "2023-05-03",
    time: "10:15",
    timeAgo: "7일 전",
    location: "교내 수거함",
    carbonReduction: 0.30,
    verified: true,
    points: 22,
    image: "/certification/recycle2.jpg"
  },
  {
    id: 14,
    type: "receipt",
    title: "카페에서 전자영수증 사용",
    date: "2023-05-03",
    time: "18:30",
    timeAgo: "7일 전",
    location: "스타벅스",
    carbonReduction: 0.05,
    verified: true,
    points: 10,
    image: "/certification/receipt3.jpg"
  },
  {
    id: 15,
    type: "tumbler",
    title: "도서관에서 텀블러 사용",
    date: "2023-05-02",
    time: "15:10",
    timeAgo: "8일 전",
    location: "교내 도서관",
    carbonReduction: 0.12,
    verified: true,
    points: 15,
    image: "/certification/tumbler4.jpg"
  }
];


export default function CertificationPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [certifications, setCertifications] = useState(SAMPLE_CERTIFICATIONS);
  const [selectedType, setSelectedType] = useState(null);
  const [showTypeList, setShowTypeList] = useState(false);

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 필터링된 인증 목록
  const filteredCertifications = certifications.filter((cert) => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || cert.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // 카메라로 인증하기 기능
  const handleCameraCapture = () => {
    // 카메라 기능 구현 (실제로는 네이티브 카메라 API 또는 라이브러리 사용)
    alert("카메라 기능은 아직 구현 중입니다.");
  };

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 - iOS 스타일 */}
      <div className="ios-header sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800">환경을 위한 작은 실천</h1>
        <button
          className="ios-icon-button"
          onClick={handleCameraCapture}
        >
          <FaCamera className="text-primary text-lg" />
        </button>
      </div>

      {/* 검색 바와 인증 유형 드롭다운 */}
      <div className="p-4 bg-white">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="인증 내역 검색"
              className="ios-input pl-10 h-9 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative w-40">
            <button
              className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-xl text-xs h-9"
              onClick={() => setShowTypeList(!showTypeList)}
            >
              <div className="flex items-center">
                {activeFilter === "all" ? (
                  "전체"
                ) : (
                  <>
                    <span className="mr-2">
                      {CERTIFICATION_TYPES.find(t => t.id === activeFilter)?.icon}
                    </span>
                    {CERTIFICATION_TYPES.find(t => t.id === activeFilter)?.label}
                  </>
                )}
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform ${showTypeList ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showTypeList && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  <div className="py-1">
                    <button
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-sm ${
                        activeFilter === "all" ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => {
                        setActiveFilter("all");
                        setShowTypeList(false);
                      }}
                    >
                      전체
                    </button>
                    {CERTIFICATION_TYPES.map((type) => (
                      <button
                        key={type.id}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-sm ${
                          activeFilter === type.id ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => {
                          setActiveFilter(type.id);
                          setShowTypeList(false);
                        }}
                      >
                        <span className="mr-2">{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 인증 내역 목록 - iOS 스타일 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-sm text-gray-500 mb-3">
          총 {filteredCertifications.length}개의 인증
        </div>
        {filteredCertifications.length > 0 ? (
          filteredCertifications.map((cert) => {
            // 인증 유형 정보 가져오기
            const typeInfo = CERTIFICATION_TYPES.find((t) => t.id === cert.type) || {
              icon: "🔍",
              label: "기타",
              color: "#F5F5F5"
            };

            return (
              <motion.div
                key={cert.id}
                className="ios-card p-4 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start">
                  <div
                    className="p-3 rounded-full mr-3"
                    style={{ backgroundColor: typeInfo.color }}
                  >
                    <span className="text-xl">{typeInfo.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{cert.title}</h3>
                      {cert.verified && (
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                          인증됨
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{cert.location}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {cert.timeAgo}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 text-primary font-medium px-2 py-1 rounded-full">
                          {cert.points}P
                        </span>
                        <span className="text-xs bg-gray-100 text-primary font-medium px-2 py-1 rounded-full">
                          -{cert.carbonReduction}kg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="text-2xl text-gray-400" />
            </div>
            <p>검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
