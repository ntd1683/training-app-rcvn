import { createSelector } from '@reduxjs/toolkit';

const selectOrderState = (state) => state.orders;

export const selectOrders = createSelector(
  [selectOrderState],
  (orderState) => orderState.data
);

export const selectAnalytics = createSelector(
  [selectOrderState],
  (orderState) => orderState.analytics
);

export const selectPagination = createSelector(
  [selectOrderState],
  (orderState) => orderState.pagination
);

export const selectTotalPages = createSelector(
  [selectPagination],
  (pagination) => Math.ceil(pagination.total / pagination.per_page) 
);

export const selectFilters = createSelector(
  [selectOrderState],
  (orderState) => orderState.filters
);

export const selectFilterName = createSelector(
  [selectFilters],
  (filters) => filters.name
);

export const selectFilterDate = createSelector(
  [selectFilters],
  (filters) => filters.date
);

export const selectFilterStatus = createSelector(
  [selectFilters],
  (filters) => filters.status
);

export const selectSorting = createSelector(
  [selectOrderState],
  (orderState) => orderState.sorting
);

export const selectSortBy = createSelector(
  [selectSorting],
  (sorting) => sorting.sortBy
);

export const selectSortOrder = createSelector(
  [selectSorting],
  (sorting) => sorting.sortOrder
);

export const selectIsLoading = createSelector(
  [selectOrderState],
  (orderState) => orderState.isLoading
);

export const selectError = createSelector(
  [selectOrderState],
  (orderState) => orderState.error
);

export const selectTableKey = createSelector(
  [selectOrderState],
  (orderState) => orderState.tableKey
);

export const selectCurrentFilters = createSelector(
  [selectFilters, selectSorting],
  (filters, sorting) => ({
    filterName: filters.name,
    filterDate: filters.date,
    filterStatus: filters.status,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
  })
);

export const selectLoadingStates = createSelector(
  [selectOrderState],
  (orderState) => ({
    isLoading: orderState.isLoading,
    isLoadingMore: orderState.isLoadingMore,
    currentUserLoading: orderState.currentUserLoading,
  })
);

export const selectErrorStates = createSelector(
  [selectOrderState],
  (productState) => ({
    error: productState.error,
    errorLoadMore: productState.errorLoadMore,
    currentUserError: productState.currentUserError,
  })
);

export const selectHasMore = createSelector(
    [selectPagination, selectTotalPages],
    (pagination, totalPages) => {
      return pagination.current_page < totalPages;
    }
);

export const selectTotalOrders = createSelector(
    [selectPagination],
    (pagination) => pagination.total
);

export const selectOrdersWithMeta = createSelector(
    [selectOrders, selectPagination, selectTotalPages, selectLoadingStates, selectErrorStates],
    (orders, pagination, totalPages, loading, error) => ({
        orders,
        pagination,
        totalPages,
        ...loading,
        ...error,
        hasMore: pagination.current_page < totalPages,
    })
);

// ----------------
export const selectCurrentOrder = createSelector(
  [selectOrderState],
  (orderState) => orderState.currentOrder
);

export const selectCurrentOrderLoading = createSelector(
  [selectOrderState],
  (orderState) => orderState.currentOrderLoading
);

export const selectCurrentOrderError = createSelector(
  [selectOrderState],
  (orderState) => orderState.currentOrderError
);

export const selectCurrentOrderFormData = createSelector(
  [selectCurrentOrder],
  (currentOrder) => ({
    id: currentOrder.id,
    orderCode: currentOrder.orderCode,
    totalAmount: currentOrder.totalAmount,
    status: currentOrder.status,
    recipient: {
      name: currentOrder.recipient.name,
      phone: currentOrder.recipient.phone,
      address: currentOrder.recipient.address,
      ward: currentOrder.recipient.ward,
      province: currentOrder.recipient.province,
      postCode: currentOrder.recipient.postCode,
      note: currentOrder.recipient.note
    },
        timeline: currentOrder.timeline,
        products: currentOrder.products,
        fee: 0,
        payment_type: 'paypal',
  })
);

export const selectCurrentOrderStates = createSelector(
  [selectCurrentOrder, selectCurrentOrderLoading, selectCurrentOrderError],
  (currentOrder, loading, error) => ({
    order: currentOrder,
    isLoading: loading,
    error: error,
  })
);

export const selectCreateEditData = createSelector(
  [selectCurrentOrder, selectCurrentOrderLoading, selectCurrentOrderError],
  (currentOrder, currentOrderLoading, currentOrderError) => ({
    currentOrder,
    isLoading: currentOrderLoading,
    error: currentOrderError,
  })
);

export const selectIsRePay = createSelector(
  [selectOrderState],
  (orderState) => orderState.isRePay
);