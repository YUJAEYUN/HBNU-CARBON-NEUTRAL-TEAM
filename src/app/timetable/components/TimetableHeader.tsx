'use client';

import { FaPlus, FaArrowLeft, FaSearch, FaBars } from 'react-icons/fa';
import { Timetable } from '../types';

interface TimetableHeaderProps {
  activeTimetable: Timetable | undefined;
  timetables: Timetable[];
  activeTimetableId: string | number;
  setActiveTimetableId: (id: string | number) => void;
  setShowAddModal: (show: boolean) => void;
  setShowClassModal: (show: boolean) => void;
  setShowCourseSearchModal: (show: boolean) => void;
  deleteTimetable: (id: string | number) => void;
  setError: (error: string | null) => void;
}

const TimetableHeader = ({
  activeTimetable,
  timetables,
  activeTimetableId,
  setActiveTimetableId,
  setShowAddModal,
  setShowClassModal,
  setShowCourseSearchModal,
  deleteTimetable,
  setError
}: TimetableHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      {/* 네비게이션 바 */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => window.history.back()}
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">시간표</h1>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => {
            if (!activeTimetable) {
              setError("시간표를 먼저 추가해주세요.");
              return;
            }
            setShowCourseSearchModal(true);
          }}
          title="과목 검색"
        >
          <FaSearch className="text-gray-600" />
        </button>
      </div>

      {/* 학기 및 시간표 이름 */}
      <div className="mt-2">
        {activeTimetable && (
          <>
            <p className="text-sm text-red-500">{activeTimetable.semester}</p>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">{activeTimetable.name}</h1>

              {/* 시간표 선택 드롭다운 */}
              <div className="relative group">
                <button className="text-gray-500 hover:text-gray-700">
                  <FaBars />
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 hidden group-hover:block">
                  <div className="py-1">
                    {timetables.map((timetable) => (
                      <div key={timetable.id} className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 group/item">
                        <button
                          className={`text-sm ${timetable.id === activeTimetableId ? 'font-bold text-primary' : 'text-gray-700'}`}
                          onClick={() => setActiveTimetableId(timetable.id)}
                        >
                          {timetable.name}
                        </button>

                        {timetables.length > 1 && (
                          <button
                            className="text-red-500 text-xs hover:text-red-700 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTimetable(timetable.id);
                            }}
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TimetableHeader;
