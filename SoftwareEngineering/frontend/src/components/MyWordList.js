import React, { useEffect, useState } from 'react';

const MyWordList = () => {
  const [myWords, setMyWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pageSize = 20;

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookmarkedWords = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/bookmarks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) return handleUnauthorized();

        const data = await res.json();

        // ✅ 알파벳순 정렬
        const sorted = data.sort((a, b) => a.english.localeCompare(b.english));
        setMyWords(sorted);
        setFilteredWords(sorted);
      } catch (err) {
        setError('북마크 단어를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedWords();
  }, [token]);

  const handleUnauthorized = () => {
    alert('세션이 만료되어 로그아웃되었습니다.');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleSearch = (text) => {
    setSearch(text);
    const result = myWords.filter(
      (word) =>
        word.english.toLowerCase().includes(text.toLowerCase()) ||
        word.korean.includes(text)
    );
    setFilteredWords(result);
    setPage(1);
  };

  const handleDelete = async (wordId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/bookmarks/${wordId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const updated = myWords.filter((w) => w._id !== wordId);
        setMyWords(updated);
        setFilteredWords(updated);
      } else {
        alert('삭제 실패');
      }
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const pagedWords = filteredWords.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🌟 나만의 단어장</h2>

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
          border: '1px solid #ccc',
        }}
      />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {pagedWords.map((word) => (
          <li
            key={word._id}
            style={{
              padding: '0.8rem',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong style={{ fontSize: '1.1rem' }}>{word.english}</strong>{' '}
              <span style={{ color: '#888' }}>- {word.korean}</span>
            </div>
            <button
              onClick={() => handleDelete(word._id)}
              style={{
                background: '#fff5f5',
                color: '#f03e3e',
                border: '1px solid #f03e3e',
                padding: '0.4rem 0.7rem',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              삭제
            </button>
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
            background: '#f8f9fa',
          }}
        >
          이전
        </button>
        <span>
          {' '}
          {page} / {Math.ceil(filteredWords.length / pageSize)}{' '}
        </span>
        <button
          disabled={page * pageSize >= filteredWords.length}
          onClick={() => setPage(page + 1)}
          style={{
            padding: '0.5rem 1rem',
            marginLeft: '5px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: '#f8f9fa',
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MyWordList;
