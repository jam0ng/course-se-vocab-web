import React, { useEffect, useState } from 'react';

const WordList = () => {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [page, setPage] = useState(1);
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('bookmarks') || '[]'));

  const pageSize = 20;

  useEffect(() => {
    fetch('http://localhost:5000/api/words')
      .then(res => res.json())
      .then(data => {
        setWords(data);
        setFilteredWords(data);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (id) => {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
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

    if (letter) {
      result = result.filter(word => word.english.toLowerCase().startsWith(letter.toLowerCase()));
    }

    if (searchText) {
      result = result.filter(word =>
        word.english.toLowerCase().includes(searchText.toLowerCase()) ||
        word.korean.includes(searchText)
      );
    }

    setFilteredWords(result);
  };

  const pagedWords = filteredWords.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>📚 단어장</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem', justifyContent: 'center' }}>
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
          <button key={letter} onClick={() => handleLetterFilter(letter)} style={{ padding: '0.5rem 0.7rem', borderRadius: '6px', border: '1px solid #ccc', background: selectedLetter === letter ? '#339af0' : '#f8f9fa', color: selectedLetter === letter ? '#fff' : '#000', cursor: 'pointer' }}>{letter}</button>
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
        {pagedWords.map(word => (
          <li key={word._id} style={{ padding: '0.8rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.1rem' }}>{word.english}</strong> <span style={{ color: '#888' }}>- {word.korean}</span>
            </div>
            <button onClick={() => toggleBookmark(word._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
              {bookmarks.includes(word._id) ? '⭐' : '☆'}
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ padding: '0.5rem 1rem', marginRight: '5px', borderRadius: '6px', border: '1px solid #ccc', background: '#f8f9fa', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>이전</button>
        <span> {page} / {Math.ceil(filteredWords.length / pageSize)} </span>
        <button disabled={page * pageSize >= filteredWords.length} onClick={() => setPage(page + 1)} style={{ padding: '0.5rem 1rem', marginLeft: '5px', borderRadius: '6px', border: '1px solid #ccc', background: '#f8f9fa', cursor: page * pageSize >= filteredWords.length ? 'not-allowed' : 'pointer' }}>다음</button>
      </div>
    </div>
  );
};

export default WordList;
