// src/components/MainPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '600px',
      margin: '2rem auto',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <h2>환영합니다 {user?.role === 'admin' && '(관리자)'} 👋</h2>
      <p style={{ fontSize: '1.1rem', color: '#555' }}>
        {user?.username}님, TOEIC 학습을 시작해볼까요?
      </p>

      {/* 🌟 랜덤 꿀팁 */}
      <div style={{
        background: '#e7f5ff',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '1.5rem',
        marginBottom: '1.5rem',
        color: '#1c7ed6'
      }}>
        💡 오늘의 꿀팁 <br />
        토익은 꾸준함이 가장 중요해요!
      </div>

      {/* 메뉴 버튼 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1rem' }}>
        <button
          onClick={() => navigate('/quiz-start')}
          style={{
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: '#f8f9fa',
            cursor: 'pointer',
            fontSize: '1.1rem'
          }}
        >
          🧠 퀴즈 시작하기
        </button>

        <button
          onClick={() => navigate('/wordlist')}
          style={{
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: '#f8f9fa',
            cursor: 'pointer',
            fontSize: '1.1rem'
          }}
        >
          📚 단어장 보기
        </button>

        {/* ✅ 사용자 전용 메뉴 */}
        {user?.role === 'user' && (
          <button
            onClick={() => navigate('/mywords')}
            style={{
              padding: '0.8rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: '#f8f9fa',
              color: '#000',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
        >
            ⭐ 나만의 단어장
          </button>
        )}

        {/* ✅ 관리자 전용 메뉴 */}
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin/words')}
            style={{
              padding: '0.8rem',
              borderRadius: '8px',
              border: '1px solid #339af0',
              background: '#e7f5ff',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            🛠️ 관리자 단어 관리
          </button>
        )}

        <button
          onClick={onLogout}
          style={{
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: '#ffe6e6',
            cursor: 'pointer',
            fontSize: '1.1rem'
          }}
        >
          🚪 로그아웃
        </button>
      </div>
    </div>
  );
};

export default MainPage;
