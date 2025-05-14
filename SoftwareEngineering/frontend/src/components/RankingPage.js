// ========== frontend/RankingPage.jsx ==========
import React, { useEffect, useState } from 'react';

const RankingPage = () => {
  const [attendance, setAttendance] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [ranking, setRanking] = useState([]);

  // 오늘 출석 상태 호출
  const fetchAttendance = async () => {
    const res = await fetch('/api/attendance/today', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    const data = await res.json();
    setAttendance(data);
  };

  // 오늘 퀴즈 상태 호출
  const fetchQuiz = async () => {
    const res = await fetch('/api/quiz/today', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    const data = await res.json();
    setQuiz(data);
  };

  // 오늘 랭킹 호출
  const fetchRanking = async () => {
    const res = await fetch('/api/rankings/today');
    const data = await res.json();
    setRanking(data);
  };

  useEffect(() => {
    fetchAttendance();
    fetchQuiz();
    fetchRanking();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>🗓️ 오늘 출석 체크</h2>
      <p>{attendance?.checked ? '✅ 출석하셨습니다.' : '❌ 아직 출석하지 않음'}</p>
      <h2 style={{ marginTop: '1.5rem' }}>🧩 오늘 퀴즈 진행</h2>
      <p>풀이 수: {quiz?.count || 0}회 / 점수: {quiz?.score || 0}</p>
      <h2 style={{ marginTop: '1.5rem' }}>🏆 오늘의 랭킹</h2>
      <ol>
        {ranking.map((item, idx) => (
          <li key={item.userId}>
            {idx + 1}. 사용자 {item.userId} - 총점 {item.totalScore}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RankingPage;