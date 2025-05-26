# 구글 OAuth 2.0 설정 가이드

이 가이드는 C-Nergy 애플리케이션에 구글 OAuth 2.0 로그인을 설정하는 방법을 설명합니다.

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성 또는 선택
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트를 생성하거나 기존 프로젝트 선택

### 1.2 OAuth 2.0 클라이언트 ID 생성
1. **API 및 서비스** > **사용자 인증 정보**로 이동
2. **+ 사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 선택
3. 애플리케이션 유형: **웹 애플리케이션** 선택
4. 이름: `C-Nergy Web Client` (또는 원하는 이름)
5. **승인된 자바스크립트 원본** 추가:
   - `http://localhost:3000` (개발용)
   - `https://your-domain.com` (프로덕션용)
6. **승인된 리디렉션 URI** 추가:
   - `http://localhost:3000/auth/login` (개발용)
   - `https://your-domain.com/auth/login` (프로덕션용)
7. **만들기** 클릭

### 1.3 클라이언트 ID 및 시크릿 복사
- 생성된 **클라이언트 ID**와 **클라이언트 보안 비밀번호**를 복사해 둡니다.

## 2. Supabase 설정

### 2.1 Google OAuth 프로바이더 활성화
1. [Supabase 대시보드](https://app.supabase.io/)에서 프로젝트 선택
2. **Authentication** > **Providers**로 이동
3. **Google** 프로바이더 선택
4. **Enable sign in with Google** 토글 활성화
5. Google Cloud Console에서 복사한 정보 입력:
   - **Client ID**: Google OAuth 클라이언트 ID
   - **Client Secret**: Google OAuth 클라이언트 시크릿
6. **Save** 클릭

### 2.2 리디렉션 URL 설정
Supabase에서 제공하는 리디렉션 URL을 Google Cloud Console의 승인된 리디렉션 URI에 추가:
```
https://your-project-ref.supabase.co/auth/v1/callback
```

## 3. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가:

```env
# Google OAuth 2.0 설정
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

**주의**: `your-google-client-id`와 `your-google-client-secret`를 실제 값으로 교체하세요.

## 4. 데이터베이스 스키마 업데이트

Supabase SQL 에디터에서 다음 쿼리를 실행하여 profiles 테이블에 avatar_url 컬럼을 추가:

```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

## 5. 테스트

1. 애플리케이션을 실행: `npm run dev`
2. `/auth/login` 페이지로 이동
3. **구글로 로그인** 버튼 클릭
4. Google 계정으로 로그인
5. 홈 페이지로 리디렉션되는지 확인

## 6. 문제 해결

### 일반적인 오류들

#### "redirect_uri_mismatch" 오류
- Google Cloud Console의 승인된 리디렉션 URI가 올바르게 설정되었는지 확인
- 개발 환경과 프로덕션 환경의 URL이 모두 추가되었는지 확인

#### "invalid_client" 오류
- 환경 변수의 클라이언트 ID가 올바른지 확인
- `.env.local` 파일이 올바른 위치에 있는지 확인

#### 프로필 생성 오류
- Supabase에서 profiles 테이블이 존재하는지 확인
- RLS(Row Level Security) 정책이 올바르게 설정되었는지 확인

### 디버깅 팁

1. 브라우저 개발자 도구의 콘솔에서 오류 메시지 확인
2. Supabase 대시보드의 Authentication > Users에서 사용자가 생성되었는지 확인
3. 네트워크 탭에서 API 요청/응답 확인

## 7. 보안 고려사항

1. **클라이언트 시크릿 보안**: 클라이언트 시크릿은 서버 사이드에서만 사용하고 클라이언트에 노출되지 않도록 주의
2. **HTTPS 사용**: 프로덕션 환경에서는 반드시 HTTPS 사용
3. **도메인 제한**: Google Cloud Console에서 승인된 도메인만 설정
4. **토큰 관리**: 액세스 토큰의 만료 시간을 적절히 설정

## 8. 추가 기능

### 8.1 사용자 정보 동기화
Google에서 제공하는 사용자 정보(이름, 이메일, 프로필 사진)를 자동으로 동기화합니다.

### 8.2 기존 계정 연동
이메일이 동일한 기존 계정이 있는 경우 자동으로 연동됩니다.

이제 구글 OAuth 2.0 로그인이 성공적으로 설정되었습니다! 🎉
