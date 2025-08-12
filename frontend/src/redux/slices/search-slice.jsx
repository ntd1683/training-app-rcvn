import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchProducts } from '~/services/algolia-search';

export const searchProductsAsync = createAsyncThunk(
    'search/searchProducts',
    async (query) => {
        const response = await searchProducts(query);
        return response;
    }
);

const initialState = {
    query: '',
    results: [],
    recentSearches: JSON.parse(localStorage.getItem('recentSearches')) || [],
    isLoading: false,
    isOpen: false,
    error: null,
};

const searchSlice = createSlice({
    name: 'search',
    initialState: initialState,
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        setIsOpen: (state, action) => {
            state.isOpen = action.payload;
        },
        addRecentSearch: (state, action) => {
            const query = action.payload;
            if (query && !state.recentSearches.includes(query)) {
                state.recentSearches = [query, ...state.recentSearches.slice(0, 4)]; // Keep only 5 recent searches
                localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
            }
        },
        removeRecentSearch: (state, action) => {
            state.recentSearches = state.recentSearches.filter(
                (search) => search !== action.payload
            );
            localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
        },
        clearResults: (state) => {
            state.results = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchProductsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchProductsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload;
            })
            .addCase(searchProductsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const {
    setQuery,
    setIsOpen,
    addRecentSearch,
    removeRecentSearch,
    clearResults,
} = searchSlice.actions;

export default searchSlice.reducer;