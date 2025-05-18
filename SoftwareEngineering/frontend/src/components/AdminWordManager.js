import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const fontStyle = { // 전역적으로 사용할 폰트 스타일 객체
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: '1rem',
  fontWeight: '400'
};

const headingStyle = {  // 헤딩(제목) 스타일 객체
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: '1.5rem',
  fontWeight: '700',
  textAlign: 'center',
  marginBottom: '1rem'
};

const AdminWordManager = () => {
  const [words, setWords] = useState([]);                   // 단어 목록 상태
  const [filteredWords, setFilteredWords] = useState([]);   // 검색 후 필터링된 단어 목록 상태
  const [search, setSearch] = useState('');                 // 검색어 상태
  const [page, setPage] = useState(1);                      // 페이지 번호 상태
  const [editingWord, setEditingWord] = useState(null);     // 수정 중인 단어 객체 상태
  const [english, setEnglish] = useState('');               // 입력 폼 상태: 영어
  const [korean, setKorean] = useState('');                 // 입력 폼 상태: 한글
  const [example, setExample] = useState('');               // 입력 폼 상태: 예문
  const [message, setMessage] = useState('');               // 사용자에게 보여줄 메세지 상태
  const navigate = useNavigate();                           // react Router를 이용한 프로그래밍적 페이지 이동 훅?
  const token = localStorage.getItem('token');              // 인증 토큰 로컬스토리지에서서 가져오기

  const pageSize = 20;                                      // 사용자에게 보여줄 단어 개수

  useEffect(() => { // 컴포넌트가 마운트될 때 한 번만 단어 목록을 가져옴
    fetchWords();
  }, []);

  useEffect(() => { // 단어 목록(words)이나 검색어(search)가 변경될 대 필터링 함수 호출
    handleSearch(search);
  }, [words, search]);

  const fetchWords = async () => {  // 서버에서 단어 목록을 가져오는 함수
    const res = await fetch('${process.env.REACT_APP_API_BASE_URL}/api/words');
    const data = await res.json();
    const sorted = data.sort((a, b) => a.english.localeCompare(b.english)); // 영어 단어 오름차순 정렬렬
    setWords(sorted);
  };

  const handleSearch = (text) => {  // 검색어에 기반해 단어 목록을 필터링하는 함수
    const result = words.filter(word =>
      word.english.toLowerCase().includes(text.toLowerCase()) ||
      word.korean.includes(text)
    );
    setFilteredWords(result);
    setPage(1);               // 검색 결과가 바뀌면 페이지를 1로 초기화
  };

  const handleAdd = async () => { // 관리자 권한으로 단어를 추가하는 함수
    if (!english || !korean || !example) {  // 필수 입력값 검증
      return setMessage('❌ 영어, 한글 뜻, 예문을 모두 입력해주세요.');
    }

    const res = await fetch('${process.env.REACT_APP_API_BASE_URL}/api/admin/words/add', {
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
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/words/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchWords();
  };

  const startEdit = (word) => setEditingWord({ ...word });

  const handleEditSubmit = async () => {
    if (!editingWord) return;
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/words/edit/${editingWord._id}`, {
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

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: 'auto',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      ...fontStyle
    }}>
      <h2 style={headingStyle}>🛠️ 관리자 단어 관리</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input placeholder="영어 단어" value={english} onChange={e => setEnglish(e.target.value)} style={{ ...fontStyle, flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input placeholder="한글 뜻" value={korean} onChange={e => setKorean(e.target.value)} style={{ ...fontStyle, flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
        </div>
        <input placeholder="예문" value={example} onChange={e => setExample(e.target.value)} style={{ ...fontStyle, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
        <button onClick={handleAdd} style={{ ...fontStyle, padding: '0.6rem 1.5rem', borderRadius: '6px', background: '#339af0', color: '#fff', border: 'none', fontWeight: 'bold', width: 'fit-content', alignSelf: 'center' }}>단어 추가</button>
        <p style={{ color: '#888', ...fontStyle }}>{message}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          type="text"
          placeholder="🔍 단어를 검색하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...fontStyle,
            padding: '0.8rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', border: '1px solid #ccc', whiteSpace: 'nowrap', ...fontStyle }}>
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '40%' }} />
            <col style={{ width: '8%' }} />
          </colgroup>
          <thead style={{ background: '#f1f3f5' }}>
            <tr>
              <th style={{ padding: '0.8rem', borderRight: '1px solid #ccc' }}>영어</th>
              <th style={{ borderRight: '1px solid #ccc' }}>한글</th>
              <th style={{ borderRight: '1px solid #ccc' }}>예문</th>
              <th style={{ textAlign: 'center' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {pagedWords.map(word => (
              <tr key={word._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.6rem', borderRight: '1px solid #ccc', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{word.english}</td>
                <td style={{ borderRight: '1px solid #ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{word.korean}</td>
                <td style={{ borderRight: '1px solid #ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{word.example}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => startEdit(word)} style={{ ...fontStyle, marginRight: '5px', padding: '0.4rem 0.7rem', borderRadius: '6px', border: '1px solid #ccc', background: '#f8f9fa' }}>수정</button>
                  <button onClick={() => handleDelete(word._id)} style={{ ...fontStyle, padding: '0.4rem 0.7rem', borderRadius: '6px', border: '1px solid #f03e3e', background: '#fff5f5', color: '#f03e3e' }}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center', ...fontStyle }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ ...fontStyle, marginRight: '5px', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ccc', background: '#f8f9fa' }}>이전</button>
        <span> {page} / {Math.ceil(filteredWords.length / pageSize)} </span>
        <button disabled={page * pageSize >= filteredWords.length} onClick={() => setPage(page + 1)} style={{ ...fontStyle, marginLeft: '5px', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ccc', background: '#f8f9fa' }}>다음</button>
      </div>

      {editingWord && (
        <div onClick={() => setEditingWord(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '400px', ...fontStyle }}>
            <h3>단어 수정</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
              <input value={editingWord.english} onChange={e => setEditingWord({ ...editingWord, english: e.target.value })} style={{ ...fontStyle, padding: '0.6rem', marginBottom: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input value={editingWord.korean} onChange={e => setEditingWord({ ...editingWord, korean: e.target.value })} style={{ ...fontStyle, padding: '0.6rem', marginBottom: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
              <textarea value={editingWord.example} onChange={e => setEditingWord({ ...editingWord, example: e.target.value })} style={{ ...fontStyle, padding: '0.6rem', height: '100px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                <button onClick={handleEditSubmit} style={{ ...fontStyle, marginRight: '5px', padding: '0.5rem 1rem', borderRadius: '6px', background: '#339af0', color: '#fff', border: 'none' }}>수정 완료</button>
                <button onClick={() => setEditingWord(null)} style={{ ...fontStyle, padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ccc', background: '#f8f9fa' }}>취소</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWordManager;