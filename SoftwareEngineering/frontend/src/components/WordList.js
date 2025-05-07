import React, { useEffect, useState } from 'react';

const WordList = () => {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [page, setPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const [error, setError] = useState(null);
  const pageSize = 20;

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchWords();
    if (!isAdmin) {
      fetchBookmarks();
    }
  }, []);

  const fetchWords = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/words');
      const data = await res.json();
      setWords(data);
      setFilteredWords(data);
    } catch (err) {
      setError('단어 목록을 불러오는 데 실패했습니다.');
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return handleUnauthorized();
      const data = await res.json();
      const ids = Array.isArray(data)
        ? data.map((id) => (typeof id === 'object' ? id._id : id))
        : [];
      setBookmarkedIds(ids);
    } catch (err) {
      setError('북마크 정보를 불러오는 데 실패했습니다.');
    }
  };

  const toggleBookmark = async (id) => {
    if (loadingIds.includes(id)) return;

    setLoadingIds((prev) => [...prev, id]);
    setError(null);
    const isBookmarked = bookmarkedIds.includes(id);

    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:5000/api/bookmarks/${id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) return handleUnauthorized();

      if (res.ok) {
        setBookmarkedIds((prev) =>
          isBookmarked ? prev.filter((bid) => bid !== id) : [...prev, id]
        );
      } else {
        setError('북마크 변경에 실패했습니다.');
      }
    } catch {
      setError('북마크 변경 중 네트워크 오류가 발생했습니다.');
    } finally {
      setLoadingIds((prev) => prev.filter((bid) => bid !== id));
    }
  };

  const handleUnauthorized = () => {
    alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSearch = (text) => {
    setSearch(text);
    filterWords(selectedLetter, text);
    setPage(1);
  };

  const handleLetterFilter = (letter) => {
    setSelectedLetter(letter);
    filterWords(letter, search);
    setPage(1);
  };

  const filterWords = (letter, searchText) => {
    let result = [...words];
    if (letter) result = result.filter((word) => word.english.toLowerCase().startsWith(letter.toLowerCase()));
    if (searchText)
      result = result.filter(
        (word) =>
          word.english.toLowerCase().includes(searchText.toLowerCase()) ||
          word.korean.includes(searchText)
      );
    setFilteredWords(result);
  };

  const pagedWords = filteredWords.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>📚 단어장</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem', justifyContent: 'center' }}>
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
          <button key={letter} onClick={() => handleLetterFilter(letter)} style={{
            padding: '0.5rem 0.7rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: selectedLetter === letter ? '#339af0' : '#f8f9fa',
            color: selectedLetter === letter ? '#fff' : '#000',
            cursor: 'pointer',
          }}>{letter}</button>
        ))}
        <button onClick={() => handleLetterFilter('')} style={{ padding: '0.5rem 0.7rem', borderRadius: '6px', border: '1px solid #ccc', background: '#f03e3e', color: '#fff', cursor: 'pointer' }}>초기화</button>
      </div>

      <input
        type="text"
        placeholder="🔍 단어를 검색하세요"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc' }}
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

            {/* 🔽 북마크 버튼: 관리자 계정은 숨김 */}
            {!isAdmin && (
              <button
                onClick={() => toggleBookmark(word._id)}
                disabled={loadingIds.includes(word._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: loadingIds.includes(word._id) ? 'wait' : 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                {bookmarkedIds.includes(word._id) ? '⭐' : '☆'}
              </button>
            )}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ padding: '0.5rem 1rem', marginRight: '5px', borderRadius: '6px', border: '1px solid #ccc', background: '#f8f9fa' }}>이전</button>
        <span> {page} / {Math.ceil(filteredWords.length / pageSize)} </span>
        <button disabled={page * pageSize >= filteredWords.length} onClick={() => setPage(page + 1)} style={{ padding: '0.5rem 1rem', marginLeft: '5px', borderRadius: '6px', border: '1px solid #ccc', background: '#f8f9fa' }}>다음</button>
      </div>
    </div>
  );
};

export default WordList;
