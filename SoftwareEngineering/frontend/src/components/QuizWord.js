// src/components/QuizWord.js

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
    if (choice === quiz.english) {
      setResult('✅ 정답입니다!');
      setScore(prev => prev + 1);
    } else {
      setResult(`❌ 오답입니다! 정답: ${quiz.english}`);
    }
  };

  if (!quiz) return <p>퀴즈 로딩 중...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>🧠 {count} / {TOTAL_QUESTIONS} 문제 | 현재 점수: {score}점</h2>

      <div style={{
        padding: '1rem',
        background: '#e7f5ff',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        <h3>뜻: {quiz.korean}</h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
      }}>
        {quiz.choices.map((choice, idx) => (
          <button
            key={idx}
            disabled={!!result}
            onClick={() => handleChoice(choice)}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: selected === choice
                ? choice === quiz.english
                  ? '2px solid green'
                  : '2px solid red'
                : '1px solid #ccc',
              background: selected === choice
                ? choice === quiz.english
                  ? '#d3f9d8'
                  : '#ffe3e3'
                : '#fff',
              cursor: !!result ? 'default' : 'pointer',
              transition: '0.2s'
            }}
          >
            {choice}
          </button>
        ))}
      </div>

      <p style={{ marginTop: '1rem' }}>{result}</p>

      {/* ✅ 여기부터 버튼 디자인 적용 */}
      {result && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
          <button
            onClick={() => { setCount(count + 1); fetchQuiz(); }}
            style={{
              padding: '0.8rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              background: '#339af0',
              color: '#fff',
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: '0.2s',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => e.target.style.background = '#1c7ed6'}
            onMouseOut={e => e.target.style.background = '#339af0'}
          >
            다음 문제 ▶
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.8rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              background: '#51cf66',
              color: '#fff',
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: '0.2s',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => e.target.style.background = '#37b24d'}
            onMouseOut={e => e.target.style.background = '#51cf66'}
          >
            메인으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizWord;
