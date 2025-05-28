import React, { useEffect, useState } from 'react';

const RankingPage = () => {
  const [ranking, setRanking] = useState([]);       // ✅ 배열로 초기화
  const [message, setMessage] = useState(''); 


  // DEBUG: 콘솔 로그 출력 여부, false로 바꾸면 디버깅 꺼짐
  const DEBUG = true;


  const fetchRanking = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/rankings/today`);
      const data = await res.json();

      /* 디버깅 */
      if (DEBUG) console.log('[랭킹 응답]', data);
      /* ----------------------------------------- */

      if (Array.isArray(data)) {
        const filtered = data.filter(item => item?.username && item.totalScore != null);
        setRanking(filtered); // ✅ 정상적인 배열일 경우에만 설정
      } else {
        setRanking([]);
        setMessage('⚠️ 랭킹 데이터가 없습니다.');
      }
    } catch (err) {
      setRanking([]);
      setMessage('❌ 랭킹 정보를 불러오지 못했습니다.');

      /* 디버깅 */
      if (DEBUG) console.error('[랭킹 오류]', err);
      /* ------------------------------------------ */
      
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>🏆 오늘의 랭킹</h2>
<<<<<<< HEAD
<<<<<<< HEAD
늘 퀴즈 현황
푼 문제 수: 0 / 점수: 0
=======
>>>>>>> 4f43f2db (v3.4__요구사항 명세서 바탕으로 수정)
=======
=======
늘 퀴즈 현황
푼 문제 수: 0 / 점수: 0
>>>>>>> origin/main
>>>>>>> a0a1c749681e8fe87630c711934bf48bc4f6fff7
      {ranking.length === 0 ? (
        <p>{message || '랭킹 정보를 불러오는 중입니다...'}</p>
      ) : (
        <ol>
          {ranking.map((item, idx) => (
            <li key={idx}>
              {item.username || '사용자'} - {item.totalScore ?? '-'}점
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default RankingPage;
