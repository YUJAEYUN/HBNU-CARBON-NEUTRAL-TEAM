'use client';

import { ClassItem } from '../types';

interface TimetableGridProps {
  days: string[];
  timeSlots: number[];
  getClassesByDay: (day: string) => ClassItem[];
  deleteClass: (id: string | number) => void;
}

const TimetableGrid = ({ days, timeSlots, getClassesByDay, deleteClass }: TimetableGridProps) => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-6 h-full">
        {/* 시간 열 */}
        <div className="border-r border-gray-200">
          <div className="h-10 border-b border-gray-200"></div>
          {timeSlots.map((time) => (
            <div key={time} className="h-16 border-b border-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">{time}:00</span>
            </div>
          ))}
        </div>

        {/* 요일 열 */}
        {days.map((day) => (
          <div key={day} className="border-r border-gray-200">
            {/* 요일 헤더 */}
            <div className="h-10 border-b border-gray-200 flex items-center justify-center">
              <span className="font-medium">{day}</span>
            </div>

            {/* 시간 슬롯 */}
            <div className="relative">
              {timeSlots.map((time) => (
                <div key={time} className="h-16 border-b border-gray-200"></div>
              ))}

              {/* 수업 항목 */}
              {getClassesByDay(day).map((classItem) => {
                // 시간표 그리드 내에 표시될 수 있도록 위치 계산
                // 시간표 그리드 범위를 벗어나는 수업은 표시하지 않음
                if (classItem.startHour < 9 || classItem.startHour >= 18) {
                  return null;
                }

                // 9시를 기준으로 위치 계산 (9시가 맨 위에 오도록)
                const topPosition = (classItem.startHour - 9) * 64;

                return (
                  <div
                    key={classItem.id}
                    className="absolute left-0 right-0 overflow-hidden rounded-md p-1 text-xs group"
                    style={{
                      top: `${topPosition}px`,
                      height: `${Math.min((classItem.endHour - classItem.startHour) * 64, (9 * 64) - topPosition)}px`,
                      backgroundColor: classItem.color,
                      zIndex: 10
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{classItem.subject}</p>
                        <p className="text-xs">{classItem.location}</p>
                      </div>
                      <button
                        className="text-xs text-gray-700 bg-white bg-opacity-50 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteClass(classItem.id);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetableGrid;
