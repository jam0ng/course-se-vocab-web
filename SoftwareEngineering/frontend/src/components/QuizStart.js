import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizStart = () => {
  const navigate = useNavigate();
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
      <h2>🧠 TOEIC 뜻 고르기 퀴즈</h2>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        총 10문제를 풀어볼 거예요!
      </p>
      <div style={{
        background: '#e7f5ff',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        color: '#1c7ed6'
      }}>
        💡 퀴즈 Tip <br />
        보기 중 정답은 단 하나! 차분하게 골라보세요.
      </div>
      <button
        onClick={() => navigate('/quiz')}
        style={{
          padding: '0.8rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          background: '#51cf66',
          color: '#fff',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: '0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#40c057'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#51cf66'}
      >
        🟢 퀴즈 시작하기
      </button>
      <br /><br />
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

export default QuizStart;
