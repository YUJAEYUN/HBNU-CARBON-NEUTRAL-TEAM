import { useState } from 'react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [school, setSchool] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nickname, school }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('회원가입 성공! 로그인하세요.');
    } else {
      setMessage(data.error || '회원가입 실패');
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <input type="text" placeholder="학교" value={school} onChange={(e) => setSchool(e.target.value)} />
      <button onClick={handleSignup}>가입하기</button>
      <p>{message}</p>
    </div>
  );
}
