import React from 'react';

export const CustomPagination = ({ 
  rowsPerPage = 10, 
  rowCount = 0, 
  onChangePage, 
  onChangeRowsPerPage, 
  currentPage = 1,
  showRowsPerPage = true,
  rowsPerPageOptions = [10, 15, 20],
  maxPagesToShow = 5,
  showInfo = true
}) => {
  const pageCount = Math.ceil(rowCount / rowsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    let startPage, endPage;

    if (pageCount <= maxPagesToShow) {
      startPage = 1;
      endPage = pageCount;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + maxPagesAfterCurrent >= pageCount) {
        startPage = pageCount - maxPagesToShow + 1;
        endPage = pageCount;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Thêm dấu ... và trang cuối nếu cần
    if (endPage < pageCount) {
      if (endPage < pageCount - 1) {
        pages.push('...');
      }
      pages.push(pageCount);
    }

    // Thêm trang đầu và dấu ... nếu cần
    if (startPage > 1) {
      pages.unshift(1);
      if (startPage > 2) {
        pages.splice(1, 0, '...');
      }
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage && page >= 1 && page <= pageCount) {
      onChangePage && onChangePage(page);
    }
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    onChangeRowsPerPage && onChangeRowsPerPage(newRowsPerPage);
  };

  if (pageCount <= 1 && !showRowsPerPage && !showInfo) {
    return null;
  }

  return (
    <div className="col-12">
      {(showRowsPerPage || showInfo) && (
        <div className="d-flex justify-content-end align-items-center my-3 flex-wrap">
          {showRowsPerPage && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted">Hiển thị</span>
              <select
                className="form-select form-perpage form-select-sm"
                value={rowsPerPage}
                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                style={{ width: 'auto', minWidth: '70px' }}
              >
                {rowsPerPageOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="text-muted">mỗi trang</span>
            </div>
          )}
        </div>
      )}

      {pageCount > 1 && (
        <div className="pagination center">
          <ul className="pagination-list">
            {/* Nút Previous */}
            {currentPage > 1 && (
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageClick(currentPage - 1);
                  }}
                >
                  <i className="lni lni-chevron-left"></i>
                </a>
              </li>
            )}

            {/* Các số trang */}
            {getPageNumbers().map((page, index) => (
              <li 
                key={index} 
                className={page === currentPage ? 'active' : ''}
              >
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageClick(page);
                  }}
                  style={{
                    cursor: page === '...' ? 'default' : 'pointer',
                    pointerEvents: page === '...' ? 'none' : 'auto'
                  }}
                >
                  {page}
                </a>
              </li>
            ))}

            {/* Nút Next */}
            {currentPage < pageCount && (
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageClick(currentPage + 1);
                  }}
                >
                  <i className="lni lni-chevron-right"></i>
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};