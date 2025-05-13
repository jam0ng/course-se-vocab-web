import React, { useEffect, useState, useCallback } from 'react';

const WordList = () => {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [page, setPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const pageSize = 20;

  const token = localStorage.getItem('token');

  // 사용자 역할 감지
  let userRole = 'user';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch (err) {
      console.error('토큰 파싱 실패', err);
    }
  }

  useEffect(() => {
    fetchWords();

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

    if (token) fetchBookmarks();
  }, [token]);

  const fetchWords = async () => {
    const res = await fetch('http://localhost:5000/api/words');
    const data = await res.json();
    setWords(data);
    setFilteredWords(data);
  };

  const handleBookmark = async (wordId) => {
    if (!token) {
      alert('🔒 로그인 후 이용해주세요.');
      return;
    }

    const isBookmarked = bookmarkedIds.includes(wordId);
    const method = isBookmarked ? 'DELETE' : 'POST';

    try {
      const res = await fetch(`http://localhost:5000/api/bookmarks/${wordId}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setBookmarkedIds((prev) =>
          isBookmarked
            ? prev.filter(id => id !== wordId)
            : [...prev, wordId]
        );
      } else {
        const error = await res.json().catch(() => null);
        alert(`❌ 북마크 ${isBookmarked ? '해제' : '추가'} 실패: ${error?.message || res.status}`);
      }
    } catch (err) {
      alert('❌ 네트워크 오류 또는 서버 에러 발생');
      console.error(err);
    }
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

  const filterWords = useCallback((letters, searchText) => {
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
  }, [words]);

  useEffect(() => {
    filterWords(selectedLetters, search);
  }, [selectedLetters, words, search, filterWords]);

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

      {/* 알파벳 필터 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '1.5rem'
      }}>
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
                fontWeight: 'bold'
              }}
            >
              {letter}
            </button>
          ))}
        </div>
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
                fontWeight: 'bold'
              }}
            >
              {letter}
            </button>
          ))}
        </div>
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

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* 검색창 */}
        <input
          type="text"
          placeholder="🔍 단어를 검색하세요"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: '0.8rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* 단어 리스트 */}
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
            {userRole !== 'admin' && (
              <button
                onClick={() => handleBookmark(word._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: bookmarkedIds.includes(word._id) ? '#fcc419' : '#ccc'
                }}
                title={bookmarkedIds.includes(word._id) ? '북마크 해제' : '북마크 추가'}
              >
                ★
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* 페이지네이션 */}
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
