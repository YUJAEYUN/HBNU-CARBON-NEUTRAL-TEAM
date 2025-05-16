"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaArrowLeft, FaCog, FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// 시간표 타입 정의
interface ClassItem {
  id: string;
  subject: string;
  location: string;
  startHour: number;
  endHour: number;
  day: string;
  color: string;
}

// 과목 타입 정의
interface Course {
  id: string;
  code: string;
  subject: string;
  professor: string;
  location: string;
  credit: number;
  department: string;
  category: string;
  grade: number;
  schedule: {
    day: string;
    startHour: number;
    endHour: number;
  }[];
  maxStudents: number;
  currentStudents: number;
}

interface Timetable {
  id: string;
  name: string;
  semester: string;
  classes: ClassItem[];
  courses: Course[];
}

export default function TimetablePage() {
  const router = useRouter();
  const days = ["월", "화", "수", "목", "금"];
  const timeSlots = Array.from({ length: 9 }, (_, i) => 9 + i);

  // 현재 활성화된 시간표 ID
  const [activeTimetableId, setActiveTimetableId] = useState<string>("timetable1");

  // 시간표 추가 모달 상태
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // 수업 추가 모달 상태
  const [showClassModal, setShowClassModal] = useState<boolean>(false);

  // 과목 검색 모달 상태
  const [showCourseSearchModal, setShowCourseSearchModal] = useState<boolean>(false);

  // 필터 상태
  const [filters, setFilters] = useState({
    department: "전체",
    search: "",
    sort: "기본",
    time: "전체",
    grade: "전체",
    category: "전체",
    credit: "전체"
  });

  // 현재 활성화된 필터 모달
  const [activeFilterModal, setActiveFilterModal] = useState<string | null>(null);

  // 새 수업 정보
  const [newClass, setNewClass] = useState<Partial<ClassItem>>({
    subject: "",
    location: "",
    startHour: 9,
    endHour: 10,
    day: "월",
    color: "#FFD966" // 기본 색상
  });

  // 새 시간표 정보
  const [newTimetable, setNewTimetable] = useState<Partial<Timetable>>({
    name: "",
    semester: ""
  });

  // 과목 데이터 (실제로는 API나 DB에서 가져올 수 있음)
  const [courses, setCourses] = useState<Course[]>([
    // 1학년 과목 (1학점 - 1시간)
    {
      id: "GEDU100001-01",
      code: "GEDU100001-01",
      subject: "대학생활과 자기이해",
      professor: "김민지",
      location: "인문관(201)",
      credit: 1,
      department: "전공/영역: 교양필수",
      category: "기본",
      grade: 1,
      schedule: [
        { day: "월", startHour: 9, endHour: 10 }
      ],
      maxStudents: 30,
      currentStudents: 25
    },
    {
      id: "GEDU100002-01",
      code: "GEDU100002-01",
      subject: "글쓰기의 기초",
      professor: "이수진",
      location: "인문관(202)",
      credit: 1,
      department: "전공/영역: 교양필수",
      category: "기본",
      grade: 1,
      schedule: [
        { day: "화", startHour: 10, endHour: 11 }
      ],
      maxStudents: 30,
      currentStudents: 28
    },
    {
      id: "GEDU100003-01",
      code: "GEDU100003-01",
      subject: "진로탐색",
      professor: "박준호",
      location: "인문관(203)",
      credit: 1,
      department: "전공/영역: 교양선택",
      category: "기본",
      grade: 1,
      schedule: [
        { day: "수", startHour: 11, endHour: 12 }
      ],
      maxStudents: 30,
      currentStudents: 15
    },

    // 1학년 과목 (2학점 - 2시간)
    {
      id: "GEDU200001-01",
      code: "GEDU200001-01",
      subject: "영어회화",
      professor: "John Smith",
      location: "외국어관(101)",
      credit: 2,
      department: "전공/영역: 교양필수",
      category: "기본",
      grade: 1,
      schedule: [
        { day: "월", startHour: 13, endHour: 15 }
      ],
      maxStudents: 25,
      currentStudents: 23
    },
    {
      id: "GEDU200002-01",
      code: "GEDU200002-01",
      subject: "컴퓨터 활용",
      professor: "정민수",
      location: "공학관(301)",
      credit: 2,
      department: "전공/영역: 교양필수",
      category: "기본",
      grade: 1,
      schedule: [
        { day: "화", startHour: 15, endHour: 17 }
      ],
      maxStudents: 40,
      currentStudents: 38
    },

    // 2학년 과목 (2학점 - 2시간)
    {
      id: "COMP200001-01",
      code: "COMP200001-01",
      subject: "자료구조",
      professor: "김태호",
      location: "공학관(302)",
      credit: 2,
      department: "전공/영역: 전공필수",
      category: "기본",
      grade: 2,
      schedule: [
        { day: "월", startHour: 10, endHour: 12 }
      ],
      maxStudents: 35,
      currentStudents: 32
    },
    {
      id: "COMP200002-01",
      code: "COMP200002-01",
      subject: "알고리즘",
      professor: "이지원",
      location: "공학관(303)",
      credit: 2,
      department: "전공/영역: 전공필수",
      category: "기본",
      grade: 2,
      schedule: [
        { day: "화", startHour: 13, endHour: 15 }
      ],
      maxStudents: 35,
      currentStudents: 30
    },
    {
      id: "BUSI200001-01",
      code: "BUSI200001-01",
      subject: "회계원리",
      professor: "박세준",
      location: "경영관(201)",
      credit: 2,
      department: "전공/영역: 전공필수",
      category: "기본",
      grade: 2,
      schedule: [
        { day: "수", startHour: 9, endHour: 11 }
      ],
      maxStudents: 40,
      currentStudents: 35
    },

    // 2학년 과목 (3학점 - 3시간)
    {
      id: "COMP300001-01",
      code: "COMP300001-01",
      subject: "데이터베이스",
      professor: "최영희",
      location: "공학관(304)",
      credit: 3,
      department: "전공/영역: 전공필수",
      category: "심화",
      grade: 2,
      schedule: [
        { day: "목", startHour: 9, endHour: 12 }
      ],
      maxStudents: 30,
      currentStudents: 28
    },
    {
      id: "BUSI300001-01",
      code: "BUSI300001-01",
      subject: "마케팅원론",
      professor: "김현우",
      location: "경영관(202)",
      credit: 3,
      department: "전공/영역: 전공필수",
      category: "심화",
      grade: 2,
      schedule: [
        { day: "금", startHour: 13, endHour: 16 }
      ],
      maxStudents: 40,
      currentStudents: 38
    },

    // 3학년 과목 (2학점 - 2시간)
    {
      id: "COMP200003-01",
      code: "COMP200003-01",
      subject: "컴퓨터네트워크",
      professor: "이승민",
      location: "공학관(305)",
      credit: 2,
      department: "전공/영역: 전공선택",
      category: "심화",
      grade: 3,
      schedule: [
        { day: "월", startHour: 15, endHour: 17 }
      ],
      maxStudents: 30,
      currentStudents: 25
    },
    {
      id: "BUSI200002-01",
      code: "BUSI200002-01",
      subject: "재무관리",
      professor: "정수영",
      location: "경영관(203)",
      credit: 2,
      department: "전공/영역: 전공선택",
      category: "심화",
      grade: 3,
      schedule: [
        { day: "화", startHour: 9, endHour: 11 }
      ],
      maxStudents: 35,
      currentStudents: 30
    },

    // 3학년 과목 (3학점 - 3시간)
    {
      id: "SWCE100002-01",
      code: "SWCE100002-01",
      subject: "SW융합 기업실무",
      professor: "고진욱",
      location: "정의학신관(306)",
      credit: 3,
      department: "전공/영역: 전공선택",
      category: "심화",
      grade: 3,
      schedule: [
        { day: "수", startHour: 9, endHour: 12 }
      ],
      maxStudents: 24,
      currentStudents: 20
    },
    {
      id: "SWCE100005-01",
      code: "SWCE100005-01",
      subject: "데이터사이언스 개론",
      professor: "이정민",
      location: "정의학신관(306)",
      credit: 3,
      department: "전공/영역: 전공선택",
      category: "심화",
      grade: 3,
      schedule: [
        { day: "목", startHour: 14, endHour: 17 }
      ],
      maxStudents: 24,
      currentStudents: 3
    },
    {
      id: "SWCE100006-01",
      code: "SWCE100006-01",
      subject: "드론 코딩",
      professor: "윤성재",
      location: "정의학신관(306)",
      credit: 3,
      department: "전공/영역: 전공선택",
      category: "응용",
      grade: 3,
      schedule: [
        { day: "화", startHour: 12, endHour: 15 }
      ],
      maxStudents: 24,
      currentStudents: 7
    },

    // 4학년 과목 (2학점 - 2시간)
    {
      id: "COMP200004-01",
      code: "COMP200004-01",
      subject: "소프트웨어공학",
      professor: "박지훈",
      location: "공학관(306)",
      credit: 2,
      department: "전공/영역: 전공선택",
      category: "응용",
      grade: 4,
      schedule: [
        { day: "월", startHour: 13, endHour: 15 }
      ],
      maxStudents: 25,
      currentStudents: 20
    },
    {
      id: "BUSI200003-01",
      code: "BUSI200003-01",
      subject: "경영전략",
      professor: "최재원",
      location: "경영관(204)",
      credit: 2,
      department: "전공/영역: 전공선택",
      category: "응용",
      grade: 4,
      schedule: [
        { day: "화", startHour: 15, endHour: 17 }
      ],
      maxStudents: 30,
      currentStudents: 25
    },

    // 4학년 과목 (3학점 - 3시간)
    {
      id: "SWCE100013-01",
      code: "SWCE100013-01",
      subject: "인공지능 개론",
      professor: "윤성재",
      location: "정의학신관(306)",
      credit: 3,
      department: "전공/영역: 전공선택",
      category: "응용",
      grade: 4,
      schedule: [
        { day: "목", startHour: 6, endHour: 9 }
      ],
      maxStudents: 24,
      currentStudents: 1
    },
    {
      id: "SWCE100014-01",
      code: "SWCE100014-01",
      subject: "네트워크 및 데이터통신",
      professor: "고진욱",
      location: "정의학신관(306)",
      credit: 3,
      department: "전공/영역: 전공선택",
      category: "응용",
      grade: 4,
      schedule: [
        { day: "월", startHour: 9, endHour: 12 }
      ],
      maxStudents: 24,
      currentStudents: 20
    },
    {
      id: "SWCE100015-01",
      code: "SWCE100015-01",
      subject: "모바일컴퓨팅과정보",
      professor: "서동희",
      location: "정의학신관(408)",
      credit: 3,
      department: "전공/영역: 전공선택",
      category: "응용",
      grade: 4,
      schedule: [
        { day: "금", startHour: 9, endHour: 12 }
      ],
      maxStudents: 24,
      currentStudents: 20
    },

    // 교양 과목 (1학점 - 1시간)
    {
      id: "GEDU100004-01",
      code: "GEDU100004-01",
      subject: "체육(수영)",
      professor: "김태양",
      location: "체육관(101)",
      credit: 1,
      department: "전공/영역: 교양선택",
      category: "기본",
      grade: 1,
      schedule: [
        { day: "금", startHour: 14, endHour: 15 }
      ],
      maxStudents: 20,
      currentStudents: 18
    },
    {
      id: "GEDU100005-01",
      code: "GEDU100005-01",
      subject: "음악감상",
      professor: "이지영",
      location: "예술관(201)",
      credit: 1,
      department: "전공/영역: 교양선택",
      category: "기본",
      grade: 2,
      schedule: [
        { day: "수", startHour: 16, endHour: 17 }
      ],
      maxStudents: 30,
      currentStudents: 25
    },

    // 교양 과목 (2학점 - 2시간)
    {
      id: "GEDU200003-01",
      code: "GEDU200003-01",
      subject: "철학의 이해",
      professor: "박철수",
      location: "인문관(204)",
      credit: 2,
      department: "전공/영역: 교양선택",
      category: "심화",
      grade: 2,
      schedule: [
        { day: "목", startHour: 13, endHour: 15 }
      ],
      maxStudents: 35,
      currentStudents: 30
    },
    {
      id: "GEDU200004-01",
      code: "GEDU200004-01",
      subject: "심리학개론",
      professor: "김민수",
      location: "인문관(205)",
      credit: 2,
      department: "전공/영역: 교양선택",
      category: "심화",
      grade: 3,
      schedule: [
        { day: "화", startHour: 11, endHour: 13 }
      ],
      maxStudents: 40,
      currentStudents: 38
    },

    // 교양 과목 (3학점 - 3시간)
    {
      id: "GEDU300001-01",
      code: "GEDU300001-01",
      subject: "세계문화의 이해",
      professor: "이세계",
      location: "인문관(206)",
      credit: 3,
      department: "전공/영역: 교양선택",
      category: "심화",
      grade: 3,
      schedule: [
        { day: "월", startHour: 15, endHour: 18 }
      ],
      maxStudents: 35,
      currentStudents: 30
    },
    {
      id: "GEDU300002-01",
      code: "GEDU300002-01",
      subject: "현대사회와 윤리",
      professor: "박윤리",
      location: "인문관(207)",
      credit: 3,
      department: "전공/영역: 교양선택",
      category: "응용",
      grade: 4,
      schedule: [
        { day: "수", startHour: 9, endHour: 12 }
      ],
      maxStudents: 30,
      currentStudents: 25
    },
    {
      id: "SWCE100016-01",
      code: "SWCE100016-01",
      subject: "기업가정신과창업",
      professor: "정원",
      location: "정의학신관(306)",
      credit: 3,
      department: "전공/영역: 일반선택",
      category: "응용",
      grade: 4,
      schedule: [
        { day: "금", startHour: 13, endHour: 16 }
      ],
      maxStudents: 24,
      currentStudents: 20
    },
    {
      id: "SWCE100017-01",
      code: "SWCE100017-01",
      subject: "창의적 문제해결",
      professor: "서동희",
      location: "정의학신관(DH101)",
      credit: 3,
      department: "전공/영역: 일반선택",
      category: "응용",
      grade: 4,
      schedule: [
        { day: "목", startHour: 15, endHour: 18 }
      ],
      maxStudents: 24,
      currentStudents: 20
    }
  ]);

  // 시간표 데이터 (실제로는 API나 DB에서 가져올 수 있음)
  const [timetables, setTimetables] = useState<Timetable[]>([
    {
      id: "timetable1",
      name: "환경 지키미",
      semester: "2025년 1학기",
      classes: [
        { id: "class1", subject: "영화의이해", location: "교111", startHour: 9, endHour: 10, day: "목", color: "#FFD966" },
        { id: "class2", subject: "한문강독", location: "교111", startHour: 10, endHour: 11, day: "화", color: "#FFD966" },
        { id: "class3", subject: "한국문화유산의이해", location: "교404", startHour: 10, endHour: 12, day: "금", color: "#9FC5E8" },
        { id: "class4", subject: "한국문화유산의이해", location: "교404", startHour: 11, endHour: 12, day: "수", color: "#9FC5E8" },
        { id: "class5", subject: "미시경제원론", location: "상부110", startHour: 11, endHour: 13, day: "월", color: "#F4CCCC" },
        { id: "class6", subject: "미시경제원론", location: "상부110", startHour: 12, endHour: 13, day: "수", color: "#F4CCCC" },
        { id: "class7", subject: "공학기초설계", location: "정D114", startHour: 11, endHour: 14, day: "목", color: "#F9CB9C" },
        { id: "class8", subject: "사진예술의이해", location: "교101", startHour: 13, endHour: 15, day: "월", color: "#B6D7A8" },
        { id: "class9", subject: "동아시아신화기행", location: "교303", startHour: 13, endHour: 15, day: "수", color: "#D5A6BD" },
        { id: "class10", subject: "동아시아신화기행", location: "교303", startHour: 13, endHour: 15, day: "금", color: "#D5A6BD" }
      ],
      courses: []
    }
  ]);

  // 현재 활성화된 시간표 가져오기
  const activeTimetable = timetables.find(t => t.id === activeTimetableId) || timetables[0];

  // 요일별 수업 필터링
  const getClassesByDay = (day: string) => {
    return activeTimetable.classes.filter(c => c.day === day);
  };

  // 시간표 추가 함수
  const addTimetable = () => {
    if (!newTimetable.name || !newTimetable.semester) return;

    const newId = `timetable${timetables.length + 1}`;
    const timetableToAdd: Timetable = {
      id: newId,
      name: newTimetable.name || "",
      semester: newTimetable.semester || "",
      classes: [],
      courses: []
    };

    setTimetables([...timetables, timetableToAdd]);
    setActiveTimetableId(newId);
    setNewTimetable({ name: "", semester: "" });
    setShowAddModal(false);
  };

  // 필터링된 과목 목록 가져오기
  const getFilteredCourses = () => {
    return courses.filter(course => {
      // 전공/영역 필터
      if (filters.department !== "전체" && !course.department.includes(filters.department)) {
        return false;
      }

      // 검색어 필터
      if (filters.search &&
          !course.subject.toLowerCase().includes(filters.search.toLowerCase()) &&
          !course.professor.toLowerCase().includes(filters.search.toLowerCase()) &&
          !course.code.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // 학년 필터
      if (filters.grade !== "전체" && course.grade !== parseInt(filters.grade)) {
        return false;
      }

      // 구분 필터
      if (filters.category !== "전체" && course.category !== filters.category) {
        return false;
      }

      // 학점 필터
      if (filters.credit !== "전체" && course.credit !== parseInt(filters.credit)) {
        return false;
      }

      return true;
    });
  };

  // 과목을 시간표에 추가하는 함수
  const addCourseToTimetable = (course: Course) => {
    // 색상 배열
    const colors = ["#FFD966", "#9FC5E8", "#F4CCCC", "#F9CB9C", "#B6D7A8", "#D5A6BD"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // 과목의 모든 일정을 시간표에 추가
    const newClasses = course.schedule.map((scheduleItem, index) => ({
      id: `class${Date.now()}-${index}`,
      subject: course.subject,
      location: course.location,
      startHour: scheduleItem.startHour,
      endHour: scheduleItem.endHour,
      day: scheduleItem.day,
      color: randomColor
    }));

    const updatedTimetables = timetables.map(t => {
      if (t.id === activeTimetableId) {
        // 이미 추가된 과목인지 확인
        const courseExists = t.courses.some(c => c.id === course.id);

        return {
          ...t,
          classes: [...t.classes, ...newClasses],
          courses: courseExists ? t.courses : [...t.courses, course]
        };
      }
      return t;
    });

    setTimetables(updatedTimetables);
    setShowCourseSearchModal(false);

    // 디버깅 메시지
    console.log("과목이 시간표에 추가되었습니다:", course.subject);
  };

  // 수업 추가 함수
  const addClass = () => {
    if (!newClass.subject || !newClass.location || !newClass.day) return;

    const classToAdd: ClassItem = {
      id: `class${Date.now()}`,
      subject: newClass.subject || "",
      location: newClass.location || "",
      startHour: newClass.startHour || 9,
      endHour: newClass.endHour || 10,
      day: newClass.day || "월",
      color: newClass.color || "#FFD966"
    };

    const updatedTimetables = timetables.map(t => {
      if (t.id === activeTimetableId) {
        return {
          ...t,
          classes: [...t.classes, classToAdd]
        };
      }
      return t;
    });

    setTimetables(updatedTimetables);
    setNewClass({
      subject: "",
      location: "",
      startHour: 9,
      endHour: 10,
      day: "월",
      color: "#FFD966"
    });
    setShowClassModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 */}
      <div className="w-full bg-white py-4 px-4 flex flex-col shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="text-gray-500 mr-2"
              onClick={() => router.push("/")}
            >
              <FaArrowLeft />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="text-red-500 p-2 rounded-full"
              onClick={() => {
                console.log("과목 검색 모달 열기");
                setShowCourseSearchModal(true);
              }}
            >
              <FaPlus />
            </button>
            <button className="text-gray-500 p-2 rounded-full">
              <FaCog />
            </button>
            <button className="text-gray-500 p-2 rounded-full">
              <FaBars />
            </button>
          </div>
        </div>

        {/* 학기 및 시간표 이름 */}
        <div className="mt-2">
          <p className="text-sm text-red-500">{activeTimetable.semester}</p>
          <h1 className="text-2xl font-bold text-gray-800">{activeTimetable.name}</h1>
        </div>
      </div>

      {/* 시간표 그리드 */}
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-gray-200">
          {/* 요일 헤더 */}
          <div className="flex">
            <div className="w-10 border-r border-gray-200"></div>
            {days.map((day) => (
              <div key={day} className="flex-1 text-center py-3 text-sm font-medium border-r border-gray-200">
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* 시간 슬롯 */}
          {timeSlots.map((hour) => (
            <div key={hour} className="flex border-b border-gray-200">
              <div className="w-10 text-xs text-gray-500 py-2 text-center border-r border-gray-200">
                {hour}
              </div>
              {days.map((day) => (
                <div key={`${hour}-${day}`} className="flex-1 h-16 border-r border-gray-200 relative">
                  {/* 이 시간대에 해당하는 수업 표시 */}
                  {getClassesByDay(day)
                    .filter(c => c.startHour <= hour && c.endHour > hour)
                    .map((classItem) => {
                      // 수업이 시작하는 시간인 경우에만 렌더링
                      if (classItem.startHour === hour) {
                        return (
                          <div
                            key={classItem.id}
                            className="absolute left-0 right-0 overflow-hidden rounded-md p-1 text-xs"
                            style={{
                              top: "0",
                              height: `${(classItem.endHour - classItem.startHour) * 64}px`,
                              backgroundColor: classItem.color,
                              zIndex: 10
                            }}
                          >
                            <p className="font-medium">{classItem.subject}</p>
                            <p className="text-xs">{classItem.location}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 친구 시간표 섹션
      <div className="border-t border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">친구 시간표</h2>
        </div>
      </div> */}

      {/* 시간표 추가 모달 */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-5 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4">새 시간표 추가</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">학기</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="예: 2023년 1학기"
                    value={newTimetable.semester}
                    onChange={(e) => setNewTimetable({...newTimetable, semester: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시간표 이름</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="예: 1학년 시간표"
                    value={newTimetable.name}
                    onChange={(e) => setNewTimetable({...newTimetable, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md text-gray-700"
                  onClick={() => setShowAddModal(false)}
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 bg-red-500 rounded-md text-white"
                  onClick={addTimetable}
                >
                  추가
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 수업 추가 모달 */}
      <AnimatePresence>
        {showClassModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-5 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4">수업 추가</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">과목명</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="예: 영화의이해"
                    value={newClass.subject}
                    onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="예: 교111"
                    value={newClass.location}
                    onChange={(e) => setNewClass({...newClass, location: e.target.value})}
                  />
                </div>

                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">요일</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newClass.day}
                      onChange={(e) => setNewClass({...newClass, day: e.target.value})}
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newClass.startHour}
                      onChange={(e) => setNewClass({...newClass, startHour: parseInt(e.target.value)})}
                    >
                      {timeSlots.map(hour => (
                        <option key={`start-${hour}`} value={hour}>{hour}시</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newClass.endHour}
                      onChange={(e) => setNewClass({...newClass, endHour: parseInt(e.target.value)})}
                    >
                      {timeSlots.map(hour => (
                        <option key={`end-${hour+1}`} value={hour+1}>{hour+1}시</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">색상</label>
                  <div className="flex space-x-2">
                    {["#FFD966", "#9FC5E8", "#F4CCCC", "#F9CB9C", "#B6D7A8", "#D5A6BD"].map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${newClass.color === color ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewClass({...newClass, color})}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md text-gray-700"
                  onClick={() => setShowClassModal(false)}
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 bg-red-500 rounded-md text-white"
                  onClick={addClass}
                >
                  추가
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* 과목 검색 모달 */}
      <AnimatePresence>
        {showCourseSearchModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md max-h-[80vh] rounded-xl overflow-hidden flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* 모달 헤더 */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <button
                    className="text-gray-500 mr-4"
                    onClick={() => setShowCourseSearchModal(false)}
                  >
                    <FaArrowLeft />
                  </button>
                  <h2 className="text-lg font-bold">시간표 추가</h2>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                    마법사
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                    직접 추가
                  </button>
                </div>
              </div>

              {/* 검색 필터 */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                    placeholder="과목명, 교수명, 학수번호 검색"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>

              {/* 필터 옵션 */}
              <div className="flex overflow-x-auto p-2 border-b border-gray-200">
                <button
                  className="flex-shrink-0 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2"
                  onClick={() => setActiveFilterModal("department")}
                >
                  전공/영역: {filters.department}
                </button>
                <button
                  className="flex-shrink-0 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2"
                  onClick={() => setActiveFilterModal("sort")}
                >
                  정렬: {filters.sort}
                </button>
                <button
                  className="flex-shrink-0 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2"
                  onClick={() => setActiveFilterModal("time")}
                >
                  시간: {filters.time}
                </button>
                <button
                  className="flex-shrink-0 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2"
                  onClick={() => setActiveFilterModal("grade")}
                >
                  학년: {filters.grade}
                </button>
                <button
                  className="flex-shrink-0 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2"
                  onClick={() => setActiveFilterModal("category")}
                >
                  구분: {filters.category}
                </button>
                <button
                  className="flex-shrink-0 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                  onClick={() => setActiveFilterModal("credit")}
                >
                  학점: {filters.credit}
                </button>
              </div>

              {/* 필터 모달 */}
              <AnimatePresence>
                {activeFilterModal && (
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-50 z-[200] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-white w-full max-w-sm rounded-xl overflow-hidden flex flex-col max-h-[70vh]"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                    >
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                      <h3 className="font-bold">
                        {activeFilterModal === "department" && "전공/영역 선택"}
                        {activeFilterModal === "sort" && "정렬 방식 선택"}
                        {activeFilterModal === "time" && "시간 선택"}
                        {activeFilterModal === "grade" && "학년 선택"}
                        {activeFilterModal === "category" && "구분 선택"}
                        {activeFilterModal === "credit" && "학점 선택"}
                      </h3>
                      <button
                        className="text-gray-500"
                        onClick={() => setActiveFilterModal(null)}
                      >
                        닫기
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                      {activeFilterModal === "department" && (
                        <div className="space-y-3">
                          {["전체", "전공필수", "전공선택", "교양필수", "교양선택", "일반선택"].map(item => (
                            <button
                              key={item}
                              className={`block w-full text-left p-3 rounded-md ${filters.department === item ? 'bg-red-100 text-red-500' : 'bg-gray-100'}`}
                              onClick={() => {
                                setFilters({...filters, department: item});
                                setActiveFilterModal(null);
                              }}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}

                      {activeFilterModal === "sort" && (
                        <div className="space-y-3">
                          {["기본", "과목명", "학점", "인기순"].map(item => (
                            <button
                              key={item}
                              className={`block w-full text-left p-3 rounded-md ${filters.sort === item ? 'bg-red-100 text-red-500' : 'bg-gray-100'}`}
                              onClick={() => {
                                setFilters({...filters, sort: item});
                                setActiveFilterModal(null);
                              }}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}

                      {activeFilterModal === "time" && (
                        <div className="space-y-3">
                          {["전체", "오전", "오후", "월요일", "화요일", "수요일", "목요일", "금요일"].map(item => (
                            <button
                              key={item}
                              className={`block w-full text-left p-3 rounded-md ${filters.time === item ? 'bg-red-100 text-red-500' : 'bg-gray-100'}`}
                              onClick={() => {
                                setFilters({...filters, time: item});
                                setActiveFilterModal(null);
                              }}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}

                      {activeFilterModal === "grade" && (
                        <div className="space-y-3">
                          {["전체", "1", "2", "3", "4"].map(item => (
                            <button
                              key={item}
                              className={`block w-full text-left p-3 rounded-md ${filters.grade === item ? 'bg-red-100 text-red-500' : 'bg-gray-100'}`}
                              onClick={() => {
                                setFilters({...filters, grade: item});
                                setActiveFilterModal(null);
                              }}
                            >
                              {item}학년
                            </button>
                          ))}
                        </div>
                      )}

                      {activeFilterModal === "category" && (
                        <div className="space-y-3">
                          {["전체", "기본", "심화", "응용"].map(item => (
                            <button
                              key={item}
                              className={`block w-full text-left p-3 rounded-md ${filters.category === item ? 'bg-red-100 text-red-500' : 'bg-gray-100'}`}
                              onClick={() => {
                                setFilters({...filters, category: item});
                                setActiveFilterModal(null);
                              }}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}

                      {activeFilterModal === "credit" && (
                        <div className="space-y-3">
                          {["전체", "1", "2", "3"].map(item => (
                            <button
                              key={item}
                              className={`block w-full text-left p-3 rounded-md ${filters.credit === item ? 'bg-red-100 text-red-500' : 'bg-gray-100'}`}
                              onClick={() => {
                                setFilters({...filters, credit: item});
                                setActiveFilterModal(null);
                              }}
                            >
                              {item === "전체" ? item : `${item}학점`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 과목 목록 */}
              <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(80vh - 150px)" }}>
                {getFilteredCourses().map((course) => (
                  <div
                    key={course.id}
                    className="border-b border-gray-200 p-4"
                    onClick={() => addCourseToTimetable(course)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{course.subject}</h3>
                        <p className="text-sm text-gray-600">{course.professor}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full mr-1">
                            {course.code}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                            {course.credit}학점
                          </span>
                        </div>
                        <div className="mt-2">
                          {course.schedule.map((scheduleItem, index) => (
                            <p key={index} className="text-xs text-gray-500">
                              {scheduleItem.day} {scheduleItem.startHour}:00-{scheduleItem.endHour}:00 {course.location}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-1">담은 인원</span>
                          <span className="text-xs font-medium">{course.currentStudents}/{course.maxStudents}</span>
                        </div>
                        <div className="mt-1 flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-yellow-400 text-xs">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
