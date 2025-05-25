import { Timetable, ClassItem, Course, Friend } from '../types';

// 시간표 목록 조회
export const fetchTimetables = async (): Promise<Timetable[]> => {
  try {
    const response = await fetch('/api/timetable');
    const responseData = await response.json();

    if (responseData.success && responseData.data) {
      return responseData.data;
    }

    throw new Error("시간표를 불러오는데 실패했습니다.");
  } catch (err) {
    console.error("시간표 목록 조회 오류:", err);
    throw err;
  }
};

// 시간표 수업 목록 조회
export const fetchClasses = async (timetableId: string | number): Promise<ClassItem[]> => {
  try {
    const response = await fetch(`/api/timetable/classes?timetable_id=${timetableId}`);
    const responseData = await response.json();

    if (responseData.success && responseData.data) {
      // 필드 이름 변환 (start_hour -> startHour, end_hour -> endHour)
      const formattedClasses = responseData.data.map((cls: any) => ({
        id: cls.id,
        subject: cls.subject,
        location: cls.location,
        startHour: cls.start_hour,
        endHour: cls.end_hour,
        day: cls.day,
        color: cls.color
      }));
      return formattedClasses;
    }

    throw new Error("수업 목록을 불러오는데 실패했습니다.");
  } catch (err) {
    console.error("수업 목록 조회 오류:", err);
    throw err;
  }
};

// 친구 목록 조회
export const fetchFriends = async (): Promise<Friend[]> => {
  try {
    const response = await fetch('/api/timetable/friends');
    const responseData = await response.json();

    if (responseData.success && responseData.data) {
      return responseData.data;
    }

    throw new Error("친구 목록을 불러오는데 실패했습니다.");
  } catch (err) {
    console.error("친구 목록 조회 오류:", err);
    throw err;
  }
};

// 과목 목록 조회
export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const response = await fetch('/api/timetable/courses');
    const responseData = await response.json();

    if (responseData.success && responseData.data) {
      return responseData.data;
    }

    throw new Error("과목 목록을 불러오는데 실패했습니다.");
  } catch (err) {
    console.error("과목 목록 조회 오류:", err);
    throw err;
  }
};

// 시간표 생성
export const createTimetable = async (data: { name: string; semester: string }): Promise<Timetable> => {
  try {
    const response = await fetch('/api/timetable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success && responseData.data) {
      return responseData.data;
    }

    throw new Error("시간표 생성에 실패했습니다.");
  } catch (err) {
    console.error("시간표 생성 오류:", err);
    throw err;
  }
};

// 시간표 삭제
export const deleteTimetable = async (id: string | number): Promise<void> => {
  try {
    const response = await fetch(`/api/timetable?id=${id}`, {
      method: 'DELETE',
    });

    const responseData = await response.json();

    if (!responseData.success) {
      throw new Error("시간표 삭제에 실패했습니다.");
    }
  } catch (err) {
    console.error("시간표 삭제 오류:", err);
    throw err;
  }
};

// 수업 추가
export const addClass = async (data: {
  timetable_id: string | number;
  subject: string;
  location: string;
  day: string;
  start_hour: number;
  end_hour: number;
  color: string;
}): Promise<ClassItem> => {
  try {
    const response = await fetch('/api/timetable/classes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success && responseData.data) {
      // 필드 이름 변환 (start_hour -> startHour, end_hour -> endHour)
      const formattedClass = {
        id: responseData.data.id,
        subject: responseData.data.subject,
        location: responseData.data.location,
        startHour: responseData.data.start_hour,
        endHour: responseData.data.end_hour,
        day: responseData.data.day,
        color: responseData.data.color
      };
      return formattedClass;
    }

    throw new Error("수업 추가에 실패했습니다.");
  } catch (err) {
    console.error("수업 추가 오류:", err);
    throw err;
  }
};

// 수업 삭제
export const deleteClass = async (id: string | number): Promise<void> => {
  try {
    const response = await fetch(`/api/timetable/classes?id=${id}`, {
      method: 'DELETE',
    });

    const responseData = await response.json();

    if (!responseData.success) {
      throw new Error("수업 삭제에 실패했습니다.");
    }
  } catch (err) {
    console.error("수업 삭제 오류:", err);
    throw err;
  }
};
