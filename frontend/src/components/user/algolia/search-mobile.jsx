import React from 'react';
import { SearchDropdown } from './search-dropdown';
import { useSearchAlgolia } from '~/hooks/user/use-search-algolia';

export const SearchMobile = ({ toggleMobileSearch }) => {
  const {
    localQuery,
    handleFocus,
    handleInputChange,
    handleSearchClick,
    handleKeyPress,
    searchRefMobile
  } = useSearchAlgolia({ 
    isMobile: true, 
    toggleMobileSearch 
  });

  // const handleOverlayClick = (e) => {
  //   if (e.target.classList.contains('mobile-search-overlay')) {
  //     toggleMobileSearch();
  //   }
  // };

  return (
    <div className="mobile-search-overlay d-md-none">
      <div className="container">
        <div className="mobile-search-content" onClick={(e) => e.stopPropagation()}>
          <div className="navbar-search search-style-5 d-flex position-relative" ref={searchRefMobile}>
            <div className="search-input">
              <input
                type="text"
                name="search_mobile"
                placeholder="Tìm Kiếm..."
                value={localQuery}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyPress}
                autoComplete="off"
                autoFocus
              />
            </div>
            <div className="search-btn">
              <button className="main-btn" onClick={handleSearchClick}>
                <i className="lni lni-search-alt"></i>
              </button>
            </div>
            <button
              className="close-search"
              onClick={toggleMobileSearch}
              aria-label="Close search"
            >
              <i className="lni lni-close"></i>
            </button>
            <SearchDropdown toggleMobileSearch={toggleMobileSearch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchMobile;