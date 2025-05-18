import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizStart = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [difficulty, setDifficulty] = useState('easy');

  useEffect(() => {
    if (!user || user.role !== 'user') {
      alert('일반 사용자만 접근 가능한 기능입니다.');
      navigate('/');
    }
  }, []);

  const handleStart = () => {
    navigate(`/quiz?difficulty=${difficulty}`);
  };

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

      {/* ✅ 난이도 선택 */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '0.8rem', fontSize: '1.2rem' }}>난이도 선택</p>
        <button
          onClick={() => setDifficulty('easy')}
          style={{
            padding: '0.8rem 2rem',
            marginRight: '1rem',
            fontSize: '1.1rem',
            borderRadius: '8px',
            border: difficulty === 'easy' ? '3px solid #1c7ed6' : '1px solid #ccc',
            background: '#228be6',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          쉬움
        </button>
        <button
          onClick={() => setDifficulty('hard')}
          style={{
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            borderRadius: '8px',
            border: difficulty === 'hard' ? '3px solid #fa5252' : '1px solid #ccc',
            background: '#fa5252',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          어려움
        </button>
      </div>

      <button
        onClick={handleStart}
        style={{
          padding: '0.9rem 14rem',
          borderRadius: '8px',
          border: 'none',
          background: '#51cf66',
          color: '#fff',
          fontSize: '1.2rem',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        퀴즈 시작하기
      </button>
    </div>
  );
};

export default QuizStart;
