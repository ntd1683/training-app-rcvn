const CustomPagination = ({ rowsPerPage, rowCount, onChangePage, onChangeRowsPerPage, currentPage }) => {
  const pageCount = Math.ceil(rowCount / rowsPerPage);
  const maxPagesToShow = 5;

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

    if (endPage < pageCount) {
      if (endPage < pageCount - 1) {
        pages.push('...');
      }
      pages.push(pageCount);
    }

    if (startPage > 1) {
      pages.unshift(1);
      if (startPage > 2) {
        pages.splice(1, 0, '...');
      }
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 px-3">
      <div className="d-flex align-items-center gap-2">
        <span>Hiển thị</span>
        <select
          className="form-select"
          value={rowsPerPage}
          onChange={e => {
            const newRowsPerPage = Number(e.target.value);
            onChangeRowsPerPage(newRowsPerPage);
          }}
          style={{ width: '80px' }}
        >
          {[10, 15, 20].map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>mỗi trang</span>
      </div>
      <nav aria-label="Page navigation">
        <ul className="pagination mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onChangePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
          </li>
          {getPageNumbers().map((page, index) => (
            <li
              key={index}
              className={`page-item ${page === currentPage ? 'active' : ''} ${
                page === '...' ? 'disabled' : ''
              }`}
            >
              <button
                className="page-link"
                onClick={() => page !== '...' && onChangePage(page)}
                disabled={page === '...'}
              >
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === pageCount ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onChangePage(currentPage + 1)}
              disabled={currentPage === pageCount}
            >
              »
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CustomPagination;