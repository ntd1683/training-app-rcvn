import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchOrders, fetchOrderById, rePayOrder, approveOrder, cancelOrder, fetchOrderAnalytics } from '~/services/api';

// Async thunks
export const loadOrders = createAsyncThunk(
    'orders/loadOrders',
    async ({ page = 1, perPage = 10, filters = {}, isAdmin = false }, { rejectWithValue }) => {
        try {
            const response = await fetchOrders(page, perPage, filters, isAdmin);
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
                    },
                };
            } else {
                throw new Error('Lỗi khi lấy danh sách đơn hàng');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadAllOrders = createAsyncThunk(
    'orders/loadAllOrders',
    async ({ count , filters = {}, isAdmin = false }, { rejectWithValue }) => {
        try {
            const response = await fetchOrders(1, count, filters, isAdmin);
            if (response.success) {
                return {
                    data: response.data,
                    pagination: {
                        current_page: 1,
                        per_page: response.pagination?.total > 20 ? response.pagination.per_page : 1000,
                        total: response.pagination?.total || 0,
                        last_page: response.pagination?.last_page || 1,
                        from: response.pagination?.from || 0,
                        to: response.pagination?.to || 0,
                    },
                };
            } else {
                throw new Error('Lỗi khi lấy danh sách đơn hàng');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadAnalytics = createAsyncThunk(
    'orders/loadAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchOrderAnalytics();
            if (response.success) {
                return response.data;
            } else {
                throw new Error('Lỗi khi lấy dữ liệu phân tích');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadMoreOrders = createAsyncThunk(
    'orders/loadMoreOrders',
    async ({ page = 1, perPage = 10, filters = {} }, { rejectWithValue }) => {
        try {
            const response = await fetchOrders(page, perPage, filters);
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
                    },
                };
            } else {
                throw new Error('Lỗi khi lấy thêm danh sách đơn hàng');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadOrder = createAsyncThunk(
    'order/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetchOrderById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin đơn hàng');
        }
    }
);

export const rePay = createAsyncThunk(
    'order/repay',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await rePayOrder(orderId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán lại đơn hàng');
        }
    }
);

export const approveCheckout = createAsyncThunk(
    'order/approve-checkout',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await approveOrder(orderId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt thanh toán lại');
        }
    }
);

export const cancelCheckout = createAsyncThunk(
    'order/cancel-checkout',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await cancelOrder(orderId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi hủy thanh toán');
        }
    }
);

// Initial state
const initialState = {
    data: [],
    analytics: {
        total_pending: 0,
        total_processing: 0,
        total_completed: 0,
        total_failed: 0,
    },
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
        status: '',
        date: '',
    },
    sorting: {
        sortBy: '',
        sortOrder: '',
        sortClickCount: {},
        lastSortedColumn: '',
    },
    isLoading: false,
    isLoadingMore: false,
    isRePay: false,
    isApproveCheckout: false,
    error: null,
    errorLoadMore: false,
    tableKey: 0,

    currentOrder: {
        id: '',
        order_code: '',
        total_amount: 0,
        status: 0,
        recipient: {
            name: '',
            phone: '',
            address: '',
            ward: '',
            province: '',
            post_code: '',
            note: ''
        },
        timeline: [],
        products: [],
        fee: 0,
        payment_type: ''
    },
    currentOrderLoading: false,
    currentOrderError: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrders: (state) => {
            state.data = [];
            state.pagination.currentPage = 1;
        },
        setFilterName: (state, action) => {
            state.filters.name = action.payload;
        },
        setFilterDate: (state, action) => {
            state.filters.date = action.payload;
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
                date: '',
                status: '',
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
            state.errorLoadMore = false;
        },

        updateOrderInList: (state, action) => {
            const { orderId, updates } = action.payload;
            const orderIndex = state.data.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                state.data[orderIndex] = { ...state.data[orderIndex], ...updates };
            }
        },

        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
        },
        updateCurrentOrder: (state, action) => {
            state.currentOrder = { ...state.currentOrder, ...action.payload };
        },
        resetCurrentOrder: (state) => {
            state.currentOrder = {
                id: '',
                order_code: '',
                total_amount: 0,
                status: 0,
                recipient: {
                    name: '',
                    phone: '',
                    address: '',
                    ward: '',
                    province: '',
                    post_code: '',
                    note: ''
                },
                timeline: [],
                products: [],
                fee: 0,
                payment_type: ''
            };
        },
        clearCurrentOrderError: (state) => {
            state.currentOrderError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Load orders
            .addCase(loadOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(loadOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.payload;
            })

            // Load analytics
            .addCase(loadAnalytics.fulfilled, (state, action) => {
                state.analytics = action.payload.data || action.payload;
            })

            // Load more orders
            .addCase(loadMoreOrders.pending, (state) => {
                state.isLoadingMore = true;
                state.errorLoadMore = null;
            })
            .addCase(loadMoreOrders.fulfilled, (state, action) => {
                state.isLoadingMore = false;
                state.data = [...state.data, ...action.payload.data];
                state.pagination = action.payload.pagination;
                state.errorLoadMore = null;
            })
            .addCase(loadMoreOrders.rejected, (state, action) => {
                state.isLoadingMore = false;
                state.data = [...state.data];
                state.errorLoadMore = action.payload;
            })

            // Load single order
            .addCase(loadOrder.pending, (state) => {
                state.currentOrderLoading = true;
                state.currentOrderError = null;
            })
            .addCase(loadOrder.fulfilled, (state, action) => {
                state.currentOrderLoading = false;
                state.currentOrder = action.payload.data || action.payload;
                const data = action.payload.data || action.payload;
                
                state.currentOrder.recipient = {
                    name: data.recipient_name,
                    phone: data.recipient_phone,
                    address: data.recipient_address,
                    ward: data.recipient_ward,
                    province: data.recipient_province,
                    post_code: data.post_code,
                    note: data.note
                }
                state.currentOrder.total_amount = parseFloat(state.currentOrder.total_amount) || 0;
                state.currentOrderError = null;
            })
            .addCase(loadOrder.rejected, (state, action) => {
                state.currentOrderLoading = false;
                state.currentOrderError = action.payload;
                state.currentOrder = {
                    id: '',
                    order_code: '',
                    total_amount: 0,
                    status: 0,
                    recipient: {
                        name: '',
                        phone: '',
                        address: '',
                        ward: '',
                        province: '',
                        post_code: '',
                        note: ''
                    },
                    timeline: [],
                    products: [],
                    fee: 0,
                    payment_type: ''
                };
            })

            .addCase(approveCheckout.pending, (state) => {
                state.isRePay = true;
            })
            .addCase(approveCheckout.fulfilled, (state, action) => {
                state.isRePay = false;
                state.currentOrder = action.payload.data || action.payload;
                const data = action.payload.data || action.payload;
                
                state.currentOrder.recipient = {
                    name: data.recipient_name,
                    phone: data.recipient_phone,
                    address: data.recipient_address,
                    ward: data.recipient_ward,
                    province: data.recipient_province,
                    post_code: data.post_code,
                    note: data.note
                }
                state.currentOrder.total_amount = parseFloat(state.currentOrder.total_amount) || 0;
            })
            .addCase(approveCheckout.rejected, (state, action) => {
                state.isRePay = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    setFilterName,
    setFilterDate,
    setFilterStatus,
    resetFilters,
    setSorting,
    setCurrentOrder,
    updateCurrentOrder,
    resetCurrentOrder,
    clearCurrentOrderError,
    clearErrors,
    resetSorting,
    resetOrders,
} = orderSlice.actions;

export default orderSlice.reducer;