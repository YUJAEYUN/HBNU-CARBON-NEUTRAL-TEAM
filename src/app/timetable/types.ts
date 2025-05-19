// 시간표 타입 정의
export interface ClassItem {
  id: string | number;
  subject: string;
  location: string;
  startHour: number;
  endHour: number;
  day: string;
  color: string;
}

// 과목 타입 정의
export interface Course {
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

export interface Timetable {
  id: string | number;
  name: string;
  semester: string;
  is_active?: boolean;
  classes: ClassItem[];
  courses?: Course[];
}

export interface Friend {
  id: string;
  nickname: string;
  school: string;
  timetable: {
    id: number;
    name: string;
    semester: string;
    is_active: boolean;
  } | null;
}

export interface FilterState {
  department: string;
  search: string;
  sort: string;
  time: string;
  grade: string;
  category: string;
  credit: string;
}
