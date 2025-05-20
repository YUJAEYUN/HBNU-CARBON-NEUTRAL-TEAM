-- 학식 메뉴 테이블
CREATE TABLE IF NOT EXISTS hansik_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  day_of_week TEXT NOT NULL,
  lunch TEXT,
  dinner TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 날짜와 요일에 대한 유니크 인덱스 생성
CREATE UNIQUE INDEX IF NOT EXISTS hansik_menus_date_idx ON hansik_menus (date);

-- 즐겨찾기 테이블 (이미 존재하는 경우 생략)
CREATE TABLE IF NOT EXISTS hansik_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_name TEXT NOT NULL,
  menu_name TEXT NOT NULL,
  menu_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, restaurant_name, menu_name)
);
