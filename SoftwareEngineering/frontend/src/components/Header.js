// src/components/Header.js

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const buttonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    background: '#f8f9fa',
    cursor: 'pointer',
    transition: '0.2s',
    fontSize: '0.95rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      background: '#f1f3f5',
      borderBottom: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      marginBottom: '1rem'
    }}>
      {/* 왼쪽 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {!isHome && (
          <button
            style={buttonStyle}
            onClick={() => navigate(-1)}
            onMouseOver={e => e.target.style.background = '#e9ecef'}
            onMouseOut={e => e.target.style.background = '#f8f9fa'}
          >
            ◀ 뒤로가기
          </button>
        )}
        <button
          style={buttonStyle}
          onClick={() => navigate('/')}
          onMouseOver={e => e.target.style.background = '#e9ecef'}
          onMouseOut={e => e.target.style.background = '#f8f9fa'}
        >
          🏠 홈
        </button>
      </div>

      {/* 오른쪽 */}
      <div>
        <button
          style={buttonStyle}
          onClick={() => navigate('/mypage')}
          onMouseOver={e => e.target.style.background = '#e9ecef'}
          onMouseOut={e => e.target.style.background = '#f8f9fa'}
        >
          마이페이지
        </button>
      </div>
    </div>
  );
};

export default Header;
