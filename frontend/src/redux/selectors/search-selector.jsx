import { createSelector } from '@reduxjs/toolkit';
const selectSearchState = (state) => state.search;

export const selectSearchQuery = createSelector(
    [selectSearchState],
    (search) => search.query
);

export const selectSearchIsOpen = createSelector(
    [selectSearchState],
    (search) => search.isOpen
);

export const selectSearchResults = createSelector(
    [selectSearchState],
    (search) => search.results
);

export const selectSearchRecentSearches = createSelector(
    [selectSearchState],
    (search) => search.recentSearches
);

export const selectSearchLoading = createSelector(
    [selectSearchState],
    (search) => search.isLoading
);

export const selectSearchError = createSelector(
    [selectSearchState],
    (search) => search.error
);