import React, { useEffect, useState } from 'react';

const WordList = () => {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    const res = await fetch('http://localhost:5000/api/words');
    const data = await res.json();
    setWords(data);
    setFilteredWords(data);
  };

  const handleSearch = (text) => {
    setSearch(text);
    filterWords(selectedLetters, text);
    setPage(1);
  };

  const handleLetterFilter = (letter) => {
    setSelectedLetters(prev =>
      prev.includes(letter)
        ? prev.filter((l) => l !== letter)
        : [...prev, letter]
    );
    setPage(1);
  };

  const filterWords = (letters, searchText) => {
    let result = [...words];

    if (letters.length > 0) {
      result = result.filter((word) =>
        letters.some((letter) =>
          word.english.toLowerCase().startsWith(letter.toLowerCase())
        )
      );
    }

    if (searchText) {
      result = result.filter(
        (word) =>
          word.english.toLowerCase().includes(searchText.toLowerCase()) ||
          word.korean.includes(searchText)
      );
    }

    setFilteredWords(result);
  };

  useEffect(() => {
    filterWords(selectedLetters, search);
  }, [selectedLetters, words]);

  const pagedWords = filteredWords.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '900px',
      margin: 'auto',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>📚 단어장</h2>

      {/* 알파벳 필터 (2줄 + 초기화 버튼 아래) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '1.5rem'
      }}>
        {/* 윗줄 A-M */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {'ABCDEFGHIJKLM'.split('').map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterFilter(letter)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                background: selectedLetters.includes(letter) ? '#339af0' : '#f8f9fa',
                color: selectedLetters.includes(letter) ? '#fff' : '#000',
                cursor: 'pointer',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* 아랫줄 N-Z */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {'NOPQRSTUVWXYZ'.split('').map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterFilter(letter)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                background: selectedLetters.includes(letter) ? '#339af0' : '#f8f9fa',
                color: selectedLetters.includes(letter) ? '#fff' : '#000',
                cursor: 'pointer',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* 초기화 버튼 (아래쪽 중앙) */}
        <button
          onClick={() => {
            setSelectedLetters([]);
            filterWords([], search);
          }}
          style={{
            marginTop: '10px',
            padding: '0.6rem 1.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: '#f03e3e',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          초기화
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 단어를 검색하세요"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '0.8rem',
          marginBottom: '1rem',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {pagedWords.map((word) => (
          <li key={word._id} style={{
            padding: '0.8rem',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong style={{ fontSize: '1.1rem' }}>{word.english}</strong>{' '}
              <span style={{ color: '#888' }}>- {word.korean}</span>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '5px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: '#f8f9fa'
          }}
        >
          이전
        </button>
        <span> {page} / {Math.ceil(filteredWords.length / pageSize)} </span>
        <button
          disabled={page * pageSize >= filteredWords.length}
          onClick={() => setPage(page + 1)}
          style={{
            padding: '0.5rem 1rem',
            marginLeft: '5px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: '#f8f9fa'
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default WordList;
