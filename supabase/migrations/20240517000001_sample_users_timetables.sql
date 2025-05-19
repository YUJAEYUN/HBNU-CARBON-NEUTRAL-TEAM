-- 샘플 사용자 추가
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'kim@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'lee@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'park@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 'choi@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000005', 'jung@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 샘플 프로필 추가
INSERT INTO public.profiles (id, email, nickname, school, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'kim@example.com', '김탄소', '한밭대학교', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'lee@example.com', '이환경', '한밭대학교', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'park@example.com', '박지구', '한밭대학교', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 'choi@example.com', '최에코', '한밭대학교', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000005', 'jung@example.com', '정그린', '한밭대학교', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 테스트 사용자의 프로필이 없는 경우 추가
INSERT INTO public.profiles (id, email, nickname, school, created_at, updated_at)
VALUES
  ('c2bd2539-0a83-4536-8022-9eb3487e7d65', 'test@example.com', '테스트사용자', '한밭대학교', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 샘플 시간표 추가
INSERT INTO public.timetables (id, user_id, name, semester, is_active, created_at, updated_at)
VALUES
  (1, '00000000-0000-0000-0000-000000000001', '2025-1 시간표', '2025년 1학기', true, NOW(), NOW()),
  (2, '00000000-0000-0000-0000-000000000002', '환경공학 시간표', '2025년 1학기', true, NOW(), NOW()),
  (3, '00000000-0000-0000-0000-000000000003', '컴퓨터공학 시간표', '2025년 1학기', true, NOW(), NOW()),
  (4, '00000000-0000-0000-0000-000000000004', '경영학 시간표', '2025년 1학기', true, NOW(), NOW()),
  (5, '00000000-0000-0000-0000-000000000005', '디자인 시간표', '2025년 1학기', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 테스트 사용자의 시간표 추가
INSERT INTO public.timetables (id, user_id, name, semester, is_active, created_at, updated_at)
VALUES
  (100, 'c2bd2539-0a83-4536-8022-9eb3487e7d65', '내 시간표', '2025년 1학기', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 샘플 수업 추가 (김탄소의 시간표)
INSERT INTO public.timetable_classes (timetable_id, subject, location, day, start_hour, end_hour, color, created_at, updated_at)
VALUES
  (1, '영화의이해', '교111', '목', 9, 10, '#FFD966', NOW(), NOW()),
  (1, '한문강독', '교111', '화', 10, 11, '#FFD966', NOW(), NOW()),
  (1, '한국문화유산의이해', '교404', '금', 10, 12, '#9FC5E8', NOW(), NOW()),
  (1, '한국문화유산의이해', '교404', '수', 11, 12, '#9FC5E8', NOW(), NOW()),
  (1, '미시경제원론', '상부110', '월', 11, 13, '#F4CCCC', NOW(), NOW()),
  (1, '미시경제원론', '상부110', '수', 12, 13, '#F4CCCC', NOW(), NOW()),
  (1, '공학기초설계', '정D114', '목', 11, 14, '#F9CB9C', NOW(), NOW()),
  (1, '사진예술의이해', '교101', '월', 13, 15, '#B6D7A8', NOW(), NOW()),
  (1, '동아시아신화기행', '교303', '수', 13, 15, '#D5A6BD', NOW(), NOW()),
  (1, '동아시아신화기행', '교303', '금', 13, 15, '#D5A6BD', NOW(), NOW());

-- 샘플 수업 추가 (이환경의 시간표)
INSERT INTO public.timetable_classes (timetable_id, subject, location, day, start_hour, end_hour, color, created_at, updated_at)
VALUES
  (2, '환경공학개론', '공학관301', '월', 9, 11, '#9FC5E8', NOW(), NOW()),
  (2, '수질관리', '공학관302', '화', 11, 13, '#FFD966', NOW(), NOW()),
  (2, '대기오염제어', '공학관303', '수', 9, 11, '#F4CCCC', NOW(), NOW()),
  (2, '폐기물처리', '공학관304', '목', 13, 15, '#B6D7A8', NOW(), NOW()),
  (2, '환경영향평가', '공학관305', '금', 11, 13, '#D5A6BD', NOW(), NOW());

-- 샘플 수업 추가 (박지구의 시간표)
INSERT INTO public.timetable_classes (timetable_id, subject, location, day, start_hour, end_hour, color, created_at, updated_at)
VALUES
  (3, '자료구조', '정보관201', '월', 9, 11, '#9FC5E8', NOW(), NOW()),
  (3, '알고리즘', '정보관202', '화', 11, 13, '#FFD966', NOW(), NOW()),
  (3, '데이터베이스', '정보관203', '수', 9, 11, '#F4CCCC', NOW(), NOW()),
  (3, '운영체제', '정보관204', '목', 13, 15, '#B6D7A8', NOW(), NOW()),
  (3, '컴퓨터네트워크', '정보관205', '금', 11, 13, '#D5A6BD', NOW(), NOW());

-- 샘플 수업 추가 (최에코의 시간표)
INSERT INTO public.timetable_classes (timetable_id, subject, location, day, start_hour, end_hour, color, created_at, updated_at)
VALUES
  (4, '경영학원론', '경영관101', '월', 9, 11, '#9FC5E8', NOW(), NOW()),
  (4, '회계원리', '경영관102', '화', 11, 13, '#FFD966', NOW(), NOW()),
  (4, '마케팅원론', '경영관103', '수', 9, 11, '#F4CCCC', NOW(), NOW()),
  (4, '재무관리', '경영관104', '목', 13, 15, '#B6D7A8', NOW(), NOW()),
  (4, '인사관리', '경영관105', '금', 11, 13, '#D5A6BD', NOW(), NOW());

-- 샘플 수업 추가 (정그린의 시간표)
INSERT INTO public.timetable_classes (timetable_id, subject, location, day, start_hour, end_hour, color, created_at, updated_at)
VALUES
  (5, '디자인개론', '디자인관101', '월', 9, 11, '#9FC5E8', NOW(), NOW()),
  (5, '색채학', '디자인관102', '화', 11, 13, '#FFD966', NOW(), NOW()),
  (5, '타이포그래피', '디자인관103', '수', 9, 11, '#F4CCCC', NOW(), NOW()),
  (5, 'UI/UX디자인', '디자인관104', '목', 13, 15, '#B6D7A8', NOW(), NOW()),
  (5, '디자인프로젝트', '디자인관105', '금', 11, 13, '#D5A6BD', NOW(), NOW());

-- 테스트 사용자의 시간표에 수업 추가
INSERT INTO public.timetable_classes (timetable_id, subject, location, day, start_hour, end_hour, color, created_at, updated_at)
VALUES
  (100, '프로그래밍기초', '공학관201', '월', 9, 11, '#9FC5E8', NOW(), NOW()),
  (100, '웹개발실습', '공학관202', '화', 13, 15, '#FFD966', NOW(), NOW()),
  (100, '데이터분석', '공학관203', '수', 10, 12, '#F4CCCC', NOW(), NOW()),
  (100, '인공지능개론', '공학관204', '목', 14, 16, '#B6D7A8', NOW(), NOW()),
  (100, '캡스톤디자인', '공학관205', '금', 9, 12, '#D5A6BD', NOW(), NOW());
