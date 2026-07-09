import React from 'react';

const Loader = ({ message = 'Loading data...' }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export default Loader;
