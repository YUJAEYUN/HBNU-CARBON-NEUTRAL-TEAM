# Supabase 데이터베이스 설정

이 디렉토리에는 C-Nergy 애플리케이션의 Supabase 데이터베이스 설정 파일이 포함되어 있습니다.

## 구조

- `migration.sql`: 전체 데이터베이스 스키마와 초기 데이터가 포함된 SQL 파일
- `config.toml`: Supabase 프로젝트 설정 파일

## 설정 방법

### 1. Supabase 프로젝트 생성

[Supabase 대시보드](https://app.supabase.io)에서 새 프로젝트를 생성합니다.

### 2. 데이터베이스 스키마 적용

1. Supabase 대시보드에서 SQL 에디터로 이동합니다.
2. `migration.sql` 파일의 내용을 복사하여 SQL 에디터에 붙여넣습니다.
3. 쿼리를 실행하여 데이터베이스 스키마와 초기 데이터를 적용합니다.

### 3. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가합니다:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

`<your-supabase-url>`과 `<your-anon-key>`는 Supabase 프로젝트 설정에서 확인할 수 있습니다.

### 4. 로컬 개발 환경 설정 (선택 사항)

로컬에서 Supabase를 실행하려면 다음 단계를 따릅니다:

```bash
# Supabase CLI 설치
npm install -g supabase

# 또는 Homebrew를 사용하는 경우 (macOS)
brew install supabase/tap/supabase

# Supabase 로컬 개발 환경 시작
supabase start

# 환경 변수 설정
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
```

`<your-local-anon-key>`는 `supabase start` 명령 실행 후 출력되는 값으로 대체합니다.

## 데이터베이스 스키마

### 주요 테이블

1. **profiles**: 사용자 프로필 정보
2. **activity_types**: 활동 유형 정보
3. **user_activities**: 사용자 활동 기록
4. **character_stages**: 캐릭터 성장 단계
5. **posts**: 커뮤니티 게시글
6. **comments**: 게시글 댓글
7. **marketplace_products**: 중고마켓 상품
8. **carpools**: 카풀 정보
9. **timetables**: 시간표 정보
10. **volunteer_activities**: 봉사활동 정보
11. **external_activities**: 대외활동 정보

### 관계 다이어그램

```
profiles
  ↑
  | (1:N)
  ↓
user_activities → activity_types

profiles
  ↑
  | (1:N)
  ↓
posts → comments

profiles
  ↑
  | (1:N)
  ↓
marketplace_products

profiles
  ↑
  | (1:N)
  ↓
carpools → carpool_participants

profiles
  ↑
  | (1:N)
  ↓
timetables → timetable_classes
```

### 초기 데이터

migration.sql 파일에는 다음과 같은 초기 데이터가 포함되어 있습니다:

1. **활동 유형**: 도보 이용, 텀블러 사용, 전자영수증 등 8가지 활동 유형
2. **캐릭터 성장 단계**: 새싹(1레벨)부터 대나무 마스터(5레벨)까지의 성장 단계
3. **봉사활동**: 환경정화 봉사활동, 탄소발자국 줄이기 캠페인 등 샘플 데이터
4. **대외활동**: 탄소중립 아이디어 공모전, 친환경 브랜드 마케팅 공모전 등 샘플 데이터

### 행 수준 보안 (RLS)

Supabase에서는 필요에 따라 행 수준 보안(RLS) 정책을 추가할 수 있습니다. 다음은 권장되는 RLS 정책입니다:

- 프로필은 본인만 수정 가능하지만 모두 조회 가능
- 활동은 본인만 추가/수정 가능
- 게시글과 댓글은 모두 볼 수 있지만 본인만 수정 가능
- 상품은 모두 볼 수 있지만 본인만 수정 가능
- 카풀은 모두 볼 수 있지만 본인만 수정 가능
- 시간표는 본인만 볼 수 있고 수정 가능
- 채팅 메시지는 본인만 볼 수 있고 수정 가능
