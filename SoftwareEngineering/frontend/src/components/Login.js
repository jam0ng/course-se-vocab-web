import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('${process.env.REACT_APP_API_BASE_URL}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('✅ 로그인 성공!');
        localStorage.setItem('token', data.token); // 🔐 토큰 저장
        localStorage.setItem('user', JSON.stringify(data.user)); // ✅ 사용자 정보 저장
        onLogin(data.user, data.token);
        navigate('/'); // 메인 페이지 이동
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ 로그인 중 오류 발생');
    }
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '400px',
      margin: '3rem auto',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <h2>🔐 로그인</h2>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1.5rem' }}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#339af0', color: '#fff', cursor: 'pointer' }}>
          로그인
        </button>
      </form>

      <p style={{ color: '#888', marginTop: '1rem' }}>{message}</p>

      <p style={{ marginTop: '1rem' }}>
        계정이 없으신가요?{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          style={{ background: 'none', border: 'none', color: '#339af0', cursor: 'pointer', textDecoration: 'underline' }}
        >
          회원가입
        </button>
      </p>
    </div>
  );
};

export default Login;
