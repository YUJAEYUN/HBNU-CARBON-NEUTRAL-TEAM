"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { Certification } from "@/types/certification";

// 인증 유형 정보
const CERTIFICATION_TYPES = [
  { id: "receipt", label: "전자영수증", icon: "🧾", color: "#C8E6C9" },
  { id: "refill", label: "리필스테이션", icon: "🔄", color: "#B3E5FC" },
  { id: "container", label: "다회용기", icon: "🥡", color: "#FFECB3" },
  { id: "tumbler", label: "텀블러", icon: "☕", color: "#D7CCC8" },
  { id: "email", label: "이메일지우기", icon: "📧", color: "#CFD8DC" },
  { id: "recycle", label: "전기전자폐기", icon: "♻️", color: "#DCEDC8" },
  { id: "other", label: "기타", icon: "🔍", color: "#D3D3D3" }
];

interface CertificationListProps {
  certifications: Certification[];
  isVisible: boolean;
  onClose: () => void;
}

export default function CertificationList({
  certifications,
  isVisible,
  onClose
}: CertificationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showTypeList, setShowTypeList] = useState(false);
  const [selectedCertImage, setSelectedCertImage] = useState<string | null>(null);
  const [selectedCertImageIndex, setSelectedCertImageIndex] = useState(0);

  // 필터링된 인증 목록
  const filteredCertifications = certifications.filter((cert) => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || cert.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // 모달 애니메이션 변수
  const modalVariants = {
    hidden: { y: "-100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { y: "-100%", opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      <motion.div
        className="fixed top-0 z-50 bg-white rounded-b-2xl shadow-lg max-h-[80vh] overflow-hidden flex flex-col w-full max-w-md"
        style={{ left: 0, right: 0, margin: "0 auto" }}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        exit="exit"
        variants={modalVariants}
      >
        {/* 헤더 */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">나의 인증 내역</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            닫기
          </button>
        </div>

        {/* 검색 바와 인증 유형 드롭다운 */}
        <div className="p-4 bg-white border-b">
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
              {showTypeList && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-lg z-50 overflow-hidden">
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 인증 내역 목록 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-sm text-gray-500 mb-3">
            총 {filteredCertifications.length}개의 인증
          </div>
          {filteredCertifications.length > 0 ? (
            filteredCertifications.map((cert) => {
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
                  onClick={() => { if (cert.image) { setSelectedCertImage(cert.image); setSelectedCertImageIndex(0); } }}
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
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60 w-full max-w-md" style={{ left: 0, right: 0, margin: "0 auto" }}>
            <div className="bg-white rounded-xl p-6 relative w-80 h-80 max-w-[90%] max-h-[90%] mx-auto flex flex-col items-center justify-center">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => { setSelectedCertImage(null); setSelectedCertImageIndex(0); }}
              >
                닫기
              </button>
              {(() => {
                const cert = certifications.find(cert => cert.image === selectedCertImage);
                if (!cert) return null;
                // 이미지 배열 구성
                const images = [cert.image];
                if ('receiptImage' in cert && cert.receiptImage) images.push(cert.receiptImage as string);
                const imageLabels = ["인증 사진", "영수증 사진"];
                return (
                  <>
                    <div className="flex flex-row items-center justify-center w-full relative">
                      {images.length > 1 && selectedCertImageIndex > 0 && (
                        <button
                          className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl text-gray-400 hover:text-primary px-2"
                          onClick={() => setSelectedCertImageIndex(i => Math.max(0, i - 1))}
                          aria-label="이전 사진"
                        >
                          {'<'}
                        </button>
                      )}
                      <img
                        src={images[selectedCertImageIndex]}
                        alt={imageLabels[selectedCertImageIndex]}
                        className="w-48 h-48 object-contain rounded-lg border mx-8"
                      />
                      {images.length > 1 && selectedCertImageIndex < images.length - 1 && (
                        <button
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-gray-400 hover:text-primary px-2"
                          onClick={() => setSelectedCertImageIndex(i => Math.min(images.length - 1, i + 1))}
                          aria-label="다음 사진"
                        >
                          {'>'}
                        </button>
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <div className="font-semibold text-base mb-1">{cert.title}</div>
                      <div className="text-xs text-gray-500 mb-1">{cert.location}</div>
                      <div className="text-xs text-gray-400 mb-1">{cert.date} {cert.time}</div>
                      <div className="text-xs text-gray-400 mb-1">{cert.status || (cert.verified ? '인증됨' : '검토중')}</div>
                      {images.length > 1 && (
                        <div className="text-xs text-gray-400 mt-1">{imageLabels[selectedCertImageIndex]}</div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
