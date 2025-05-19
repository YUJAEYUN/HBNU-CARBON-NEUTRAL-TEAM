'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { Course, FilterState } from '../types';

interface CourseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCourses: Course[];
  selectedCourses: string[];
  setSelectedCourses: (courses: string[]) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  addCourseToTimetable: (course: Course) => void;
  activeTimetable?: any; // 현재 활성화된 시간표 정보
}

const CourseSearchModal = ({
  isOpen,
  onClose,
  availableCourses,
  selectedCourses,
  setSelectedCourses,
  filters,
  setFilters,
  addCourseToTimetable,
  activeTimetable
}: CourseSearchModalProps) => {
  // 필터 모달 상태
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  // 시간 충돌 확인 함수
  const checkTimeConflict = (course: Course): boolean => {
    if (!activeTimetable || !activeTimetable.classes || activeTimetable.classes.length === 0) {
      return false;
    }

    // 과목의 모든 일정에 대해 충돌 확인
    return course.schedule.some(scheduleItem => {
      // 현재 시간표의 모든 수업과 비교
      return activeTimetable.classes.some((classItem: any) => {
        // 요일이 같고 시간이 겹치는지 확인
        return classItem.day === scheduleItem.day && (
          (scheduleItem.startHour < classItem.endHour && scheduleItem.endHour > classItem.startHour) ||
          (scheduleItem.startHour === classItem.startHour && scheduleItem.endHour === classItem.endHour)
        );
      });
    });
  };

  // 필터링된 과목 목록 가져오기
  const getFilteredCourses = () => {
    return availableCourses.filter((course: Course) => {
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

  // 과목 선택 토글
  const toggleCourseSelection = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  // 선택한 과목들 추가
  const addSelectedCourses = () => {
    const selectedCoursesList = availableCourses.filter(course =>
      selectedCourses.includes(course.id as string)
    );

    selectedCoursesList.forEach(course => {
      addCourseToTimetable(course);
    });

    setSelectedCourses([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 bg-white flex flex-col z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 모달 헤더 */}
          <div className="bg-white p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <button
                className="text-gray-500"
                onClick={onClose}
              >
                <FaTimes />
              </button>
              <h2 className="text-lg font-bold">과목 검색</h2>
              <div className="w-6"></div>
            </div>

            {/* 검색 입력 */}
            <div className="mt-4 relative">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4"
                placeholder="과목명, 교수명, 과목코드 검색"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <button
                className="absolute right-3 top-2 text-primary"
                onClick={() => setShowFilterModal(true)}
              >
                <FaFilter />
              </button>
            </div>

            {/* 필터 태그 */}
            {(filters.department !== "전체" ||
              filters.grade !== "전체" ||
              filters.category !== "전체" ||
              filters.credit !== "전체") && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.department !== "전체" && (
                  <div className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full flex items-center">
                    {filters.department}
                    <button
                      className="ml-1"
                      onClick={() => setFilters({ ...filters, department: "전체" })}
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                )}
                {filters.grade !== "전체" && (
                  <div className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full flex items-center">
                    {filters.grade}학년
                    <button
                      className="ml-1"
                      onClick={() => setFilters({ ...filters, grade: "전체" })}
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                )}
                {filters.category !== "전체" && (
                  <div className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full flex items-center">
                    {filters.category}
                    <button
                      className="ml-1"
                      onClick={() => setFilters({ ...filters, category: "전체" })}
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                )}
                {filters.credit !== "전체" && (
                  <div className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full flex items-center">
                    {filters.credit}학점
                    <button
                      className="ml-1"
                      onClick={() => setFilters({ ...filters, credit: "전체" })}
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 과목 목록 */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {getFilteredCourses().length > 0 ? (
              getFilteredCourses().map((course) => (
                <div
                  key={course.id}
                  className={`border-b border-gray-200 p-4 ${
                    selectedCourses.includes(course.id as string)
                      ? "bg-primary-light"
                      : checkTimeConflict(course)
                        ? "bg-red-50"
                        : "bg-white"
                  }`}
                  onClick={() => toggleCourseSelection(course.id as string)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{course.subject}</h3>
                        {checkTimeConflict(course) && (
                          <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
                            시간 충돌
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{course.professor} | {course.code}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {course.credit}학점
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    {course.schedule.map((scheduleItem, index) => (
                      <p key={index} className="text-xs text-gray-500">
                        {scheduleItem.day} {scheduleItem.startHour}:00-{scheduleItem.endHour}:00 {course.location}
                      </p>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 하단 버튼 */}
          {selectedCourses.length > 0 && (
            <div className="bg-white p-4 shadow-t-sm">
              <button
                className="w-full bg-primary text-white py-3 rounded-full font-medium"
                onClick={addSelectedCourses}
              >
                {selectedCourses.length}개 과목 추가하기
              </button>
            </div>
          )}

          {/* 필터 모달 */}
          <AnimatePresence>
            {showFilterModal && (
              <div className="absolute inset-0 flex items-center justify-center z-[200]">
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilterModal(false)}
                />
                <motion.div
                  className="relative bg-white rounded-xl p-5 w-[280px] mx-auto"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-bold mb-4">필터</h3>

                  {/* 전공/영역 필터 */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      전공/영역
                    </label>
                    <select
                      className="shadow border rounded w-full py-2 px-3 text-gray-700"
                      value={filters.department}
                      onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    >
                      <option value="전체">전체</option>
                      <option value="전공필수">전공필수</option>
                      <option value="전공선택">전공선택</option>
                      <option value="교양필수">교양필수</option>
                      <option value="교양선택">교양선택</option>
                      <option value="일반선택">일반선택</option>
                    </select>
                  </div>

                  {/* 학년 필터 */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      학년
                    </label>
                    <select
                      className="shadow border rounded w-full py-2 px-3 text-gray-700"
                      value={filters.grade}
                      onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                    >
                      <option value="전체">전체</option>
                      <option value="1">1학년</option>
                      <option value="2">2학년</option>
                      <option value="3">3학년</option>
                      <option value="4">4학년</option>
                    </select>
                  </div>

                  {/* 구분 필터 */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      구분
                    </label>
                    <select
                      className="shadow border rounded w-full py-2 px-3 text-gray-700"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                      <option value="전체">전체</option>
                      <option value="기본">기본</option>
                      <option value="심화">심화</option>
                      <option value="응용">응용</option>
                    </select>
                  </div>

                  {/* 학점 필터 */}
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      학점
                    </label>
                    <select
                      className="shadow border rounded w-full py-2 px-3 text-gray-700"
                      value={filters.credit}
                      onChange={(e) => setFilters({ ...filters, credit: e.target.value })}
                    >
                      <option value="전체">전체</option>
                      <option value="1">1학점</option>
                      <option value="2">2학점</option>
                      <option value="3">3학점</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      className="bg-primary text-white px-4 py-2 rounded-md"
                      onClick={() => setShowFilterModal(false)}
                    >
                      적용
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CourseSearchModal;
