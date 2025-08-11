import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById } from '~/services/api';

// Async thunks
export const loadProducts = createAsyncThunk(
    'products/loadProducts',
    async ({ page = 1, perPage = 10, filters = {} }, { rejectWithValue }) => {
        try {
            const response = await fetchProducts(page, perPage, filters);
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
                throw new Error('Lỗi khi lấy danh sách sản phẩm');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadProductsNewest = createAsyncThunk(
    'products/loadProductsNewest',
    async ({ limit }, { rejectWithValue }) => {
        try {
            const response = await fetchProducts(1, limit, { filterStatus: 1, sortBy: 'created_at', sortOrder: 'desc' });
            if (response.success) {
                return {
                    data: response.data,
                };
            } else {
                throw new Error('Lỗi khi lấy danh sách sản phẩm mới nhất');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadProductsBestSeller = createAsyncThunk(
    'products/loadProductsBestSeller',
    async ({ limit }, { rejectWithValue }) => {
        try {
            const response = await fetchProducts(1, limit, { filterStatus: 1, sortBy: 'popular', sortOrder: 'desc' });
            if (response.success) {
                return {
                    data: response.data,
                };
            } else {
                throw new Error('Lỗi khi lấy danh sách sản phẩm bán chạy nhất');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadProduct = createAsyncThunk(
    'product/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetchProductById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin sản phẩm');
        }
    }
);

// Initial state
const initialState = {
    data: [],
    dataNewest: [],
    dataBestSeller: [],
    pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
    },
    filters: {
        name: '',
        priceFrom: '',
        priceTo: '',
        status: '',
    },
    sorting: {
        sortName: '',
        sortBy: '',
        sortOrder: '',
        sortClickCount: {},
        lastSortedColumn: '',
    },
    isLoading: false,
    error: null,
    tableKey: 0,

    currentProduct: {
        id: null,
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        status: '',
        image_url: '',
        created_at: '',
        sold_count: 0,
        author: '',
    },
    currentProductLoading: false,
    currentProductError: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        // Filter actions
        setFilterName: (state, action) => {
            state.filters.name = action.payload;
        },
        setFilterPriceFrom: (state, action) => {
            state.filters.priceFrom = action.payload;
        },
        setFilterPriceTo: (state, action) => {
            state.filters.priceTo = action.payload;
        },
        setFilterStatus: (state, action) => {
            state.filters.status = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        
        resetFilters: (state) => {
            state.filters = {
                name: '',
                priceFrom: '',
                priceTo: '',
                status: '',
            };
        },

        // Sorting actions
        setSorting: (state, action) => {
            const { sortName, sortBy, sortOrder } = action.payload;
            state.sorting.sortName = sortName || '';

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
                sortName: '',
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

        updateProductInList: (state, action) => {
            const { productId, updates } = action.payload;
            const productIndex = state.data.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                state.data[productIndex] = { ...state.data[productIndex], ...updates };
            }
        },

        setCurrentProduct: (state, action) => {
            state.currentProduct = action.payload;
        },
        updateCurrentProduct: (state, action) => {
            state.currentProduct = { ...state.currentProduct, ...action.payload };
        },
        resetCurrentProduct: (state) => {
            state.currentProduct = {
                name: '',
                description: '',
                price: 0,
                quantity: 0,
                status: '',
                image_url: '',
                created_at: '',
                sold_count: 0,
                author: '',
            };
        },
        clearCurrentProductError: (state) => {
            state.currentProductError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Load products
            .addCase(loadProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(loadProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.payload;
            })

            .addCase(loadProductsNewest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadProductsNewest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dataNewest = action.payload.data;
                state.error = null;
            })
            .addCase(loadProductsNewest.rejected, (state, action) => {
                state.isLoading = false;
                state.dataNewest = [];
                state.error = action.payload;
            })

            .addCase(loadProductsBestSeller.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadProductsBestSeller.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dataBestSeller = action.payload.data;
                state.error = null;
            })
            .addCase(loadProductsBestSeller.rejected, (state, action) => {
                state.isLoading = false;
                state.dataBestSeller = [];
                state.error = action.payload;
            })

            // Load single product
            .addCase(loadProduct.pending, (state) => {
                state.currentProductLoading = true;
                state.currentProductError = null;
            })
            .addCase(loadProduct.fulfilled, (state, action) => {
                state.currentProductLoading = false;
                state.currentProduct = action.payload.data || action.payload;
                state.currentProduct.price = parseFloat(state.currentProduct.price) || 0;
                state.currentProductError = null;
            })
            .addCase(loadProduct.rejected, (state, action) => {
                state.currentProductLoading = false;
                state.currentProductError = action.payload;
                state.currentProduct = {
                    id: null,
                    name: '',
                    description: '',
                    price: 0,
                    quantity: 0,
                    status: '',
                    image_url: '',
                    created_at: '',
                    sold_count: 0,
                    author: '',
                };
            })
    },
});

export const {
    setFilters,
    setFilterName,
    setFilterPriceFrom,
    setFilterPriceTo,
    setFilterStatus,
    resetFilters,
    setSorting,
    setCurrentProduct,
    updateCurrentProduct,
    resetCurrentProduct,
    clearCurrentProductError,
    clearErrors,
    resetSorting,
} = productSlice.actions;

export default productSlice.reducer;