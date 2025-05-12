"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSearch, FaFilter, FaLeaf, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";

// 봉사활동 타입 정의
interface VolunteerActivity {
  id: string;
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  recruitmentPeriod: string;
  participants: string;
  category: string;
  carbonReduction: number;
  description: string;
  imageUrl?: string;
  link: string;
}

export default function VolunteerActivitiesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [activities, setActivities] = useState<VolunteerActivity[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  // 카테고리 목록
  const categories = ["전체", "환경보호", "탄소중립", "자원봉사", "지역사회", "교육봉사"];

  // 목업 데이터 로드
  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const mockActivities: VolunteerActivity[] = [
      {
        id: "1",
        title: "탄소중립 환경정화 봉사활동",
        organization: "한밭대학교 환경동아리",
        location: "대전 유성구",
        startDate: "2023-06-10",
        endDate: "2023-06-10",
        recruitmentPeriod: "2023-05-15 ~ 2023-06-05",
        participants: "20명",
        category: "환경보호",
        carbonReduction: 5.2,
        description: "대전 유성구 일대 하천 및 공원 환경정화 활동을 통해 지역사회 환경 개선에 기여합니다. 참가자들은 쓰레기 수거 및 분리수거 활동을 진행하며, 활동 후 환경보호 교육도 함께 진행됩니다.",
        imageUrl: "/volunteer/cleanup.jpg",
        link: "https://www.1365.go.kr"
      },
      {
        id: "2",
        title: "탄소발자국 줄이기 캠페인",
        organization: "대전시 환경운동연합",
        location: "대전시 전역",
        startDate: "2023-06-15",
        endDate: "2023-06-30",
        recruitmentPeriod: "2023-05-20 ~ 2023-06-10",
        participants: "30명",
        category: "탄소중립",
        carbonReduction: 8.7,
        description: "일상 속에서 탄소발자국을 줄이는 방법을 시민들에게 알리는 캠페인 활동입니다. 참가자들은 거리 캠페인, SNS 홍보, 교육 자료 배포 등의 활동을 진행합니다.",
        imageUrl: "/volunteer/campaign.jpg",
        link: "https://www.1365.go.kr"
      },
      {
        id: "3",
        title: "폐기물 재활용 교육 봉사",
        organization: "자원순환사회연대",
        location: "대전 서구 지역아동센터",
        startDate: "2023-06-20",
        endDate: "2023-06-20",
        recruitmentPeriod: "2023-05-25 ~ 2023-06-15",
        participants: "10명",
        category: "교육봉사",
        carbonReduction: 3.5,
        description: "지역 아동들에게 올바른 재활용 방법과 자원순환의 중요성을 교육하는 봉사활동입니다. 참가자들은 교육 자료 준비 및 실습 활동을 함께 진행합니다.",
        imageUrl: "/volunteer/recycling.jpg",
        link: "https://www.1365.go.kr"
      },
      {
        id: "4",
        title: "도시농업 텃밭 가꾸기",
        organization: "대전 도시농업네트워크",
        location: "대전 중구 도시농업공원",
        startDate: "2023-06-25",
        endDate: "2023-08-25",
        recruitmentPeriod: "2023-05-30 ~ 2023-06-20",
        participants: "15명",
        category: "환경보호",
        carbonReduction: 12.3,
        description: "도시 내 유휴공간을 활용한 텃밭 가꾸기 활동을 통해 도시 녹지화와 탄소 흡수에 기여합니다. 참가자들은 정기적으로 텃밭을 관리하고 수확물은 지역 복지시설에 기부합니다.",
        imageUrl: "/volunteer/urban-farming.jpg",
        link: "https://www.1365.go.kr"
      },
      {
        id: "5",
        title: "에너지 절약 캠페인",
        organization: "기후변화대응네트워크",
        location: "대전 동구",
        startDate: "2023-07-01",
        endDate: "2023-07-15",
        recruitmentPeriod: "2023-06-01 ~ 2023-06-25",
        participants: "25명",
        category: "탄소중립",
        carbonReduction: 7.8,
        description: "가정과 사무실에서 실천할 수 있는 에너지 절약 방법을 알리는 캠페인입니다. 참가자들은 에너지 절약 체크리스트 배포 및 홍보 활동을 진행합니다.",
        imageUrl: "/volunteer/energy-saving.jpg",
        link: "https://www.1365.go.kr"
      }
    ];

    // 데이터 로드 후 상태 업데이트
    setActivities(mockActivities);
    setLoading(false);
  }, []);

  // 카테고리 필터링
  const filteredActivities = activities.filter(activity => {
    // 검색어 필터링
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 카테고리 필터링
    const matchesCategory = selectedCategory === "전체" || activity.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
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
      {/* 상단 헤더 - iOS 스타일 */}
      <div className="ios-header sticky top-0 z-10">
        <div className="flex items-center">
          <button
            className="text-gray-500 mr-2"
            onClick={() => router.push("/")}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">탄소중립 봉사활동</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="text-gray-500"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter />
          </button>
          <a 
            href="https://www.1365.go.kr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-ios-blue font-medium flex items-center"
          >
            1365 바로가기 <FaExternalLinkAlt className="ml-1 text-xs" />
          </a>
        </div>
      </div>

      {/* 검색 바 */}
      <div className="p-4 bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="봉사활동 검색"
            className="ios-input pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* 필터 영역 */}
      {showFilter && (
        <motion.div 
          className="px-4 py-2 bg-gray-50"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <p className="text-sm font-medium text-gray-700 mb-2">카테고리</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`py-1.5 px-3 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 봉사활동 목록 */}
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
                    <span className="text-6xl">🌱</span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    <FaLeaf className="inline mr-1" />
                    {activity.carbonReduction}kg 절감
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 text-lg">{activity.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{activity.category}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{activity.organization}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.location}</p>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>활동기간: {activity.startDate} ~ {activity.endDate}</span>
                      <span>모집인원: {activity.participants}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <span>모집기간: {activity.recruitmentPeriod}</span>
                    </div>
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
            <p className="text-sm text-gray-400">다른 검색어나 카테고리를 선택해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
