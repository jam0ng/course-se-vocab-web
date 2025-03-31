import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminWordManager = () => {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editingWord, setEditingWord] = useState(null);
  const [english, setEnglish] = useState('');
  const [korean, setKorean] = useState('');
  const [example, setExample] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const pageSize = 20;

  useEffect(() => {
    fetchWords();
  }, []);

  useEffect(() => {
    handleSearch(search);
  }, [words, search]);

  const fetchWords = async () => {
    const res = await fetch('http://localhost:5000/api/words');
    const data = await res.json();
    const sorted = data.sort((a, b) => a.english.localeCompare(b.english));
    setWords(sorted);
  };

  const handleSearch = (text) => {
    const result = words.filter(word =>
      word.english.toLowerCase().includes(text.toLowerCase()) ||
      word.korean.includes(text)
    );
    setFilteredWords(result);
    setPage(1);
  };

  const handleAdd = async () => {
    if (!english || !korean || !example) {
      return setMessage('❌ 영어, 한글 뜻, 예문을 모두 입력해주세요.');
    }

    const res = await fetch('http://localhost:5000/api/admin/words/add', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ english, korean, example })
    });

    if (res.ok) {
      setMessage('✅ 단어 추가 완료');
      setEnglish('');
      setKorean('');
      setExample('');
      fetchWords();
    } else {
      const data = await res.json();
      setMessage(`❌ ${data.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제할까요?')) return;
    await fetch(`http://localhost:5000/api/admin/words/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchWords();
  };

  const startEdit = (word) => setEditingWord({ ...word });

  const handleEditSubmit = async () => {
    if (!editingWord) return;
    await fetch(`http://localhost:5000/api/admin/words/edit/${editingWord._id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editingWord),
    });
    setEditingWord(null);
    fetchWords();
  };

  const pagedWords = filteredWords.slice((page - 1) * pageSize, page * pageSize);

  const buttonStyle = {
    padding: '0.5rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    background: '#f8f9fa',
    cursor: 'pointer',
    transition: '0.2s',
    marginRight: '5px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: '#339af0',
    color: '#fff',
    border: 'none'
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: 'auto' }}>
      <h2>🛠️ 관리자 단어 관리</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
        <input placeholder="영어 단어" value={english} onChange={e => setEnglish(e.target.value)} style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc' }} />
        <input placeholder="한글 뜻" value={korean} onChange={e => setKorean(e.target.value)} style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc' }} />
      </div>

      <input placeholder="예문" value={example} onChange={e => setExample(e.target.value)}
        style={{ width: '100%', padding: '0.7rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc' }} />

      <button onClick={handleAdd} style={primaryButtonStyle}>단어 추가</button>

      <p style={{ color: '#888', marginTop: '1rem' }}>{message}</p>

      <input placeholder="단어 검색 (영어/한글)" value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '0.7rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc' }} />

      <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f3f5' }}>
            <tr>
              <th style={{ padding: '0.8rem' }}>영어</th>
              <th>한글</th>
              <th>예문</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {pagedWords.map(word => (
              <tr key={word._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.6rem' }}>{word.english}</td>
                <td>{word.korean}</td>
                <td>{word.example}</td>
                <td>
                  <button onClick={() => startEdit(word)} style={buttonStyle}>수정</button>
                  <button onClick={() => handleDelete(word._id)} style={buttonStyle}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem' }}>
        페이지: {page} / {Math.ceil(filteredWords.length / pageSize)}
        <br />
        <button disabled={page === 1} onClick={() => setPage(page - 1)} style={buttonStyle}>이전</button>
        <button disabled={page * pageSize >= filteredWords.length} onClick={() => setPage(page + 1)} style={buttonStyle}>다음</button>
      </div>

      {editingWord && (
        <div onClick={() => setEditingWord(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '400px' }}>
            <h3>단어 수정</h3>
            <input value={editingWord.english} onChange={e => setEditingWord({ ...editingWord, english: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
            <input value={editingWord.korean} onChange={e => setEditingWord({ ...editingWord, korean: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
            <textarea value={editingWord.example} onChange={e => setEditingWord({ ...editingWord, example: e.target.value })} style={{ width: '100%', padding: '0.5rem', height: '80px' }} />
            <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
              <button onClick={handleEditSubmit} style={primaryButtonStyle}>수정 완료</button>
              <button onClick={() => setEditingWord(null)} style={buttonStyle}>취소</button>
            </div>
          </div>
        </div>
      )}

        <button onClick={() => navigate('/')} style={{ ...buttonStyle, marginTop: '1rem' }}>메인으로</button>
    </div>
  );
};

export default AdminWordManager;

    