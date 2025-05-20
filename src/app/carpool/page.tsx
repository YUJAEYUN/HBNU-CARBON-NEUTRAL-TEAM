"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaArrowLeft, FaMapMarkerAlt, FaClock, FaUser, FaCheck, FaWonSign, FaTaxi, FaCar, FaUsers, FaCalendarAlt, FaLeaf } from "react-icons/fa";
import { motion } from "framer-motion";

export default function CarpoolPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"일반" | "예비군" | "나의카풀">("일반");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [carpoolType, setCarpoolType] = useState<"일반" | "예비군">("일반");
  const [vehicleType, setVehicleType] = useState<"택시" | "렌트">("택시");
  const [tripType, setTripType] = useState<"편도" | "왕복">("편도");
  const [passengers, setPassengers] = useState<number>(2);
  const [departureDate, setDepartureDate] = useState<string>("");
  const [departureTime, setDepartureTime] = useState<string>("");
  const [departure, setDeparture] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [estimatedCost, setEstimatedCost] = useState<string>("");

  // 일반 카풀 데이터 (실제로는 API나 DB에서 가져올 수 있음)
  const [regularCarpoolData, setRegularCarpoolData] = useState([
    {
      id: 1,
      date: "2023년 11월 17일 (금요일)",
      time: "오후 3시 30분",
      departure: "한밭대학교 정문",
      destination: "둔산동 시청",
      participants: [
        { id: 1, name: "김환경", status: "확정" },
        { id: 2, name: "이탄소", status: "확정" },
        { id: 3, name: "박중립", status: "대기중" }
      ],
      maxParticipants: 4,
      co2Reduction: 1.2,
      vehicleType: "택시",
      tripType: "편도",
      estimatedCost: "5000"
    },
    {
      id: 2,
      date: "2023년 11월 18일 (토요일)",
      time: "오전 10시 00분",
      departure: "한밭대학교 후문",
      destination: "대전역",
      participants: [
        { id: 4, name: "최탄소", status: "확정" }
      ],
      maxParticipants: 4,
      co2Reduction: 0.8,
      vehicleType: "택시",
      tripType: "편도",
      estimatedCost: "7000"
    }
  ]);

  // 예비군 카풀 데이터
  const [militaryTrainingCarpoolData, setMilitaryTrainingCarpoolData] = useState([
    {
      id: 3,
      date: "2023년 11월 20일 (월요일)",
      time: "오전 7시 30분",
      departure: "한밭대학교 정문",
      destination: "대전 예비군훈련장",
      participants: [
        { id: 5, name: "박예비", status: "확정" },
        { id: 6, name: "김훈련", status: "확정" }
      ],
      maxParticipants: 4,
      co2Reduction: 1.5,
      vehicleType: "택시",
      tripType: "왕복",
      estimatedCost: "10000"
    }
  ]);

  // 나의 카풀 신청 내역
  const [myCarpool, setMyCarpool] = useState([
    {
      id: 1,
      date: "2023년 11월 17일 (금요일)",
      time: "오후 3시 30분",
      departure: "한밭대학교 정문",
      destination: "둔산동 시청",
      status: "확정",
      vehicleType: "택시",
      tripType: "편도",
      estimatedCost: "5000",
      co2Reduction: 1.2,
      participants: [
        { id: 1, name: "김환경", status: "확정" },
        { id: 2, name: "이탄소", status: "확정" },
        { id: 3, name: "박중립", status: "대기중" }
      ],
      maxParticipants: 4
    },
    {
      id: 3,
      date: "2023년 11월 20일 (월요일)",
      time: "오전 7시 30분",
      departure: "한밭대학교 정문",
      destination: "대전 예비군훈련장",
      status: "확정",
      vehicleType: "택시",
      tripType: "왕복",
      estimatedCost: "10000",
      co2Reduction: 1.5,
      participants: [
        { id: 5, name: "박예비", status: "확정" },
        { id: 6, name: "김훈련", status: "확정" }
      ],
      maxParticipants: 4
    }
  ]);

  // 카풀 참여하기 기능
  const handleJoinCarpool = (carpool: any, carpoolType: "일반" | "예비군") => {
    // 이미 참여한 카풀인지 확인
    const isAlreadyJoined = myCarpool.some(item => item.id === carpool.id);

    if (isAlreadyJoined) {
      alert("이미 참여한 카풀입니다.");
      return;
    }

    // 정원이 찼는지 확인
    if (carpool.participants.length >= carpool.maxParticipants) {
      alert("정원이 모두 찼습니다.");
      return;
    }

    // 참여자 추가
    const updatedParticipants = [
      ...carpool.participants,
      { id: 999, name: "나", status: "확정" }
    ];

    // 카풀 유형에 따라 적절한 배열 업데이트
    if (carpoolType === "일반") {
      const updatedRegularCarpoolData = regularCarpoolData.map(item =>
        item.id === carpool.id
          ? { ...item, participants: updatedParticipants }
          : item
      );
      setRegularCarpoolData(updatedRegularCarpoolData);
    } else {
      const updatedMilitaryTrainingCarpoolData = militaryTrainingCarpoolData.map(item =>
        item.id === carpool.id
          ? { ...item, participants: updatedParticipants }
          : item
      );
      setMilitaryTrainingCarpoolData(updatedMilitaryTrainingCarpoolData);
    }

    // 나의 카풀에 추가
    const newMyCarpool = {
      ...carpool,
      status: "확정",
      participants: updatedParticipants
    };
    setMyCarpool([...myCarpool, newMyCarpool]);

    // 참여 완료 메시지
    alert("카풀에 참여했습니다!");

    // 나의 카풀 탭으로 이동
    setActiveTab("나의카풀");
  };

  // 카풀 취소하기 기능
  const handleCancelCarpool = (carpoolId: number) => {
    // 취소 확인
    if (!confirm("정말로 카풀을 취소하시겠습니까?")) {
      return;
    }

    // 나의 카풀에서 제거
    const updatedMyCarpool = myCarpool.filter(item => item.id !== carpoolId);
    setMyCarpool(updatedMyCarpool);

    // 일반 카풀과 예비군 카풀에서 참여자 제거
    const updatedRegularCarpoolData = regularCarpoolData.map(carpool => {
      if (carpool.id === carpoolId) {
        // 참여자 목록에서 '나' 제거
        const updatedParticipants = carpool.participants.filter(p => p.id !== 999);
        return { ...carpool, participants: updatedParticipants };
      }
      return carpool;
    });
    setRegularCarpoolData(updatedRegularCarpoolData);

    const updatedMilitaryTrainingCarpoolData = militaryTrainingCarpoolData.map(carpool => {
      if (carpool.id === carpoolId) {
        // 참여자 목록에서 '나' 제거
        const updatedParticipants = carpool.participants.filter(p => p.id !== 999);
        return { ...carpool, participants: updatedParticipants };
      }
      return carpool;
    });
    setMilitaryTrainingCarpoolData(updatedMilitaryTrainingCarpoolData);

    // 취소 완료 메시지
    alert("카풀이 취소되었습니다.");
  };

  // 카풀 등록 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 현재 날짜 및 시간 포맷팅
    const dateObj = new Date(departureDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    // 요일 구하기
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[dateObj.getDay()];

    // 시간 포맷팅
    const timeArr = departureTime.split(":");
    const hour = parseInt(timeArr[0]);
    const minute = timeArr[1];
    const ampm = hour >= 12 ? "오후" : "오전";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    const formattedDate = `${year}년 ${month}월 ${day}일 (${weekday}요일)`;
    const formattedTime = `${ampm} ${hour12}시 ${minute}분`;

    // 새 카풀 데이터 생성
    const newCarpool = {
      id: Date.now(), // 임시 ID
      date: formattedDate,
      time: formattedTime,
      departure: departure,
      destination: destination,
      participants: [
        { id: 999, name: "나", status: "확정" } // 본인은 자동으로 참여
      ],
      maxParticipants: vehicleType === "택시" ? 4 : passengers, // 택시는 최대 4명
      co2Reduction: passengers * 0.5, // 간단한 계산식
      vehicleType: vehicleType,
      tripType: tripType,
      estimatedCost: estimatedCost
    };

    // 카풀 유형에 따라 적절한 배열에 추가
    if (carpoolType === "일반") {
      // 기존 배열을 복사하고 새 항목 추가
      const updatedRegularCarpoolData = [newCarpool, ...regularCarpoolData];
      // 상태 업데이트 (실제 구현에서는 API 호출 등을 통해 서버에 저장)
      setRegularCarpoolData(updatedRegularCarpoolData);
    } else {
      // 기존 배열을 복사하고 새 항목 추가
      const updatedMilitaryTrainingCarpoolData = [newCarpool, ...militaryTrainingCarpoolData];
      // 상태 업데이트 (실제 구현에서는 API 호출 등을 통해 서버에 저장)
      setMilitaryTrainingCarpoolData(updatedMilitaryTrainingCarpoolData);
    }

    // 나의 카풀에도 추가
    const newMyCarpool = {
      ...newCarpool,
      status: "확정"
    };
    const updatedMyCarpool = [newMyCarpool, ...myCarpool];
    setMyCarpool(updatedMyCarpool);

    // 폼 초기화 및 닫기
    setShowRegistrationForm(false);
    alert("카풀이 등록되었습니다!");
  };

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 */}
      <div className="w-full bg-primary py-4 px-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <button
            className="text-white mr-2"
            onClick={() => router.push("/")}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-white">카풀</h1>
        </div>
        <button
          className="bg-primary-light bg-opacity-30 text-white p-2 rounded-full"
          onClick={() => setShowRegistrationForm(true)}
        >
          <FaPlus />
        </button>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-center font-medium ${activeTab === "일반" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("일반")}
          >
            일반 카풀
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${activeTab === "예비군" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("예비군")}
          >
            예비군 카풀
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${activeTab === "나의카풀" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("나의카풀")}
          >
            나의 카풀
          </button>
        </div>
      </div>

      {/* 카풀 등록 모달 */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <motion.div
            className="bg-white rounded-lg w-[375px] max-h-[700px] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">카풀 등록하기</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowRegistrationForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* 카풀 유형 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카풀 유형</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md ${carpoolType === "일반" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
                    onClick={() => {
                      setCarpoolType("일반");
                      setActiveTab("일반");
                    }}
                  >
                    일반
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md ${carpoolType === "예비군" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
                    onClick={() => {
                      setCarpoolType("예비군");
                      setActiveTab("예비군");
                    }}
                  >
                    예비군 같이가기
                  </button>
                </div>
              </div>

              {/* 차량 유형 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">차량 유형</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${vehicleType === "택시" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
                    onClick={() => {
                      setVehicleType("택시");
                      // 택시 선택 시 최대 인원 4명으로 제한
                      if (passengers > 4) {
                        setPassengers(4);
                      }
                    }}
                  >
                    <FaTaxi className="mr-2" /> 택시
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${vehicleType === "렌트" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
                    onClick={() => setVehicleType("렌트")}
                  >
                    <FaCar className="mr-2" /> 렌트
                  </button>
                </div>
              </div>

              {/* 이동 유형 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이동 유형</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md ${tripType === "편도" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
                    onClick={() => setTripType("편도")}
                  >
                    편도
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md ${tripType === "왕복" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
                    onClick={() => setTripType("왕복")}
                  >
                    왕복
                  </button>
                </div>
              </div>

              {/* 인원 수 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUsers className="inline mr-2" /> 인원 수
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{passengers}</span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    onClick={() => {
                      // 택시일 경우 최대 4명, 그 외에는 최대 8명
                      const maxPassengers = vehicleType === "택시" ? 4 : 8;
                      setPassengers(Math.min(maxPassengers, passengers + 1));
                    }}
                  >
                    +
                  </button>
                </div>
                {vehicleType === "택시" && (
                  <p className="text-xs text-gray-500 mt-1">택시는 최대 4명까지 탑승 가능합니다.</p>
                )}
              </div>

              {/* 날짜 및 시간 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2" /> 날짜
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaClock className="inline mr-2" /> 시간
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* 출발지 및 도착지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" /> 출발지
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="예: 한밭대학교 정문"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" /> 도착지
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="예: 둔산동 시청"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              {/* 예상 금액 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaWonSign className="inline mr-2" /> 예상 금액
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="예: 10000"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">1인당 금액 (원)</p>
              </div>

              {/* 예상 탄소 절감량 */}
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-green-700">
                  예상 탄소 절감량: <span className="font-bold">{(passengers * 0.5).toFixed(1)}kg CO<sub>2</sub></span>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {passengers}명이 함께 이동하면 약 {(passengers * 0.5).toFixed(1)}kg의 탄소 배출을 줄일 수 있어요!
                </p>
              </div>

              {/* 제출 버튼 */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-3 w-full">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium shadow-sm"
                >
                  카풀 등록하기
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 카풀 목록 */}
      <div className="p-4 flex-1 overflow-y-auto">
        {/* 일반 카풀 탭 */}
        {activeTab === "일반" && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">일반 카풀 목록</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                총 {regularCarpoolData.length}개
              </span>
            </div>

            {regularCarpoolData.length > 0 ? (
              <div className="space-y-4">
                {regularCarpoolData.map((carpool) => (
                  <div key={carpool.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">{carpool.departure} → {carpool.destination}</h3>
                      <span className="text-xs bg-primary-light text-primary-dark px-2 py-1 rounded-full">
                        {carpool.date}
                      </span>
                    </div>

                    <div className="space-y-2 mt-3">
                      <div className="flex items-center">
                        <FaClock className="text-primary-dark mr-3" />
                        <span className="text-gray-700">{carpool.time}</span>
                      </div>
                      <div className="flex items-center">
                        <FaUsers className="text-primary-dark mr-3" />
                        <span className="text-gray-700">{carpool.participants.length}/{carpool.maxParticipants}명</span>
                      </div>
                      <div className="flex items-center">
                        <FaCar className={`mr-3 ${carpool.vehicleType === "택시" ? "text-yellow-500" : "text-blue-500"}`} />
                        <span className="text-gray-700">{carpool.vehicleType} • {carpool.tripType}</span>
                      </div>
                      <div className="flex items-center">
                        <FaWonSign className="text-primary-dark mr-3" />
                        <span className="text-gray-700">1인당 {parseInt(carpool.estimatedCost).toLocaleString()}원</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-sm text-green-600">
                        <FaLeaf className="inline mr-1" />
                        탄소 절감량: {carpool.co2Reduction}kg
                      </div>
                      <button
                        className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium"
                        onClick={() => handleJoinCarpool(carpool, "일반")}
                      >
                        참여하기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">등록된 일반 카풀이 없습니다.</p>
              </div>
            )}


          </>
        )}

        {/* 예비군 카풀 탭 */}
        {activeTab === "예비군" && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">예비군 카풀 목록</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                총 {militaryTrainingCarpoolData.length}개
              </span>
            </div>

            {militaryTrainingCarpoolData.length > 0 ? (
              <div className="space-y-4">
                {militaryTrainingCarpoolData.map((carpool) => (
                  <div key={carpool.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">{carpool.departure} → {carpool.destination}</h3>
                      <span className="text-xs bg-primary-light text-primary-dark px-2 py-1 rounded-full">
                        {carpool.date}
                      </span>
                    </div>

                    <div className="space-y-2 mt-3">
                      <div className="flex items-center">
                        <FaClock className="text-primary-dark mr-3" />
                        <span className="text-gray-700">{carpool.time}</span>
                      </div>
                      <div className="flex items-center">
                        <FaUsers className="text-primary-dark mr-3" />
                        <span className="text-gray-700">{carpool.participants.length}/{carpool.maxParticipants}명</span>
                      </div>
                      <div className="flex items-center">
                        <FaCar className={`mr-3 ${carpool.vehicleType === "택시" ? "text-yellow-500" : "text-blue-500"}`} />
                        <span className="text-gray-700">{carpool.vehicleType} • {carpool.tripType}</span>
                      </div>
                      <div className="flex items-center">
                        <FaWonSign className="text-primary-dark mr-3" />
                        <span className="text-gray-700">1인당 {parseInt(carpool.estimatedCost).toLocaleString()}원</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-sm text-green-600">
                        <FaLeaf className="inline mr-1" />
                        탄소 절감량: {carpool.co2Reduction}kg
                      </div>
                      <button
                        className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium"
                        onClick={() => handleJoinCarpool(carpool, "예비군")}
                      >
                        참여하기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">등록된 예비군 카풀이 없습니다.</p>
              </div>
            )}


          </>
        )}

        {/* 나의 카풀 탭 */}
        {activeTab === "나의카풀" && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">나의 카풀 신청 내역</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                총 {myCarpool.length}개
              </span>
            </div>

            {myCarpool.length > 0 ? (
              <div className="space-y-4">
                {myCarpool.map((carpool) => (
                  <div key={carpool.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{carpool.departure} → {carpool.destination}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-primary-light text-primary-dark px-2 py-0.5 rounded-full mr-2">
                            {carpool.date}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {carpool.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block mb-1">{carpool.time}</span>
                        <span className="text-xs text-gray-500 block">{carpool.vehicleType} • {carpool.tripType}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-700 text-sm">참여 인원</h4>
                        <span className="text-xs text-primary-dark">
                          {carpool.participants.length}/{carpool.maxParticipants}명
                        </span>
                      </div>

                      <div className="space-y-2 mt-2">
                        {carpool.participants.map((participant) => (
                          <div key={participant.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center mr-2">
                                <FaUser className="text-primary-dark text-xs" />
                              </div>
                              <span className="text-sm text-gray-700">{participant.name}</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${participant.status === "확정" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {participant.status === "확정" && <FaCheck className="inline mr-1" />}
                              {participant.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-700">
                          <FaWonSign className="inline mr-1" />
                          1인당 {parseInt(carpool.estimatedCost).toLocaleString()}원
                        </div>
                        <div className="text-sm text-green-600 mt-1">
                          <FaLeaf className="inline mr-1" />
                          탄소 절감량: {carpool.co2Reduction}kg
                        </div>
                      </div>
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium"
                        onClick={() => handleCancelCarpool(carpool.id)}
                      >
                        취소하기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">신청한 카풀이 없습니다.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 하단 정보 */}
      <div className="fixed bottom-[76px] left-1/2 transform -translate-x-1/2 w-full max-w-[375px]">
        <div className="bg-gray-100 p-3 text-center text-xs text-gray-500">
          다음 수업 · 환경공학 (공학관 201호)
        </div>
      </div>
    </div>
  );
}
