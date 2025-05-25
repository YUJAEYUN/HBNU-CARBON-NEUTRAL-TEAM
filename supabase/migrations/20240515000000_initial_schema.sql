-- 사용자 테이블 (Supabase Auth와 연동)
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

-- RLS 정책은 필요에 따라 나중에 추가할 수 있습니다.
-- 현재는 모든 테이블에 대한 접근을 허용합니다.
