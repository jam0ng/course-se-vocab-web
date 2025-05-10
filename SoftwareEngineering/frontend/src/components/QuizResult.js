import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, total } = location.state || { score: 0, total: 10 };

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'user') {
      alert('일반 사용자만 접근 가능한 기능입니다.');
      navigate('/');
    }
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
      <h2>🎉 퀴즈 완료!</h2>
      <p style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
        당신의 점수는 <strong style={{ color: '#51cf66' }}>{score} / {total}</strong> 입니다!
      </p>

      <div style={{
        background: '#fff3bf',
        padding: '1rem',
        borderRadius: '8px',
        color: '#f59f00',
        marginBottom: '1.5rem'
      }}>
        {score >= 8 && '우와! 거의 만점! 대단해요! 💯'}
        {score >= 5 && score < 8 && '좋아요! 조금만 더 하면 금방 만점! ✨'}
        {score < 5 && '괜찮아요! 반복하면 반드시 늘어요! 💪'}
      </div>

      <button
        onClick={() => navigate('/quiz-start')}
        style={{
          padding: '0.8rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          background: '#339af0',
          color: '#fff',
          fontSize: '1.1rem',
          cursor: 'pointer',
          marginBottom: '0.8rem'
        }}
      >
        🔄 다시 풀기
      </button>
      <br />
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          background: '#f8f9fa',
          cursor: 'pointer'
        }}
      >
        메인으로 돌아가기
      </button>
    </div>
  );
};

export default QuizResult;
