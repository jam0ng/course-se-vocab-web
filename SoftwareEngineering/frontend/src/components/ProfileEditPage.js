import React, { useState, useEffect } from 'react';

const ProfileEditPage = () => {
  const [username, setUsername] = useState('');       // 현재 닉네임
  const [newUsername, setNewUsername] = useState(''); // 새 닉네임 입력
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (storedToken) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            setUsername(data.username);
          }
        })
        .catch(() => {
          setMessage('❌ 사용자 정보를 불러오는 데 실패했습니다.');
        });
    } else {
      setMessage('❌ 로그인 정보가 없습니다. 다시 로그인해주세요.');
    }
  }, []);

  const handleProfileUpdate = async () => {
    if (!token) return setMessage('❌ 인증 토큰이 없습니다.');
    if (!newUsername) return setMessage('❌ 새 닉네임을 입력해주세요.');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      const data = await res.json();
      if (res.ok) {
        setUsername(newUsername);
        setNewUsername('');
        setMessage('✅ 닉네임이 수정되었습니다.');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ 닉네임 수정 중 오류 발생');
    }
  };

  const handlePasswordChange = async () => {
    if (!token) return setMessage('❌ 인증 토큰이 없습니다.');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      setMessage(res.ok ? '✅ 비밀번호가 변경되었습니다.' : `❌ ${data.message}`);
    } catch (err) {
      setMessage('❌ 비밀번호 변경 중 오류 발생');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>👤 마이페이지</h2>

      <div style={{ marginBottom: '2rem' }}>
        <h3>현재 닉네임</h3>
        <p style={{ fontSize: '1.2rem', color: '#2f9e44', fontWeight: 'bold' }}>{username || '불러오는 중...'}</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>닉네임 수정</h3>
        <input
          type="text"
          placeholder="새 닉네임"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          style={{
            padding: '0.7rem',
            marginRight: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleProfileUpdate}
          style={{
            padding: '0.7rem 1.2rem',
            borderRadius: '6px',
            background: '#339af0',
            color: '#fff',
            border: 'none',
          }}
        >
          변경
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>비밀번호 변경</h3>
        <input
          type="password"
          placeholder="현재 비밀번호"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          style={{
            padding: '0.7rem',
            marginRight: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{
            padding: '0.7rem',
            marginRight: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handlePasswordChange}
          style={{
            padding: '0.7rem 1.2rem',
            borderRadius: '6px',
            background: '#51cf66',
            color: '#fff',
            border: 'none',
          }}
        >
          변경
        </button>
      </div>

      {message && <p style={{ marginTop: '1rem', color: '#444' }}>{message}</p>}
    </div>
  );
};

export default ProfileEditPage;
