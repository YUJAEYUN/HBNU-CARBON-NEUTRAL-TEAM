'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTimetable } from './hooks/useTimetable';
import TimetableHeader from './components/TimetableHeader';
import TimetableGrid from './components/TimetableGrid';
import FriendsList from './components/FriendsList';
import AddTimetableModal from './components/AddTimetableModal';
import AddClassModal from './components/AddClassModal';
import CourseSearchModal from './components/CourseSearchModal';
import ConfirmModal from './components/ConfirmModal';
import * as api from './utils/api';
import { ClassItem } from './types';

export default function TimetablePage() {
  const {
    // 상태
    activeTimetableId,
    showAddModal,
    showClassModal,
    showCourseSearchModal,
    showConfirmModal,
    confirmMessage,
    confirmAction,
    loading,
    error,
    filters,
    newClass,
    newTimetable,
    timetables,
    friends,
    showFriends,
    availableCourses,
    selectedCourses,
    activeTimetable,
    setTimetables,

    // 상태 변경 함수
    setActiveTimetableId,
    setShowAddModal,
    setShowClassModal,
    setShowCourseSearchModal,
    setShowConfirmModal,
    setError,
    setFilters,
    setNewClass,
    setNewTimetable,
    setShowFriends,
    setSelectedCourses,

    // 유틸리티 함수
    getClassesByDay,

    // 액션 함수
    addTimetable,
    deleteTimetable,
    addClass,
    deleteClass
  } = useTimetable();

  // 요일 및 시간 슬롯 정의
  const days = ["월", "화", "수", "목", "금"];
  // 9시부터 17시까지 (9시가 맨 위에 오도록)
  const timeSlots = [9, 10, 11, 12, 13, 14, 15, 16, 17];

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px] relative">
      {/* 오류 메시지 토스트 */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[350px] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 shadow-md"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <p>{error}</p>
              <button
                className="text-red-700"
                onClick={() => setError(null)}
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 로딩 인디케이터 */}
      <AnimatePresence>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-[300]">
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative bg-white p-4 rounded-lg shadow-lg w-[280px]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-center text-gray-700 text-sm">로딩 중...</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 상단 헤더 */}
      <TimetableHeader
        activeTimetable={activeTimetable}
        timetables={timetables}
        activeTimetableId={activeTimetableId}
        setActiveTimetableId={setActiveTimetableId}
        setShowAddModal={setShowAddModal}
        setShowClassModal={setShowClassModal}
        setShowCourseSearchModal={setShowCourseSearchModal}
        deleteTimetable={deleteTimetable}
        setError={setError}
      />

      {/* 시간표 그리드 */}
      <TimetableGrid
        days={days}
        timeSlots={timeSlots}
        getClassesByDay={getClassesByDay}
        deleteClass={deleteClass}
      />

      {/* 친구 시간표 섹션 */}
      <FriendsList
        friends={friends}
        showFriends={showFriends}
        setShowFriends={setShowFriends}
      />

      {/* 시간표 추가 모달 */}
      <AddTimetableModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newTimetable={newTimetable}
        setNewTimetable={setNewTimetable}
        addTimetable={addTimetable}
      />

      {/* 수업 추가 모달 */}
      <AddClassModal
        isOpen={showClassModal}
        onClose={() => setShowClassModal(false)}
        newClass={newClass}
        setNewClass={setNewClass}
        addClass={addClass}
      />

      {/* 과목 검색 모달 */}
      <CourseSearchModal
        isOpen={showCourseSearchModal}
        onClose={() => setShowCourseSearchModal(false)}
        availableCourses={availableCourses}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
        filters={filters}
        setFilters={setFilters}
        activeTimetable={activeTimetable}
        addCourseToTimetable={(course) => {
          // 과목을 시간표에 추가하는 함수
          const colors = ["#FFD966", "#9FC5E8", "#F4CCCC", "#F9CB9C", "#B6D7A8", "#D5A6BD"];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          // 과목의 모든 일정을 시간표에 추가
          course.schedule.forEach(scheduleItem => {
            // 직접 API 호출에 필요한 데이터 구성
            const classData = {
              timetable_id: activeTimetableId,
              subject: course.subject,
              location: course.location,
              day: scheduleItem.day,
              start_hour: scheduleItem.startHour,
              end_hour: scheduleItem.endHour,
              color: randomColor
            };

            // API 호출하여 수업 추가
            api.addClass(classData)
              .then(newClassData => {
                // 새 수업을 시간표에 추가
                const updatedTimetables = timetables.map(t => {
                  if (t.id === activeTimetableId) {
                    return {
                      ...t,
                      classes: [...t.classes, {
                        id: newClassData.id,
                        subject: newClassData.subject,
                        location: newClassData.location,
                        startHour: scheduleItem.startHour,
                        endHour: scheduleItem.endHour,
                        day: newClassData.day || scheduleItem.day,
                        color: newClassData.color || randomColor
                      }]
                    };
                  }
                  return t;
                });

                setTimetables(updatedTimetables);
              })
              .catch(err => {
                console.error("수업 추가 오류:", err);
                setError("수업 추가 중 오류가 발생했습니다.");
              });
          });
        }}
      />

      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        message={confirmMessage}
        onConfirm={async () => {
          if (typeof confirmAction === 'function') {
            await confirmAction();
          }
          setShowConfirmModal(false);
        }}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}
