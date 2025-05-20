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
