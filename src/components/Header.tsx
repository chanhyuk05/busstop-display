import React from 'react';

const Header: React.FC = () => {
  return (
    <div style={{
      background: '#1e40af',
      color: 'white',
      padding: '24px 20px',
      borderBottom: '2px solid #e5e7eb'
    }}>
      <h1 style={{ 
        margin: '0',
        fontSize: '28px',
        fontWeight: '700',
        textAlign: 'center'
      }}>
        숙대입구
      </h1>
    </div>
  );
};

export default Header;
