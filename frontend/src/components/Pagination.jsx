import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, limit, totalRecords, onPageChange }) => {
  const startRecord = totalRecords === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, totalRecords);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalRecords === 0) return null;

  return (
    <div className="pagination-container">
      <div className="subtitle" style={{ fontSize: '0.85rem' }}>
        Showing <span style={{ color: '#fff', fontWeight: 600 }}>{startRecord}</span> to{' '}
        <span style={{ color: '#fff', fontWeight: 600 }}>{endRecord}</span> of{' '}
        <span style={{ color: '#fff', fontWeight: 600 }}>{totalRecords}</span> records
      </div>
      
      <div className="pagination-controls">
        <button
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.65rem' }}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        
        {getPageNumbers().map((num) => (
          <button
            key={num}
            className={`btn ${page === num ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              padding: '0.4rem 0.8rem',
              minWidth: '32px',
              border: page === num ? 'none' : '1px solid var(--border-color)'
            }}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}
        
        <button
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.65rem' }}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
