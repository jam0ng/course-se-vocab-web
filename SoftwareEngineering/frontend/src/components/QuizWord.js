import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TOTAL_QUESTIONS = 10;

const QuizWord = () => {
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState('');
  const [count, setCount] = useState(1);
  const [score, setScore] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));
  const query = new URLSearchParams(location.search);
  const difficulty = query.get('difficulty') || 'easy';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || user.role !== 'user') {
      alert('일반 사용자만 접근 가능한 기능입니다.');
      navigate('/');
    }
  }, []);

  const fetchQuiz = async () => {
    setResult('');
    setSelected('');
<<<<<<< HEAD
    const res = await fetch('${process.env.REACT_APP_API_BASE_URL}/api/quiz/word');
=======
    const res = await fetch(`http://localhost:5000/api/quiz/word?difficulty=${difficulty}`);
>>>>>>> develop
    const data = await res.json();
    setQuiz(data);
  };

  const fetchBookmarks = async () => {
    const res = await fetch('http://localhost:5000/api/bookmarks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      const ids = data.map(word => word._id);
      setBookmarkedIds(ids);
    }
  };

  useEffect(() => {
    fetchQuiz();
    if (token) fetchBookmarks();
  }, []);

  useEffect(() => {
    if (count > TOTAL_QUESTIONS) {
      navigate('/quiz-result', { state: { score, total: TOTAL_QUESTIONS } });
    }
  }, [count, navigate, score]);

  const handleChoice = (choice) => {
    setSelected(choice);
    if (choice === quiz.english) {
      setResult('✅ 정답입니다!');
      setScore(prev => prev + 1);
    } else {
      setResult(`❌ 오답입니다! 정답: ${quiz.english}`);
    }
  };

  const handleBookmark = async () => {
    if (!token) {
      alert('🔒 로그인 후 이용해주세요.');
      return;
    }

    const isBookmarked = bookmarkedIds.includes(quiz._id);
    const method = isBookmarked ? 'DELETE' : 'POST';

    try {
      const res = await fetch(`http://localhost:5000/api/bookmarks/${quiz._id}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setBookmarkedIds((prev) =>
          isBookmarked
            ? prev.filter(id => id !== quiz._id)
            : [...prev, quiz._id]
        );
      } else {
        alert(`❌ 북마크 ${isBookmarked ? '해제' : '추가'} 실패`);
      }
    } catch (err) {
      console.error('북마크 오류', err);
    }
  };

  if (!quiz || !quiz.options) return <p>퀴즈 로딩 중...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>🧠 {count} / {TOTAL_QUESTIONS} 문제 | 현재 점수: {score}점</h2>

      {/* 문제 카드 */}
      <div style={{
        padding: '1rem',
        background: '#e7f5ff',
        borderRadius: '8px',
        marginBottom: '1rem',
        position: 'relative',
        textAlign: 'center'
      }}>
        {/* ⭐ 북마크 버튼 */}
        <button
          onClick={handleBookmark}
          style={{
            position: 'absolute',
            top: '10px',
            right: '12px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: bookmarkedIds.includes(quiz._id) ? '#fcc419' : '#ccc',
            cursor: 'pointer'
          }}
          title={bookmarkedIds.includes(quiz._id) ? '북마크 해제' : '북마크 추가'}
        >
          ★
        </button>

        {difficulty === 'easy' ? (
          <h3>{quiz.korean}</h3>
        ) : (
          <h3>
            {quiz.example.replace(new RegExp(quiz.english, 'gi'), '_____')}
          </h3>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
      }}>
<<<<<<< HEAD
        {Array.isArray(quiz?.choices) && quiz.choices.map((choice, idx) => ( // 수정
=======
        {quiz.options.map((choice, idx) => (
>>>>>>> develop
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
          >
            메인으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizWord;
