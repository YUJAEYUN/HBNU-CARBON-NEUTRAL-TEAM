import { useState, useEffect, useCallback } from 'react';
import { Timetable, ClassItem, Course, Friend, FilterState } from '../types';
import * as api from '../utils/api';

export const useTimetable = () => {
  // 현재 활성화된 시간표 ID
  const [activeTimetableId, setActiveTimetableId] = useState<string | number>("");

  // 시간표 추가 모달 상태
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // 수업 추가 모달 상태
  const [showClassModal, setShowClassModal] = useState<boolean>(false);

  // 과목 검색 모달 상태
  const [showCourseSearchModal, setShowCourseSearchModal] = useState<boolean>(false);

  // 확인 모달 상태
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => async () => {});
  const [confirmMessage, setConfirmMessage] = useState<string>("");

  // 로딩 상태
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [filters, setFilters] = useState<FilterState>({
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

  // 시간표 데이터
  const [timetables, setTimetables] = useState<Timetable[]>([]);

  // 친구 목록
  const [friends, setFriends] = useState<Friend[]>([]);

  // 친구 목록 표시 상태
  const [showFriends, setShowFriends] = useState<boolean>(false);

  // 과목 데이터
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

  // 선택된 과목 목록
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 시간표 목록 조회
      const timetablesData = await api.fetchTimetables();
      setTimetables(timetablesData);

      // 활성화된 시간표가 있으면 선택
      const activeTable = timetablesData.find(t => t.is_active);
      if (activeTable) {
        setActiveTimetableId(activeTable.id);

        // 활성화된 시간표의 수업 목록 조회
        const classesData = await api.fetchClasses(activeTable.id);

        // 시간표에 수업 데이터 추가
        const updatedTimetables = timetablesData.map(t => {
          if (t.id === activeTable.id) {
            return {
              ...t,
              classes: classesData
            };
          }
          return t;
        });

        setTimetables(updatedTimetables);
      } else if (timetablesData.length > 0) {
        setActiveTimetableId(timetablesData[0].id);
      }

      // 친구 목록 조회
      const friendsData = await api.fetchFriends();
      setFriends(friendsData);

      // 과목 데이터 조회
      const coursesData = await api.fetchCourses();
      setAvailableCourses(coursesData);
    } catch (err) {
      console.error("데이터 로드 오류:", err);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 현재 활성화된 시간표 가져오기
  const activeTimetable = timetables.find(t => t.id === activeTimetableId) || timetables[0];

  // 요일별 수업 필터링
  const getClassesByDay = useCallback((day: string) => {
    // 요일이 일치하고 시간이 9시부터 17시 사이인 수업만 표시
    return activeTimetable?.classes?.filter(c =>
      c.day === day &&
      c.startHour >= 9 &&
      c.startHour < 18
    ) || [];
  }, [activeTimetable]);

  // 시간표 추가 함수
  const addTimetable = useCallback(async () => {
    if (!newTimetable.name || !newTimetable.semester) return;

    // 확인 모달 표시
    setConfirmMessage(`"${newTimetable.name}" 시간표를 추가하시겠습니까?`);
    setConfirmAction(() => async () => {
      try {
        setLoading(true);

        // API 호출하여 시간표 생성
        const newTimetableData = await api.createTimetable({
          name: newTimetable.name || "",
          semester: newTimetable.semester || ""
        });

        // 새 시간표를 목록에 추가
        setTimetables([...timetables, {
          ...newTimetableData,
          classes: []
        }]);

        // 새 시간표를 활성화
        setActiveTimetableId(newTimetableData.id);

        // 입력 필드 초기화
        setNewTimetable({ name: "", semester: "" });
        setShowAddModal(false);
      } catch (err) {
        console.error("시간표 생성 오류:", err);
        setError("시간표 생성 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  }, [newTimetable, timetables]);

  // 시간표 삭제 함수
  const deleteTimetable = useCallback(async (id: string | number) => {
    if (!id) return;

    if (timetables.length <= 1) {
      setError("마지막 시간표는 삭제할 수 없습니다.");
      return;
    }

    // 삭제할 시간표 정보 가져오기
    const timetableToDelete = timetables.find(t => t.id === id);
    if (!timetableToDelete) return;

    // 확인 모달 표시
    setConfirmMessage(`"${timetableToDelete.name}" 시간표를 삭제하시겠습니까?`);
    setConfirmAction(() => async () => {
      try {
        setLoading(true);

        // API 호출하여 시간표 삭제
        await api.deleteTimetable(id);

        // 시간표 목록에서 삭제된 시간표 제거
        const updatedTimetables = timetables.filter(t => t.id !== id);
        setTimetables(updatedTimetables);

        // 다른 시간표 활성화
        if (updatedTimetables.length > 0) {
          setActiveTimetableId(updatedTimetables[0].id);
        }
      } catch (err) {
        console.error("시간표 삭제 오류:", err);
        setError("시간표 삭제 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  }, [timetables]);

  // 수업 추가 함수
  const addClass = useCallback(async () => {
    if (!newClass.subject || !newClass.location || !newClass.day) return;

    try {
      setLoading(true);

      // 중복 체크
      const currentTimetable = timetables.find(t => t.id === activeTimetableId);
      if (currentTimetable) {
        const startHour = newClass.startHour || 9;
        const endHour = newClass.endHour || 10;
        const day = newClass.day || "월";

        const isDuplicate = currentTimetable.classes.some(c =>
          c.day === day &&
          ((c.startHour <= startHour && c.endHour > startHour) ||
           (c.startHour < endHour && c.endHour >= endHour) ||
           (c.startHour >= startHour && c.endHour <= endHour))
        );

        if (isDuplicate) {
          setError("해당 시간에 이미 등록된 수업이 있습니다.");
          setLoading(false);
          return;
        }
      }

      // API 호출하여 수업 추가
      const newClassData = await api.addClass({
        timetable_id: activeTimetableId,
        subject: newClass.subject || "",
        location: newClass.location || "",
        day: newClass.day || "월",
        start_hour: newClass.startHour || 9,
        end_hour: newClass.endHour || 10,
        color: newClass.color || "#FFD966"
      });

      // 새 수업을 시간표에 추가
      const updatedTimetables = timetables.map(t => {
        if (t.id === activeTimetableId) {
          return {
            ...t,
            classes: [...t.classes, {
              id: newClassData.id,
              subject: newClassData.subject,
              location: newClassData.location,
              startHour: newClass.startHour || 9,
              endHour: newClass.endHour || 10,
              day: newClass.day || "월",
              color: newClass.color || "#FFD966"
            }]
          };
        }
        return t;
      });

      setTimetables(updatedTimetables);

      // 입력 필드 초기화
      setNewClass({
        subject: "",
        location: "",
        startHour: 9,
        endHour: 10,
        day: "월",
        color: "#FFD966"
      });
      setShowClassModal(false);
    } catch (err) {
      console.error("수업 추가 오류:", err);
      setError("수업 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [newClass, activeTimetableId, timetables]);

  // 수업 삭제 함수
  const deleteClass = useCallback(async (id: string | number) => {
    if (!id) return;

    // 삭제할 수업 정보 가져오기
    const classToDelete = activeTimetable?.classes?.find(c => c.id === id);
    if (!classToDelete) return;

    // 확인 모달 표시
    setConfirmMessage(`"${classToDelete.subject}" 수업을 삭제하시겠습니까?`);
    setConfirmAction(() => async () => {
      try {
        setLoading(true);

        // API 호출하여 수업 삭제
        await api.deleteClass(id);

        // 시간표에서 삭제된 수업 제거
        const updatedTimetables = timetables.map(t => {
          if (t.id === activeTimetableId) {
            return {
              ...t,
              classes: t.classes.filter(c => c.id !== id)
            };
          }
          return t;
        });

        setTimetables(updatedTimetables);
      } catch (err) {
        console.error("수업 삭제 오류:", err);
        setError("수업 삭제 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  }, [activeTimetable, activeTimetableId, timetables]);

  return {
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
    activeFilterModal,
    newClass,
    newTimetable,
    timetables,
    friends,
    showFriends,
    availableCourses,
    selectedCourses,
    activeTimetable,

    // 상태 변경 함수
    setActiveTimetableId,
    setShowAddModal,
    setShowClassModal,
    setShowCourseSearchModal,
    setShowConfirmModal,
    setConfirmAction,
    setConfirmMessage,
    setError,
    setFilters,
    setActiveFilterModal,
    setNewClass,
    setNewTimetable,
    setShowFriends,
    setSelectedCourses,
    setTimetables,

    // 유틸리티 함수
    getClassesByDay,
    loadData,

    // 액션 함수
    addTimetable,
    deleteTimetable,
    addClass,
    deleteClass
  };
};
