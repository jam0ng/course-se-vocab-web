// QuizResult.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, total } = location.state || { score: 0, total: 10 };
  const user = JSON.parse(localStorage.getItem('user'));
  const [quizScore, setQuizScore] = useState(0);
  const [quizCount, setQuizCount] = useState(0);

  // DEBUG: 콘솔 확인용. false로 바꾸면 디버깅 꺼짐
  const DEBUG = true;
  
  const handleCheckin = (token) => {
    fetch('/api/attendances/checkin', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(data => {
        if (DEBUG) console.log('[출석 응답]', data);
      })
      .catch(err => {
        if (DEBUG) console.error('[출석 오류]', err);
      });
  };

  const handleQuizSubmit = (token) => {
    fetch('/api/quizzes/submit', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (DEBUG) console.log('[퀴즈 제출 응답]', data);
        const mission = data?.mission;
        if (mission) {
          setQuizScore(mission.score ?? 0);
          setQuizCount(mission.count ?? 0);
          if (DEBUG) {
            console.log('[퀴즈 count]', mission.count);
            console.log('[퀴즈 score]', mission.score);
          }
          if (mission.count === 1) {
            handleCheckin(token);
          }
        }
        const msgEl = document.getElementById('quiz-result-message');
        if (msgEl && msgEl.childElementCount === 0) {
          const msg = document.createElement('p');
          msg.innerText = '✅ 오늘 퀴즈 미션이 완료되었습니다!';
          msg.style.color = '#2f9e44';
          msg.style.marginTop = '1rem';
          msgEl.appendChild(msg);
        }
      });
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    const todayKey = new Date().toISOString().slice(0, 10);

    if (!user || user.role !== 'user') {
      alert('일반 사용자만 접근 가능한 기능입니다.');
      navigate('/');
      return;
    }

    if (!localStorage.getItem(`quiz_submitted_${todayKey}`)) {
      localStorage.setItem(`quiz_submitted_${todayKey}`, 'true');
      handleQuizSubmit(token);
    }
  }, [navigate, user]);

/*
    // ✅ 퀴즈 미션 자동 제출
    fetch('/api/quizzes/submit', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {

        //디버깅
        if (DEBUG) console.log('[퀴즈 제출 응답]', data);
        const mission = data?.mission;
        // --------------------------------------------- 

        if (data?.mission?.score != null) {
          setQuizScore(data.mission.score);
          setQuizCount(mission.count ?? 0);

          // 디버깅
          if (DEBUG) {
            console.log('[퀴즈 count]', mission.count);
            console.log('[퀴즈 score]', mission.score);
          }
          // ---------------------------------------------

        }
        const msgEl = document.getElementById('quiz-result-message');
        if (msgEl && msgEl.childElementCount === 0) {
          const msg = document.createElement('p');
          msg.innerText = '✅ 오늘 퀴즈 미션이 완료되었습니다!';
          msg.style.color = '#2f9e44';
          msg.style.marginTop = '1rem';
          msgEl.appendChild(msg);
        }
      });

    // 디버깅 포함 
    handleCheckin(token);
  }, [navigate, user]);

*/
  

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '2rem auto',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}
    >
      <h2>🎉 퀴즈 완료!</h2>
      <p style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
        당신의 점수는 <strong style={{ color: '#51cf66' }}>{score} / {total}</strong> 입니다!
      </p>
      <p style={{ fontSize: '1rem', color: '#666' }}>
        🔢 누적 퀴즈 횟수: <strong>{quizCount}</strong><br />
        🧮 퀴즈 미션 점수: <strong>{quizScore}</strong>
      </p>

      <div
        style={{
          background: '#fff3bf',
          padding: '1rem',
          borderRadius: '8px',
          color: '#f59f00',
          marginBottom: '1.5rem',
        }}
      >
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
          marginBottom: '0.8rem',
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
          cursor: 'pointer',
        }}
      >
        메인으로 돌아가기
      </button>

      <div id="quiz-result-message"></div>
    </div>
  );
};

export default QuizResult;
