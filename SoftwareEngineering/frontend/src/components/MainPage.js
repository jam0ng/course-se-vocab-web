import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const tips = [
  "토익은 단어 암기가 반 이상이다! 하루 20개씩 꾸준히 외우기 📚",
  "Part 5는 문제를 읽기 전에 빈칸의 앞뒤를 먼저 보자 👀",
  "LC는 스크립트 따라 읽기 연습이 점수 올리는 지름길 🗣️",
  "Part 7은 문제를 먼저 읽고 지문을 보자 ⏱️",
  "시험 전날은 무리하지 말고 푹 쉬기 🛌",
  "토익 자주 나오는 동사구는 따로 정리하자 ✏️",
  "LC는 발음보다 문제유형에 익숙해지기 💡",
  "RC 시간 관리가 핵심! 문제당 시간 분배 연습하기 ⏳",
];

const MainPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [tip, setTip] = useState('');

  useEffect(() => {
    // 랜덤 꿀팁 선택
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, []);

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
      <h2>환영합니다 👋</h2>
      <p style={{ fontSize: '1.1rem', color: '#555' }}>
        {user?.username}님, TOEIC 학습을 시작해볼까요?
      </p>

      {/* 🌟 랜덤 꿀팁 박스 */}
      <div style={{
        background: '#e7f5ff',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '1.5rem',
        marginBottom: '1.5rem',
        color: '#1c7ed6'
      }}>
        <strong>💡 오늘의 꿀팁</strong><br/>
        {tip}
      </div>

      {/* 메뉴 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button
          onClick={() => navigate('/quiz-start')}
          style={{
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: '#f8f9fa',
            cursor: 'pointer',
            fontSize: '1.1rem',
            transition: '0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
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
            fontSize: '1.1rem',
            transition: '0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
        >
          📚 단어장 보기
        </button>

        <button
          onClick={onLogout}
          style={{
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: '#ffe6e6',
            cursor: 'pointer',
            fontSize: '1.1rem',
            transition: '0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffd6d6'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffe6e6'}
        >
          🚪 로그아웃
        </button>
      </div>
    </div>
  );
};

export default MainPage;
