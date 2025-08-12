import React from 'react';

export const RecentSearchItem = ({ searchTerm, onClick, onRemove }) => {
  return (
    <div 
      className="px-3 py-2 cursor-pointer hover-bg-light border-bottom d-flex justify-content-between align-items-center"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex align-items-center">
        <i className="lni lni-clock me-2 text-muted"></i>
        <span>{searchTerm}</span>
      </div>
      <button
        className="btn btn-sm text-muted hover-text-danger"
        onClick={onRemove}
        style={{ border: 'none', background: 'none', padding: '2px 6px' }}
        title="Xóa khỏi lịch sử"
      >
        <i className="lni lni-close" style={{ fontSize: '12px' }}></i>
      </button>
    </div>
  );
};