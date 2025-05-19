-- 사용자 테이블 (auth.users와 연결된 프로필)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    school TEXT NOT NULL,
    trees INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 임의의 사용자 생성 (auth.users 테이블에 직접 삽입)
-- 참고: 실제 환경에서는 auth.users 테이블에 직접 삽입하는 것은 권장되지 않지만,
-- 샘플 데이터 생성을 위해 사용합니다.
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'kim@example.com',
     '{"nickname": "김환경", "school": "한밭대학교", "trees": 5, "level": 2}',
     NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', 'lee@example.com',
     '{"nickname": "이탄소", "school": "한밭대학교", "trees": 3, "level": 1}',
     NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333333', 'park@example.com',
     '{"nickname": "박중립", "school": "한밭대학교", "trees": 8, "level": 3}',
     NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444444', 'choi@example.com',
     '{"nickname": "최에코", "school": "한밭대학교", "trees": 2, "level": 1}',
     NOW(), NOW());

-- 프로필 테이블에 사용자 정보 추가
INSERT INTO public.profiles (id, email, nickname, school, trees, level)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'kim@example.com', '김환경', '한밭대학교', 5, 2),
    ('22222222-2222-2222-2222-222222222222', 'lee@example.com', '이탄소', '한밭대학교', 3, 1),
    ('33333333-3333-3333-3333-333333333333', 'park@example.com', '박중립', '한밭대학교', 8, 3),
    ('44444444-4444-4444-4444-444444444444', 'choi@example.com', '최에코', '한밭대학교', 2, 1);

