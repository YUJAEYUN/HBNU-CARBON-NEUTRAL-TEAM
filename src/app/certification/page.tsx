"use client";
import React from 'react';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCamera, FaSearch, FaCalendarAlt, FaFilter, FaCheck, FaTimes, FaChevronDown, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { getCertifications } from "@/utils/api";

const CERTIFICATION_TYPES = [
  { id: "receipt", label: "전자영수증", icon: "🧾", color: "#C8E6C9" },    // 연한 녹색 (파스텔)
  { id: "refill", label: "리필스테이션", icon: "🔄", color: "#B3E5FC" }, // 연한 파랑 (파스텔)
  { id: "container", label: "다회용기", icon: "🥡", color: "#FFECB3" },  // 연한 노란색 (파스텔)
  { id: "tumbler", label: "텀블러", icon: "☕", color: "#D7CCC8" },      // 연한 브라운 (파스텔)
  { id: "email", label: "이메일지우기", icon: "📧", color: "#CFD8DC" },  // 연한 회색 (파스텔)
  { id: "recycle", label: "전기전자폐기", icon: "♻️", color: "#DCEDC8" }, // 연한 연두색 (파스텔)
  { id: "other", label: "기타", icon: "🔍", color: "#D3D3D3" }
];



// 샘플 인증 데이터 - 더 많은 목업 데이터 추가
const SAMPLE_CERTIFICATIONS = [
  {
    id: 1,
    type: "tumbler",
    title: "카페에서 텀블러 사용",
    date: "2025-05-16",
    time: "11:50",
    timeAgo: "10분 전",
    location: "교내 카페",
    carbonReduction: 0.12,
    verified: true,
    status: "인증됨",
    points: 15,
    image: "/certification/tumbler.jpg"
  },
  {
    id: 2,
    type: "container",
    title: "식당에서 다회용기 사용",
    date: "2025-05-16",
    time: "09:00",
    timeAgo: "3시간 전",
    location: "학생 식당",
    carbonReduction: 0.25,
    verified: true,
    status: "인증됨",
    points: 20,
    image: "/certification/container.jpg"
  },
  {
    id: 3,
    type: "receipt",
    title: "편의점 전자영수증 사용",
    date: "2025-05-16",
    time: "08:00",
    timeAgo: "오늘",
    location: "CU 편의점",
    carbonReduction: 0.05,
    verified: true,
    status: "인증됨",
    points: 10,
    image: "/certification/receipt.jpg"
  },
  {
    id: 4,
    type: "email",
    title: "불필요한 이메일 50개 정리",
    date: "2025-05-15",
    time: "20:15",
    timeAgo: "어제",
    location: "온라인",
    carbonReduction: 0.03,
    verified: true,
    status: "인증됨",
    points: 8,
    image: "/certification/email.jpg"
  },
  {
    id: 5,
    type: "refill",
    title: "샴푸 리필스테이션 이용",
    date: "2025-05-15",
    time: "14:30",
    timeAgo: "어제",
    location: "제로웨이스트샵",
    carbonReduction: 0.18,
    verified: true,
    status: "인증됨",
    points: 18,
    image: "/certification/refill.jpg"
  },
  {
    id: 6,
    type: "recycle",
    title: "폐휴대폰 배터리 분리배출",
    date: "2025-05-14",
    time: "11:20",
    timeAgo: "2일 전",
    location: "교내 수거함",
    carbonReduction: 0.35,
    verified: true,
    status: "인증됨",
    points: 25,
    image: "/certification/recycle.jpg"
  },
  {
    id: 7,
    type: "tumbler",
    title: "텀블러 사용 (스타벅스)",
    date: "2025-05-13",
    time: "15:45",
    timeAgo: "3일 전",
    location: "스타벅스",
    carbonReduction: 0.12,
    verified: true,
    status: "인증됨",
    points: 15,
    image: "/certification/tumbler2.jpg"
  },
  {
    id: 8,
    type: "receipt",
    title: "도서관에서 전자영수증 사용",
    date: "2025-05-12",
    time: "14:00",
    timeAgo: "4일 전",
    location: "교내 도서관",
    carbonReduction: 0.05,
    verified: true,
    status: "인증됨",
    points: 10,
    image: "/certification/receipt2.jpg"
  },
  {
    id: 9,
    type: "refill",
    title: "세제 리필스테이션 이용",
    date: "2025-05-11",
    time: "11:30",
    timeAgo: "5일 전",
    location: "제로웨이스트샵",
    carbonReduction: 0.20,
    verified: true,
    status: "인증됨",
    points: 20,
    image: "/certification/refill2.jpg"
  },
  {
    id: 10,
    type: "tumbler",
    title: "강의실에서 텀블러 사용",
    date: "2025-05-10",
    time: "09:00",
    timeAgo: "6일 전",
    location: "교내 강의실",
    carbonReduction: 0.12,
    verified: true,
    status: "인증됨",
    points: 15,
    image: "/certification/tumbler3.jpg"
  },
  {
    id: 11,
    type: "container",
    title: "테이크아웃 다회용기 사용",
    date: "2025-05-09",
    time: "13:20",
    timeAgo: "7일 전",
    location: "교내 카페",
    carbonReduction: 0.25,
    verified: true,
    status: "인증됨",
    points: 20,
    image: "/certification/container2.jpg"
  },
  {
    id: 12,
    type: "email",
    title: "불필요한 이메일 100개 삭제",
    date: "2025-05-08",
    time: "16:00",
    timeAgo: "8일 전",
    location: "온라인",
    carbonReduction: 0.05,
    verified: true,
    status: "인증됨",
    points: 12,
    image: "/certification/email2.jpg"
  },
  {
    id: 13,
    type: "recycle",
    title: "폐건전지 분리배출",
    date: "2025-05-07",
    time: "10:15",
    timeAgo: "9일 전",
    location: "교내 수거함",
    carbonReduction: 0.30,
    verified: true,
    status: "인증됨",
    points: 22,
    image: "/certification/recycle2.jpg"
  },
  {
    id: 14,
    type: "receipt",
    title: "카페에서 전자영수증 사용",
    date: "2025-05-06",
    time: "18:30",
    timeAgo: "10일 전",
    location: "스타벅스",
    carbonReduction: 0.05,
    verified: true,
    status: "인증됨",
    points: 10,
    image: "/certification/receipt3.jpg"
  },
  {
    id: 15,
    type: "tumbler",
    title: "도서관에서 텀블러 사용",
    date: "2025-05-05",
    time: "15:10",
    timeAgo: "11일 전",
    location: "교내 도서관",
    carbonReduction: 0.12,
    verified: true,
    status: "인증됨",
    points: 15,
    image: "/certification/tumbler4.jpg"
  },
  {
    id: 16,
    type: "tumbler",
    title: "강의실에서 텀블러 사용",
    date: "2025-05-04",
    time: "10:00",
    timeAgo: "12일 전",
    location: "교내 강의실",
    carbonReduction: 0.12,
    verified: false,
    status: "검토중",
    points: 15,
    image: "/certification/tumbler5.jpg"
  },
  {
    id: 17,
    type: "container",
    title: "도서관에서 다회용기 사용",
    date: "2025-05-03",
    time: "11:00",
    timeAgo: "13일 전",
    location: "교내 도서관",
    carbonReduction: 0.25,
    verified: false,
    status: "검토중",
    points: 20,
    image: "/certification/container3.jpg"
  },
  {
    id: 18,
    type: "email",
    title: "불필요한 이메일 30개 삭제",
    date: "2025-05-02",
    time: "12:00",
    timeAgo: "14일 전",
    location: "온라인",
    carbonReduction: 0.03,
    verified: false,
    status: "검토중",
    points: 8,
    image: "/certification/email3.jpg"
  }
];


