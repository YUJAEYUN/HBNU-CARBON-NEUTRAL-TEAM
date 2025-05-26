"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSearch, FaFilter, FaLeaf, FaExternalLinkAlt, FaTrophy } from "react-icons/fa";
import Image from "next/image";

// 대외활동 타입 정의
interface ExternalActivity {
  id: string;
  title: string;
  organization: string;
  field: string;
  target: string;
  period: string;
  applicationPeriod: string;
  benefits: string[];
  carbonReduction: number;
  description: string;
  imageUrl?: string;
  link: string;
}

export default function ExternalActivitiesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState<string>("전체");
  const [activities, setActivities] = useState<ExternalActivity[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  // 분야 목록
  const fields = ["전체", "환경", "탄소중립", "공모전", "인턴십", "교육", "마케팅"];

  // 목업 데이터 로드
  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const mockActivities: ExternalActivity[] = [
      {
        id: "1",
        title: "2023 탄소중립 아이디어 공모전",
        organization: "환경부",
        field: "공모전",
        target: "대학생 및 대학원생",
        period: "2023-07-01 ~ 2023-08-31",
        applicationPeriod: "2023-06-01 ~ 2023-06-30",
        benefits: ["상금 최대 500만원", "환경부 장관상", "인턴십 기회"],
        carbonReduction: 15.2,
        description: "일상 속에서 탄소 배출을 줄이는 창의적인 아이디어를 발굴하는 공모전입니다. 개인 또는 팀으로 참가 가능하며, 우수 아이디어는 실제 정책에 반영될 수 있습니다.",
        imageUrl: "/external/contest.jpg",
        link: "https://www.wevity.com"
      },
      {
        id: "2",
        title: "그린캠퍼스 서포터즈",
        organization: "한국환경공단",
        field: "환경",
        target: "전국 대학생",
        period: "2023-07-15 ~ 2023-12-15 (6개월)",
        applicationPeriod: "2023-06-10 ~ 2023-07-05",
        benefits: ["활동비 지원", "수료증 발급", "우수 활동자 시상"],
        carbonReduction: 8.7,
        description: "대학 내 환경보호 및 탄소중립 활동을 기획하고 실행하는 서포터즈 프로그램입니다. 캠퍼스 내 환경 캠페인, SNS 콘텐츠 제작, 환경 교육 등의 활동을 수행합니다.",
        imageUrl: "/external/supporters.jpg",
        link: "https://www.wevity.com"
      },
      {
        id: "3",
        title: "친환경 스타트업 인턴십",
        organization: "그린벤처협회",
        field: "인턴십",
        target: "3~4학년 대학생 및 대학원생",
        period: "2023-08-01 ~ 2023-10-31 (3개월)",
        applicationPeriod: "2023-06-15 ~ 2023-07-10",
        benefits: ["월 급여 지급", "정규직 전환 기회", "실무 경험"],
        carbonReduction: 12.5,
        description: "친환경 및 탄소중립 관련 스타트업에서 실무 경험을 쌓을 수 있는 인턴십 프로그램입니다. 마케팅, 연구개발, 사업기획 등 다양한 직무에 지원 가능합니다.",
        imageUrl: "/external/internship.jpg",
        link: "https://www.wevity.com"
      },
      {
        id: "4",
        title: "탄소중립 청년 아카데미",
        organization: "기후변화대응교육센터",
        field: "교육",
        target: "만 19~34세 청년",
        period: "2023-08-05 ~ 2023-09-30",
        applicationPeriod: "2023-06-20 ~ 2023-07-20",
        benefits: ["교육비 전액 지원", "수료증 발급", "네트워킹 기회"],
        carbonReduction: 5.8,
        description: "탄소중립 관련 전문 지식과 실무 역량을 기를 수 있는 교육 프로그램입니다. 기후변화 과학, 탄소중립 정책, 친환경 비즈니스 모델 등을 학습합니다.",
        imageUrl: "/external/academy.jpg",
        link: "https://www.wevity.com"
      },
      {
        id: "5",
        title: "친환경 브랜드 마케팅 공모전",
        organization: "대한상공회의소",
        field: "마케팅",
        target: "대학생 및 일반인",
        period: "2023-08-10 ~ 2023-09-10",
        applicationPeriod: "2023-06-25 ~ 2023-07-25",
        benefits: ["상금 최대 300만원", "기업 인턴십 기회", "수상 경력"],
        carbonReduction: 7.3,
        description: "친환경 제품 및 서비스의 마케팅 전략을 기획하는 공모전입니다. 브랜딩, 광고, SNS 마케팅 등 다양한 분야에서 창의적인 아이디어를 제안할 수 있습니다.",
        imageUrl: "/external/marketing.jpg",
        link: "https://www.wevity.com"
      }
    ];

    // 데이터 로드 후 상태 업데이트
    setActivities(mockActivities);
    setLoading(false);
  }, []);

  // 분야 필터링
  const filteredActivities = activities.filter(activity => {
    // 검색어 필터링
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());

    // 분야 필터링
    const matchesField = selectedField === "전체" || activity.field === selectedField;

    return matchesSearch && matchesField;
  });

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 - 개선된 레이아웃 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        {/* 네비게이션 바 */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => router.push("/")}
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">탄소중립 대외활동</h1>
          <div className="flex items-center space-x-1">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowFilter(!showFilter)}
            >
              <FaFilter className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* 위비티 바로가기 링크 */}
        <div className="px-4 pb-3">
          <a
            href="https://www.wevity.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 border border-purple-100 hover:from-purple-100 hover:to-blue-100 transition-all"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <FaTrophy className="text-purple-600 text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-700">위비티에서 더 많은 대외활동 찾기</p>
              <p className="text-xs text-purple-600">공모전, 인턴십, 대외활동 정보</p>
            </div>
            <FaExternalLinkAlt className="text-purple-600 text-sm ml-2" />
          </a>
        </div>
      </div>

      {/* 검색 바 - 개선된 디자인 */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <FaSearch className="text-gray-400 text-sm" />
          </div>
          <input
            type="text"
            placeholder="대외활동 검색"
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 필터 영역 - 개선된 디자인 */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex overflow-x-auto space-x-2 hide-scrollbar">
          {fields.map((field) => (
            <button
              key={field}
              className={`flex-shrink-0 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedField === field
                  ? "bg-primary text-white shadow-md transform scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
              }`}
              onClick={() => setSelectedField(field)}
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      {/* 대외활동 목록 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                className="ios-card overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(activity.link, "_blank")}
              >
                <div className="relative h-40 bg-gray-200">
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-6xl">🌍</span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    <FaLeaf className="inline mr-1" />
                    {activity.carbonReduction}kg 절감
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 text-lg">{activity.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{activity.field}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{activity.organization}</p>
                  <p className="text-sm text-gray-500 mt-1">대상: {activity.target}</p>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>활동기간: {activity.period}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <span>접수기간: {activity.applicationPeriod}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {activity.benefits.map((benefit, index) => (
                      <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center">
                        <FaTrophy className="mr-1 text-xs" /> {benefit}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">{activity.description}</p>

                  <div className="mt-3 flex justify-end">
                    <button className="text-xs bg-primary text-white font-medium px-3 py-1 rounded-full shadow-sm flex items-center">
                      신청하기 <span className="ml-1">›</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
            <p className="text-sm text-gray-400">다른 검색어나 분야를 선택해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