-- 시간표 테이블
CREATE TABLE IF NOT EXISTS public.timetables (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    semester TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 시간표 수업 테이블
CREATE TABLE IF NOT EXISTS public.timetable_classes (
    id SERIAL PRIMARY KEY,
    timetable_id INTEGER REFERENCES public.timetables(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    location TEXT,
    day TEXT NOT NULL,
    start_hour INTEGER NOT NULL,
    end_hour INTEGER NOT NULL,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 중고장터 상품 테이블
CREATE TABLE IF NOT EXISTS public.marketplace_products (
    id SERIAL PRIMARY KEY,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price INTEGER NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    image_url TEXT,
    carbon_saved DECIMAL(10, 2) DEFAULT 0,
    status TEXT DEFAULT '판매중',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 카풀 테이블
CREATE TABLE IF NOT EXISTS public.carpools (
    id SERIAL PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    departure TEXT NOT NULL,
    destination TEXT NOT NULL,
    carpool_date DATE NOT NULL,
    carpool_time TIME NOT NULL,
    max_participants INTEGER NOT NULL,
    vehicle_type TEXT NOT NULL,
    trip_type TEXT NOT NULL,
    estimated_cost TEXT,
    co2_reduction DECIMAL(10, 2) DEFAULT 0,
    carpool_type TEXT DEFAULT '일반',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 카풀 참가자 테이블
CREATE TABLE IF NOT EXISTS public.carpool_participants (
    id SERIAL PRIMARY KEY,
    carpool_id INTEGER REFERENCES public.carpools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT '대기중',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(carpool_id, user_id)
);

-- 샘플 데이터 추가: 시간표 (ID 값을 명시적으로 지정)
INSERT INTO public.timetables (id, user_id, name, semester, is_active)
VALUES
    (1, '11111111-1111-1111-1111-111111111111', '환경 지키미', '2025년 1학기', TRUE),
    (2, '22222222-2222-2222-2222-222222222222', '탄소중립 시간표', '2025년 1학기', TRUE),
    (3, '33333333-3333-3333-3333-333333333333', '에코 라이프', '2025년 1학기', TRUE);

-- 시퀀스 값 업데이트 (다음 INSERT가 4부터 시작하도록)
SELECT setval('public.timetables_id_seq', 3, true);

-- 샘플 데이터 추가: 시간표 수업
INSERT INTO public.timetable_classes (timetable_id, subject, location, day, start_hour, end_hour, color)
VALUES
    (1, '영화의이해', '교111', '목', 9, 10, '#FFD966'),
    (1, '한문강독', '교111', '화', 10, 11, '#FFD966'),
    (1, '한국문화유산의이해', '교404', '금', 10, 12, '#9FC5E8'),
    (1, '한국문화유산의이해', '교404', '수', 11, 12, '#9FC5E8'),
    (1, '미시경제원론', '상부110', '월', 11, 13, '#F4CCCC'),
    (2, '환경공학개론', '공학관201', '월', 9, 11, '#A2C4C9'),
    (2, '지속가능발전론', '인문관305', '수', 13, 15, '#D5A6BD'),
    (2, '에너지정책론', '사회관102', '금', 15, 17, '#B6D7A8'),
    (3, '기후변화와 사회', '사회관301', '화', 9, 11, '#9FC5E8'),
    (3, '친환경 디자인', '예술관202', '목', 13, 15, '#D5A6BD');

-- 샘플 데이터 추가: 중고장터 상품 (ID 값을 명시적으로 지정)
INSERT INTO public.marketplace_products (id, seller_id, title, price, description, category, condition, carbon_saved, status)
VALUES
    (1, '11111111-1111-1111-1111-111111111111', '거의 새 책 - 환경경제학 개론', 15000, '한 학기 동안만 사용한 환경경제학 교재입니다. 필기나 접힘 없이 깨끗합니다.', '책', '거의새것', 1.8, '판매중'),
    (2, '22222222-2222-2222-2222-222222222222', '텀블러 (보온/보냉)', 8000, '스타벅스 텀블러 판매합니다. 6개월 사용했고 상태 좋습니다. 일회용컵 대신 사용해보세요!', '생활용품', '중고', 2.5, '판매중'),
    (3, '33333333-3333-3333-3333-333333333333', '자전거 - 친환경 교통수단', 120000, '2년 사용한 자전거입니다. 최근에 체인과 타이어를 교체했고 상태가 좋습니다. 통학용으로 적합합니다.', '스포츠/레저', '중고', 12.0, '판매중'),
    (4, '11111111-1111-1111-1111-111111111111', '에코백 3종 세트', 10000, '에코백 3개 세트로 판매합니다. 각각 다른 디자인이고 튼튼합니다. 비닐봉지 대신 사용하세요!', '의류', '거의새것', 3.5, '판매중'),
    (5, '44444444-4444-4444-4444-444444444444', '태양광 충전기', 25000, '캠핑이나 야외활동 시 유용한 태양광 충전기입니다. 스마트폰 2-3회 완충 가능합니다.', '가전', '중고', 8.5, '판매중'),
    (6, '22222222-2222-2222-2222-222222222222', '친환경 노트북 파우치', 12000, '재활용 소재로 만든 노트북 파우치입니다. 13인치 노트북까지 수납 가능합니다.', '생활용품', '새상품', 2.0, '판매중'),
    (7, '33333333-3333-3333-3333-333333333333', '전공서적 - 환경과학개론', 20000, '환경과학개론 교재입니다. 형광펜 필기가 일부 있지만 상태 양호합니다.', '책', '중고', 1.5, '판매중');

-- 시퀀스 값 업데이트 (다음 INSERT가 8부터 시작하도록)
SELECT setval('public.marketplace_products_id_seq', 7, true);

-- 샘플 데이터 추가: 카풀 (ID 값을 명시적으로 지정)
INSERT INTO public.carpools (id, creator_id, departure, destination, carpool_date, carpool_time, max_participants, vehicle_type, trip_type, estimated_cost, co2_reduction, carpool_type, status)
VALUES
    (1, '11111111-1111-1111-1111-111111111111', '한밭대학교 정문', '둔산동 시청', '2025-05-17', '15:30:00', 4, '택시', '편도', '5000', 1.2, '일반', 'active'),
    (2, '22222222-2222-2222-2222-222222222222', '한밭대학교 후문', '대전역', '2025-05-18', '10:00:00', 4, '택시', '편도', '7000', 0.8, '일반', 'active'),
    (3, '33333333-3333-3333-3333-333333333333', '한밭대학교 정문', '유성구 예비군훈련장', '2025-05-20', '08:00:00', 4, '택시', '왕복', '10000', 1.5, '예비군', 'active'),
    (4, '44444444-4444-4444-4444-444444444444', '대전역', '한밭대학교 정문', '2025-05-19', '18:00:00', 4, '택시', '편도', '7000', 0.8, '일반', 'active'),
    (5, '11111111-1111-1111-1111-111111111111', '한밭대학교 정문', '대덕구청', '2025-05-21', '14:00:00', 3, '자가용', '편도', '4000', 1.0, '일반', 'active'),
    (6, '33333333-3333-3333-3333-333333333333', '한밭대학교 후문', '대전시청', '2025-05-22', '09:00:00', 4, '택시', '편도', '8000', 1.2, '일반', 'active');

-- 시퀀스 값 업데이트 (다음 INSERT가 7부터 시작하도록)
SELECT setval('public.carpools_id_seq', 6, true);

-- 샘플 데이터 추가: 카풀 참가자 (ID 값을 명시적으로 지정)
INSERT INTO public.carpool_participants (id, carpool_id, user_id, status)
VALUES
    (1, 1, '11111111-1111-1111-1111-111111111111', '확정'),
    (2, 1, '22222222-2222-2222-2222-222222222222', '확정'),
    (3, 1, '33333333-3333-3333-3333-333333333333', '대기중'),
    (4, 2, '22222222-2222-2222-2222-222222222222', '확정'),
    (5, 2, '44444444-4444-4444-4444-444444444444', '확정'),
    (6, 3, '33333333-3333-3333-3333-333333333333', '확정'),
    (7, 3, '11111111-1111-1111-1111-111111111111', '확정'),
    (8, 4, '44444444-4444-4444-4444-444444444444', '확정'),
    (9, 5, '11111111-1111-1111-1111-111111111111', '확정'),
    (10, 5, '22222222-2222-2222-2222-222222222222', '대기중'),
    (11, 6, '33333333-3333-3333-3333-333333333333', '확정');

-- 시퀀스 값 업데이트 (다음 INSERT가 12부터 시작하도록)
SELECT setval('public.carpool_participants_id_seq', 11, true);

-- 학식 즐겨찾기 테이블
CREATE TABLE IF NOT EXISTS public.hansik_favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_name TEXT NOT NULL,
    menu_name TEXT NOT NULL,
    menu_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 샘플 데이터 추가: 학식 즐겨찾기 (ID 값을 명시적으로 지정)
INSERT INTO public.hansik_favorites (id, user_id, restaurant_name, menu_name, menu_type)
VALUES
    (1, '11111111-1111-1111-1111-111111111111', '학생식당', '제육볶음', '중식'),
    (2, '11111111-1111-1111-1111-111111111111', '학생식당', '돈까스', '중식'),
    (3, '22222222-2222-2222-2222-222222222222', '교직원식당', '비빔밥', '중식'),
    (4, '33333333-3333-3333-3333-333333333333', '학생식당', '김치찌개', '중식'),
    (5, '44444444-4444-4444-4444-444444444444', '교직원식당', '된장찌개', '중식'),
    (6, '22222222-2222-2222-2222-222222222222', '학생식당', '치킨까스', '중식'),
    (7, '33333333-3333-3333-3333-333333333333', '교직원식당', '불고기', '중식');

-- 시퀀스 값 업데이트 (다음 INSERT가 8부터 시작하도록)
SELECT setval('public.hansik_favorites_id_seq', 7, true);

-- 참고: 위에서 생성한 임의의 사용자 ID를 사용했습니다.
-- 실제 배포 시에는 아래와 같이 현재 로그인한 사용자의 ID를 사용할 수 있습니다:
-- auth.uid()
--
-- 임의 생성된 사용자 정보:
-- 1. 김환경 (kim@example.com) - ID: 11111111-1111-1111-1111-111111111111
-- 2. 이탄소 (lee@example.com) - ID: 22222222-2222-2222-2222-222222222222
-- 3. 박중립 (park@example.com) - ID: 33333333-3333-3333-3333-333333333333
-- 4. 최에코 (choi@example.com) - ID: 44444444-4444-4444-4444-444444444444
