// src/components/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setMessage('❌ 모든 필드를 입력해주세요.');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, adminCode }),
      });
      const data = await res.json();

      if (res.ok) {
        alert('회원가입 성공!');
        navigate('/login');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ 회원가입 중 오류 발생');
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
      <h2>📝 회원가입</h2>

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1.5rem' }}>
        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="닉네임" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="관리자 코드 (일반 유저는 비워두세요)" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#339af0', color: '#fff', cursor: 'pointer' }}>회원가입</button>
      </form>

      <p style={{ color: '#888', marginTop: '1rem' }}>{message}</p>

      <p style={{ marginTop: '1rem' }}>
        이미 계정이 있으신가요?{" "}
        <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#339af0', cursor: 'pointer', textDecoration: 'underline' }}>
          로그인
        </button>
      </p>
    </div>
  );
};

export default Register;
