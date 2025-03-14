import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const res = await fetch('/api/user/profile', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        setMessage(data.error || '사용자 정보를 가져올 수 없습니다.');
        router.push('/auth/login');
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (res.ok) {
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  };

  return (
    <div>
      <h2>대시보드</h2>
      {user ? (
        <div>
          <p>이메일: {user.email}</p>
          <p>닉네임: {user.nickname}</p>
          <p>학교: {user.school}</p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
