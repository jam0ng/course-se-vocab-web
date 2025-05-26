// src/components/MyPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>👤 마이페이지</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={() => navigate('/profile-edit')}>👤 개인정보 수정</button>
        <button onClick={() => navigate('/mission')}>✅ 일일 미션</button>
        <button onClick={() => navigate('/ranking')}>🏆 랭킹 조회</button>
      </div>
    </div>
  );
};

export default MyPage;
