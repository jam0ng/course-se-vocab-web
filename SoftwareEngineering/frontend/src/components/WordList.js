// src/components/WordList.js
import React, { useEffect, useState } from 'react';

const WordList = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/words')
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ 불러온 단어:', data); // ← 이 줄을 추가!
        setWords(data);
      })
      .catch((err) => console.error('❌ 단어 불러오기 실패:', err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📚 TOEIC 단어장</h2>
      <ul>
        {words.map((word) => (
          <li key={word._id} style={{ marginBottom: '1rem' }}>
            <strong>{word.english}</strong> — {word.korean}
            <br />
            <em>{word.example}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordList;