export default function CertificationPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [certifications, setCertifications] = useState(SAMPLE_CERTIFICATIONS);
  const [showTypeList, setShowTypeList] = useState(false);
  const [selectedCertImage, setSelectedCertImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 백엔드에서 인증 목록 가져오기
  useEffect(() => {
    const fetchCertifications = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getCertifications(user.id);
        if (data && data.certifications) {
          setCertifications(data.certifications);
        }
      } catch (err) {
        console.error('인증 목록 가져오기 오류:', err);
        setError('인증 목록을 가져오는 중 오류가 발생했습니다.');
        // 오류 발생 시 샘플 데이터 사용
        setCertifications(SAMPLE_CERTIFICATIONS);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchCertifications();
    }
  }, [user?.id]);

  // 로딩 중일 때 로딩 화면 표시
  if (authLoading || isLoading) {
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
    router.push('/camera');
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

      {/* 카메라 UI 모달 - Camera 컴포넌트가 없어서 주석 처리 */}
      {/* {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-4 relative w-full max-w-xs mx-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowCamera(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )} */}

      {/* 검색 바와 인증 유형 드롭다운 */}

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
        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

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
                className="ios-card p-4 mb-4 cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedCertImage(cert.image)}
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
                      {cert.verified ? (
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                          인증됨
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full flex items-center">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1"></span>
                          {cert.status || '검토중'}
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

      {/* 인증 이미지 모달 */}
      {selectedCertImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl p-6 relative w-80 h-80 max-w-full max-h-full mx-auto flex flex-col items-center justify-center">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedCertImage(null)}
            >
              닫기
            </button>
            <img src={selectedCertImage} alt="인증 사진" className="mt-4 w-52 h-52 object-contain rounded-lg mb-2" />
            {/* 인증 정보 표시 */}
            {certifications.find(cert => cert.image === selectedCertImage) && (
              <div className="text-center mt-0">
                <div className="font-semibold text-base mb-1">{certifications.find(cert => cert.image === selectedCertImage)?.title}</div>
                <div className="text-xs text-gray-500 mb-1">{certifications.find(cert => cert.image === selectedCertImage)?.location}</div>
                <div className="text-xs text-gray-400 mb-1">{certifications.find(cert => cert.image === selectedCertImage)?.date} {certifications.find(cert => cert.image === selectedCertImage)?.time}</div>
                <div className="text-xs text-gray-400 mb-1">{certifications.find(cert => cert.image === selectedCertImage)?.status || (certifications.find(cert => cert.image === selectedCertImage)?.verified ? '인증됨' : '검토중')}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}