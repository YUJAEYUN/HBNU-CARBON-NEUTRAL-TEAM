'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 인증 코드 처리
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('인증 콜백 오류:', error);
          router.push('/auth/login?error=auth_failed');
          return;
        }

        if (data.session) {
          // Google OAuth 성공 시 테스트 계정으로 강제 로그인
          console.log('Google OAuth 성공, 테스트 계정으로 로그인 처리');

          // 테스트 계정 정보로 커스텀 로그인 API 호출
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'Cnergy@hbnu.ac.kr',
              password: 'test1234'
            })
          });

          if (loginResponse.ok) {
            console.log('테스트 계정으로 로그인 성공');
            // 페이지 새로고침으로 AuthContext 업데이트
            window.location.href = '/';
          } else {
            console.error('테스트 계정 로그인 실패');
            router.push('/auth/login?error=test_login_failed');
          }
        } else {
          // 세션이 없음
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('콜백 처리 중 오류:', error);
        router.push('/auth/login?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
