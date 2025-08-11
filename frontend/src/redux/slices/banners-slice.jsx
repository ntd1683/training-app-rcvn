import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBanners } from '~/services/api';

// Async thunks
export const loadBanners = createAsyncThunk(
    'banners/loadBanners',
    async ({ page = 1, perPage = 10, filters = {} }, { rejectWithValue }) => {
        try {
            const response = await fetchBanners(page, perPage, filters);
            if (response.success) {
                return {
                    data: response.data,
                    pagination: {
                        current_page: page,
                        per_page: response.pagination?.total > 20 ? response.pagination.per_page : perPage,
                        total: response.pagination?.total || 0,
                        last_page: response.pagination?.last_page || 1,
                        from: response.pagination?.from || 0,
                        to: response.pagination?.to || 0,
                    }
                };
            } else {
                throw new Error('Lỗi khi lấy danh sách banner');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadSlideBanners = createAsyncThunk(
    'banners/loadSlideBanners',
    async ({limit}, { rejectWithValue }) => {
        try {
            const response = await fetchBanners(1, limit, { type: 1 });
            if (response.success) {
                return {
                    data: response.data,
                };
            } else {
                throw new Error('Lỗi khi lấy danh sách banner slide');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadStaticBanners = createAsyncThunk(
    'banners/loadStaticBanners',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchBanners(1, 5, { type: 2 });
            if (response.success) {
                return {
                    data: response.data,
                };
            } else {
                throw new Error('Lỗi khi lấy danh sách banner tĩnh');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadTextBanners= createAsyncThunk(
    'banners/loadTextBanners',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchBanners(1, 1, { type: 3 });
            if (response.success) {
                return {
                    data: response.data,
                };
            } else {
                throw new Error('Lỗi khi lấy danh sách banner chữ');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadAdsBannersCheckout = createAsyncThunk(
    'banners/loadAdsBannersCheckout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchBanners(1, 1, { type: 4 });
            if (response.success) {
                return {
                    data: response.data,
                };
            } else {
                throw new Error('Lỗi khi lấy danh sách banner ads checkout');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Initial state
const initialState = {
    data: [],
    dataSlide: [],
    dataStatic: [],
    dataText: [],
    dataAdsCheckout: [],
    pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
    },
    filters: {
        type: '',
    },
    sorting: {
        sortBy: '',
        sortOrder: '',
        sortClickCount: {},
        lastSortedColumn: '',
    },
    loading: {
        isLoading: false,
        isLoadingSlide: false,
        isLoadingStatic: false,
        isLoadingText: false,
        isLoadingAdsCheckout: false,
    },
    error: null,
    tableKey: 0,
};

const bannerSlice = createSlice({
    name: 'banners',
    initialState,
    reducers: {
        // Filter actions
        setFilterType: (state, action) => {
            state.filters.type = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        
        resetFilters: (state) => {
            state.filters = {
                type: '',
            };
        },

        // Sorting actions
        setSorting: (state, action) => {
            const { sortBy, sortOrder } = action.payload;

            if (state.sorting.lastSortedColumn !== sortBy) {
                state.sorting.sortClickCount = { [sortBy]: 1 };
                state.sorting.lastSortedColumn = sortBy;
            } else {
                const currentCount = state.sorting.sortClickCount[sortBy] || 0;
                const nextCount = currentCount + 1;

                if (nextCount >= 3) {
                    state.sorting = {
                        sortBy: '',
                        sortOrder: '',
                        sortClickCount: {},
                        lastSortedColumn: '',
                    };
                    state.tableKey += 1;
                    return;
                }

                state.sorting.sortClickCount = { [sortBy]: nextCount };
            }

            state.sorting.sortBy = sortBy;
            state.sorting.sortOrder = sortOrder;
        },
        resetSorting: (state) => {
            state.sorting = {
                sortBy: '',
                sortOrder: '',
                sortClickCount: {},
                lastSortedColumn: '',
            };
            state.tableKey += 1;
        },

        // UI actions
        incrementTableKey: (state) => {
            state.tableKey += 1;
        },

        // Error actions
        clearErrors: (state) => {
            state.error = null;
        },

        updateBannerInList: (state, action) => {
            const { bannerId, updates } = action.payload;
            const bannerIndex = state.data.findIndex(banner => banner.id === bannerId);
            if (bannerIndex !== -1) {
                state.data[bannerIndex] = { ...state.data[bannerIndex], ...updates };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Load banners
            .addCase(loadBanners.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadBanners.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(loadBanners.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.payload;
            })

            .addCase(loadSlideBanners.pending, (state) => {
                state.loading.isLoadingSlide = true;
                state.error = null;
            })
            .addCase(loadSlideBanners.fulfilled, (state, action) => {
                state.loading.isLoadingSlide = false;
                state.dataSlide = action.payload.data;
                state.error = null;
            })
            .addCase(loadSlideBanners.rejected, (state, action) => {
                state.loading.isLoadingSlide = false;
                state.dataSlide = [];
                state.error = action.payload;
            })

            .addCase(loadStaticBanners.pending, (state) => {
                state.loading.isLoadingStatic = true;
                state.error = null;
            })
            .addCase(loadStaticBanners.fulfilled, (state, action) => {
                state.loading.isLoadingStatic = false;
                state.dataStatic = action.payload.data;
                state.error = null;
            })
            .addCase(loadStaticBanners.rejected, (state, action) => {
                state.loading.isLoadingStatic = false;
                state.dataStatic = [];
                state.error = action.payload;
            })

            .addCase(loadTextBanners.pending, (state) => {
                state.loading.isLoadingText = true;
                state.error = null;
            })
            .addCase(loadTextBanners.fulfilled, (state, action) => {
                state.loading.isLoadingText = false;
                state.dataText = action.payload.data;
                state.error = null;
            })
            .addCase(loadTextBanners.rejected, (state, action) => {
                state.loading.isLoadingText = false;
                state.dataText = [];
                state.error = action.payload;
            })

            .addCase(loadAdsBannersCheckout.pending, (state) => {
                state.loading.isLoadingAdsCheckout = true;
                state.error = null;
            })
            .addCase(loadAdsBannersCheckout.fulfilled, (state, action) => {
                state.loading.isLoadingAdsCheckout = false;
                state.dataAdsCheckout = action.payload.data;
                state.error = null;
            })
            .addCase(loadAdsBannersCheckout.rejected, (state, action) => {
                state.loading.isLoadingAdsCheckout = false;
                state.dataAdsCheckout = [];
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    setFilterType,
    resetFilters,
    setSorting,
    clearErrors,
    resetSorting,
} = bannerSlice.actions;

export default bannerSlice.reducer;