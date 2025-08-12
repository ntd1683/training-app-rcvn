import React from 'react';
import { SearchDropdown } from './search-dropdown';
import { useSearchAlgolia } from '~/hooks/user/use-search-algolia';

export const SearchDesktop = () => {
  const {
    localQuery,
    handleFocus,
    handleInputChange,
    handleSearchClick,
    handleKeyPress,
    searchRefDesktop
  } = useSearchAlgolia({ isMobile: false });

  return (
    <div className="col-lg-5 col-md-7 d-none d-md-block">
      <div className="main-menu-search">
        <div className="navbar-search search-style-5 position-relative" ref={searchRefDesktop}>
          <div className="search-input">
            <input 
              type="text" 
              placeholder="Tìm Kiếm..." 
              value={localQuery}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyPress}
              autoComplete="off"
            />
          </div>
          <div className="search-btn">
            <button onClick={handleSearchClick}>
              <i className="lni lni-search-alt"></i>
            </button>
          </div>

          <SearchDropdown />
        </div>
      </div>
    </div>
  );
};

export default SearchDesktop;