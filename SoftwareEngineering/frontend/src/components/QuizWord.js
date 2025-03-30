import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TOTAL_QUESTIONS = 10;

const QuizWord = () => {
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState('');
  const [count, setCount] = useState(1);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const fetchQuiz = async () => {
    setResult('');
    setSelected('');
    const res = await fetch('http://localhost:5000/api/quiz/word');
    const data = await res.json();
    setQuiz(data);
  };

  useEffect(() => {
    if (count > TOTAL_QUESTIONS) {
      navigate('/quiz-result', { state: { score, total: TOTAL_QUESTIONS } });
    }
  }, [count, navigate, score]);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleChoice = (choice) => {
    setSelected(choice);
    if (choice === quiz.correct) {
      setResult('✅ 정답입니다!');
      setScore(prev => prev + 1);
    } else {
      setResult(`❌ 오답입니다! 정답: ${quiz.correct}`);
    }
  };

  if (!quiz) return <p>퀴즈 로딩 중...</p>;

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '2rem auto', 
      background: '#fff', 
      borderRadius: '12px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      
      {/* 진행률 */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.9rem', color: '#888' }}>
          문제 {count} / {TOTAL_QUESTIONS} | 점수: {score}
        </div>
        <div style={{
          background: '#e9ecef',
          borderRadius: '5px',
          overflow: 'hidden',
          height: '8px',
          marginTop: '5px'
        }}>
          <div style={{
            width: `${(count / TOTAL_QUESTIONS) * 100}%`,
            height: '100%',
            background: '#51cf66',
            transition: '0.3s'
          }}></div>
        </div>
      </div>

      {/* 문제 카드 */}
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🧠 뜻 고르기 퀴즈</h2>

      <div style={{
        background: '#f1f3f5',
        padding: '1.5rem',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
      }}>
        {quiz.english}
      </div>

      {/* 보기 버튼 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {quiz.choices.map((choice, idx) => (
          <button
            key={idx}
            style={{
              padding: '0.8rem',
              borderRadius: '8px',
              border: selected ? (choice === quiz.correct ? '2px solid green' : (choice === selected ? '2px solid red' : '1px solid #ccc')) : '1px solid #ccc',
              backgroundColor: selected ? (choice === quiz.correct ? '#e6ffed' : (choice === selected ? '#ffe6e6' : '#fff')) : '#fff',
              cursor: selected ? 'default' : 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.2s',
              boxShadow: selected ? (choice === quiz.correct || choice === selected ? '0 0 8px rgba(0,0,0,0.1)' : '') : '0 2px 5px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => { if (!selected) e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
            onMouseOut={(e) => { if (!selected) e.currentTarget.style.backgroundColor = '#fff'; }}
            disabled={!!result}
            onClick={() => handleChoice(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      {/* 결과 및 다음 버튼 */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem' }}>{result}</p>
        {result && (
          <>
            <button
              onClick={() => {
                setCount(count + 1);
                fetchQuiz();
              }}
              style={{
                marginRight: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #888',
                background: '#f8f9fa',
                cursor: 'pointer'
              }}
            >
              다음 문제 ▶️
            </button>

            <button
              onClick={() => navigate('/')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #888',
                background: '#f8f9fa',
                cursor: 'pointer'
              }}
            >
              메인으로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizWord;
