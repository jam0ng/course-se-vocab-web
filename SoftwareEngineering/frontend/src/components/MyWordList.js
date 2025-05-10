import React, { useEffect, useState } from 'react';

const MyWordList = () => {
  const [myWords, setMyWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loadingIds, setLoadingIds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageSize = 20;

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBookmarkedWords();
  }, []);

  const fetchBookmarkedWords = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookmarks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) return handleUnauthorized();

      const data = await res.json(); // 단어 정보 배열
      setMyWords(data);
      setFilteredWords(data);
    } catch (err) {
      setError('북마크 단어를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnauthorized = () => {
    alert('🔒 로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleSearch = (text) => {
    setSearch(text);
    setPage(1);
    const result = myWords.filter(
      (word) =>
        word.english.toLowerCase().includes(text.toLowerCase()) ||
        word.korean.includes(text)
    );
    setFilteredWords(result);
  };

  const handleRemoveBookmark = async (id) => {
    if (loadingIds.includes(id)) return;

    setLoadingIds((prev) => [...prev, id]);
    setError(null);

    try {
      const res = await fetch(`http://localhost:5000/api/bookmarks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return handleUnauthorized();

      if (res.ok) {
        const updated = myWords.filter((word) => word._id !== id);
        setMyWords(updated);
        setFilteredWords((prev) => prev.filter((word) => word._id !== id));
      } else {
        setError('북마크 삭제에 실패했습니다.');
      }
    } catch {
      setError('북마크 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoadingIds((prev) => prev.filter((bid) => bid !== id));
    }
  };

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
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>⭐ 나만의 단어장</h2>

      {loading && <p>📦 불러오는 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && filteredWords.length === 0 && <p>📭 북마크된 단어가 없습니다.</p>}

      <input
        type="text"
        placeholder="🔍 북마크된 단어 검색"
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
            <button
              onClick={() => handleRemoveBookmark(word._id)}
              disabled={loadingIds.includes(word._id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: loadingIds.includes(word._id) ? 'wait' : 'pointer',
                fontSize: '1.2rem',
              }}
              title="북마크 해제"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {filteredWords.length > 0 && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{
              padding: '0.5rem 1rem',
              marginRight: '5px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: '#f8f9fa',
              cursor: 'pointer'
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
              background: '#f8f9fa',
              cursor: 'pointer'
            }}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default MyWordList;
