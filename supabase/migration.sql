-- 사용자 테이블 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    school TEXT NOT NULL,
    trees INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    points INTEGER DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 활동 유형 테이블
CREATE TABLE IF NOT EXISTS public.activity_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    carbon_reduction DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 활동 기록 테이블
CREATE TABLE IF NOT EXISTS public.user_activities (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type_id INTEGER REFERENCES public.activity_types(id),
    carbon_reduction DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 캐릭터 성장 단계 테이블
CREATE TABLE IF NOT EXISTS public.character_stages (
    id SERIAL PRIMARY KEY,
    level INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    required_points INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 커뮤니티 게시글 테이블
CREATE TABLE IF NOT EXISTS public.posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    post_type TEXT NOT NULL,
    is_event BOOLEAN DEFAULT FALSE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 게시글 이미지 테이블
CREATE TABLE IF NOT EXISTS public.post_images (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES public.posts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 게시글 댓글 테이블
CREATE TABLE IF NOT EXISTS public.comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 좋아요 테이블 (게시글)
CREATE TABLE IF NOT EXISTS public.post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- 좋아요 테이블 (댓글)
CREATE TABLE IF NOT EXISTS public.comment_likes (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- 중고마켓 상품 테이블
CREATE TABLE IF NOT EXISTS public.marketplace_products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    carbon_saved DECIMAL(10, 2) DEFAULT 0,
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 상품 이미지 테이블
CREATE TABLE IF NOT EXISTS public.product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 카풀 테이블
CREATE TABLE IF NOT EXISTS public.carpools (
    id SERIAL PRIMARY KEY,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT '대기중',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(carpool_id, user_id)
);

-- 시간표 테이블
CREATE TABLE IF NOT EXISTS public.timetables (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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
    color TEXT DEFAULT '#FFD966',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 채팅 메시지 테이블
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 봉사활동 테이블
CREATE TABLE IF NOT EXISTS public.volunteer_activities (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    location TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    recruitment_period TEXT NOT NULL,
    participants TEXT,
    category TEXT NOT NULL,
    carbon_reduction DECIMAL(10, 2) DEFAULT 0,
    description TEXT NOT NULL,
    image_url TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 대외활동 테이블
CREATE TABLE IF NOT EXISTS public.external_activities (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    field TEXT NOT NULL,
    target TEXT NOT NULL,
    period TEXT NOT NULL,
    application_period TEXT NOT NULL,
    carbon_reduction DECIMAL(10, 2) DEFAULT 0,
    description TEXT NOT NULL,
    image_url TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 대외활동 혜택 테이블
CREATE TABLE IF NOT EXISTS public.external_activity_benefits (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER REFERENCES public.external_activities(id) ON DELETE CASCADE,
    benefit TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터 추가
-- 활동 유형 데이터 추가
INSERT INTO public.activity_types (name, description, carbon_reduction)
VALUES
    ('도보 이용', '자동차 대신 걸어서 이동', 0.5),
    ('텀블러 사용', '일회용 컵 대신 텀블러 사용', 0.3),
    ('전자영수증', '종이 영수증 대신 전자영수증 사용', 0.1),
    ('다회용기', '일회용 용기 대신 다회용기 사용', 0.4),
    ('대중교통', '자가용 대신 대중교통 이용', 0.8),
    ('계단 이용', '엘리베이터 대신 계단 이용', 0.2),
    ('분리수거', '올바른 분리수거 실천', 0.3),
    ('전기절약', '불필요한 전기 사용 줄이기', 0.5);

-- 캐릭터 성장 단계 데이터 추가
INSERT INTO public.character_stages (level, name, description, required_points, image_url)
VALUES
    (1, '새싹', '탄소중립 여정의 시작', 0, '🌱'),
    (2, '어린 대나무', '성장 중인 대나무', 50, '🎋'),
    (3, '튼튼한 대나무', '건강하게 자란 대나무', 150, '🌿'),
    (4, '대나무 숲', '주변에 영향을 주는 대나무', 300, '🌲'),
    (5, '대나무 마스터', '탄소중립의 상징', 500, '🌳');

-- 봉사활동 데이터 추가
INSERT INTO public.volunteer_activities (
    title, organization, location, start_date, end_date,
    recruitment_period, participants, category, carbon_reduction,
    description, image_url, link
)
VALUES
    (
        '탄소중립 환경정화 봉사활동',
        '한밭대학교 환경동아리',
        '대전 유성구',
        '2023-06-10',
        '2023-06-10',
        '2023-05-15 ~ 2023-06-05',
        '20명',
        '환경보호',
        5.2,
        '대전 유성구 일대 하천 및 공원 환경정화 활동을 통해 지역사회 환경 개선에 기여합니다. 참가자들은 쓰레기 수거 및 분리수거 활동을 진행하며, 활동 후 환경보호 교육도 함께 진행됩니다.',
        '/volunteer/cleanup.jpg',
        'https://www.1365.go.kr'
    ),
    (
        '탄소발자국 줄이기 캠페인',
        '대전시 환경운동연합',
        '대전시 전역',
        '2023-06-15',
        '2023-06-30',
        '2023-05-20 ~ 2023-06-10',
        '30명',
        '탄소중립',
        8.7,
        '일상 속에서 탄소발자국을 줄이는 방법을 시민들에게 알리는 캠페인 활동입니다. 참가자들은 거리 캠페인, SNS 홍보, 교육 자료 배포 등의 활동을 진행합니다.',
        '/volunteer/campaign.jpg',
        'https://www.1365.go.kr'
    );

-- 대외활동 데이터 추가
INSERT INTO public.external_activities (
    title, organization, field, target, period,
    application_period, carbon_reduction, description,
    image_url, link
)
VALUES
    (
        '2023 탄소중립 아이디어 공모전',
        '환경부',
        '공모전',
        '대학생 및 대학원생',
        '2023-07-01 ~ 2023-08-31',
        '2023-06-01 ~ 2023-06-30',
        15.2,
        '일상 속에서 탄소 배출을 줄이는 창의적인 아이디어를 발굴하는 공모전입니다. 개인 또는 팀으로 참가 가능하며, 우수 아이디어는 실제 정책에 반영될 수 있습니다.',
        '/external/contest.jpg',
        'https://www.wevity.com'
    ),
    (
        '친환경 브랜드 마케팅 공모전',
        '대한상공회의소',
        '마케팅',
        '대학생 및 일반인',
        '2023-08-10 ~ 2023-09-10',
        '2023-06-25 ~ 2023-07-25',
        7.3,
        '친환경 제품 및 서비스의 마케팅 전략을 기획하는 공모전입니다. 브랜딩, 광고, SNS 마케팅 등 다양한 분야에서 창의적인 아이디어를 제안할 수 있습니다.',
        '/external/marketing.jpg',
        'https://www.wevity.com'
    );

-- 대외활동 혜택 데이터 추가
INSERT INTO public.external_activity_benefits (activity_id, benefit)
VALUES
    (1, '상금 최대 500만원'),
    (1, '환경부 장관상'),
    (1, '인턴십 기회'),
    (2, '상금 최대 300만원'),
    (2, '기업 인턴십 기회'),
    (2, '수상 경력');
