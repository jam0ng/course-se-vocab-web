// DailyMissionPage.jsx
import React, { useEffect, useState } from 'react';

const DailyMissionPage = () => {
  const [attendance, setAttendance] = useState(null);
  const [quiz, setQuiz] = useState({ count: 0, score: 0 }); // 초기 상태 안전화
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/attendances/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAttendance(data);
    } catch {
      setMessage('❌ 출석 상태를 불러오지 못했습니다.');
    }
  };

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/quizzes/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('퀴즈 API 실패');
      const data = await res.json();
      if (data && typeof data === 'object') {
        setQuiz(data);
      } else {
        setQuiz({ count: 0, score: 0 });
        setMessage('⚠️ 퀴즈 데이터가 올바르지 않습니다.');
      }
    } catch {
      setQuiz({ count: 0, score: 0 });
      setMessage('❌ 퀴즈 상태를 불러오지 못했습니다.');
    }
  };

  const checkIn = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/attendances/checkin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message || '✅ 출석 완료');
      fetchAttendance();
    } catch {
      setMessage('❌ 출석 체크 실패');
    }
  };

  useEffect(() => {
    if (token) {
      fetchAttendance();
      fetchQuiz();
    } else {
      setMessage('❌ 로그인 후 이용해주세요.');
    }
  }, [token]);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>🗓️ 일일 미션</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3>✔ 오늘 출석 체크</h3>
        <p>
          {attendance?.checked
            ? `✅ 이미 출석했습니다 (점수: ${attendance.score})`
            : '❌ 아직 출석하지 않았습니다.'}
        </p>
        {!attendance?.checked && (
          <button
            onClick={checkIn}
            style={{ padding: '0.6rem 1rem', borderRadius: '6px', background: '#339af0', color: '#fff', border: 'none' }}
          >
            출석 체크하기
          </button>
        )}
      </section>

      <section>
        <h3>🧩 오늘 퀴즈 현황</h3>
        <p>
          푼 문제 수: {quiz.count || 0} / 점수: {quiz.score || 0}
        </p>
      </section>

      {message && <p style={{ marginTop: '1rem', color: '#f03e3e' }}>{message}</p>}
    </div>
  );
};

export default DailyMissionPage;
