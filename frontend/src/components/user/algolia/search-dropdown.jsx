import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addRecentSearch, removeRecentSearch, setIsOpen } from '~/redux/slices/search-slice';
import {
  selectSearchResults,
  selectSearchRecentSearches,
  selectSearchQuery,
  selectSearchLoading,
  selectSearchIsOpen,
  selectSearchError
} from '~/redux/selectors/search-selector';
import { SearchResultItem } from './search-result-item';
import { RecentSearchItem } from './recent-search-item';
import { useNavigate } from 'react-router-dom';

export const SearchDropdown = ({toggleMobileSearch}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const results = useSelector(selectSearchResults);
  const recentSearches = useSelector(selectSearchRecentSearches);
  const query = useSelector(selectSearchQuery);
  const isLoading = useSelector(selectSearchLoading);
  const isOpen = useSelector(selectSearchIsOpen);
  const error = useSelector(selectSearchError);

  const handleSearchAll = () => {
    if (query.trim()) {
      dispatch(addRecentSearch(query));
      dispatch(setIsOpen(false));
      if (toggleMobileSearch) 
        toggleMobileSearch();
      navigate(`/shop?name=${encodeURIComponent(query)}`);
    }
  };

  const handleRecentSearchClick = (searchTerm) => {
    dispatch(setIsOpen(false));
      if (toggleMobileSearch) 
        toggleMobileSearch();
    navigate(`/shop?name=${encodeURIComponent(searchTerm)}`);
  };

  const handleRemoveRecentSearch = (e, searchTerm) => {
    e.stopPropagation();
    dispatch(removeRecentSearch(searchTerm));
  };

  if (!isOpen) return null;

  return (
    <div className="search-dropdown position-absolute w-100 bg-white border rounded shadow-lg mt-1" 
         style={{ zIndex: 1050, overflowY: 'auto' }}>
      
      {/* Loading State */}
      {isLoading && (
        <div className="p-3 text-center">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Đang tìm kiếm...</span>
          </div>
          <span className="ms-2">Đang tìm kiếm...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-3 text-center text-danger">
          <i className="lni lni-warning mb-2 d-block" style={{ fontSize: '2rem' }}></i>
          <div>Có lỗi xảy ra khi tìm kiếm</div>
          <small className="text-muted">{error}</small>
        </div>
      )}

      {/* Search Results */}
      {!isLoading && !error && query && results.length > 0 && (
        <>
          <div className="px-3 py-2 bg-light border-bottom d-flex justify-content-between align-items-center">
            <small className="text-muted">Sản phẩm tìm thấy</small>
            <small className="text-muted">{results.length} kết quả</small>
          </div>
          
          {results.map((product) => (
            <SearchResultItem
              key={product.objectID}
              product={product}
              toggleMobileSearch={toggleMobileSearch}
            />
          ))}
          
          {/* Search All Option */}
          <div 
            className="px-3 py-2 border-top cursor-pointer hover-bg-light bg-light"
            onClick={handleSearchAll}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center justify-content-center">
              <i className="lni lni-search-alt me-2 text-primary"></i>
              <span className="text-primary fw-bold">
                Xem tất cả kết quả cho &quot;<strong>{query}</strong>&quot;
              </span>
            </div>
          </div>
        </>
      )}

      {/* No Results */}
      {!isLoading && !error && query && results.length === 0 && (
        <div className="p-4 text-center text-muted">
          <i className="lni lni-search-alt mb-2 d-block" style={{ fontSize: '2.5rem', opacity: 0.5 }}></i>
          <div className="mb-2">Không tìm thấy sản phẩm nào</div>
          <div 
            className="btn btn-outline-primary btn-sm"
            onClick={handleSearchAll}
            style={{ cursor: 'pointer' }}
          >
            Tìm kiếm với từ khóa &quot;<strong>{query}</strong>&quot;
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <>
          <div className="px-3 py-2 bg-light border-bottom d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <i className="lni lni-clock me-1"></i>
              Tìm kiếm gần đây
            </small>
            <button 
              className="btn btn-sm text-muted"
              onClick={() => {
                recentSearches.forEach(search => dispatch(removeRecentSearch(search)));
              }}
              style={{ fontSize: '11px', padding: '2px 6px' }}
            >
              Xóa tất cả
            </button>
          </div>
          {recentSearches.map((searchTerm, index) => (
            <RecentSearchItem
              key={`${searchTerm}-${index}`}
              searchTerm={searchTerm}
              onClick={() => handleRecentSearchClick(searchTerm)}
              onRemove={(e) => handleRemoveRecentSearch(e, searchTerm)}
            />
          ))}
        </>
      )}

      {/* Empty State */}
      {!query && recentSearches.length === 0 && (
        <div className="p-4 text-center text-muted">
          <i className="lni lni-search-alt mb-2 d-block" style={{ fontSize: '2.5rem', opacity: 0.3 }}></i>
          <div className="mb-1">Nhập từ khóa để tìm kiếm sản phẩm</div>
          <small>Tìm theo tên sản phẩm, mô tả...</small>
        </div>
      )}
    </div>
  );
};