import { createSelector } from '@reduxjs/toolkit';

const selectProductState = (state) => state.products;

export const selectProducts = createSelector(
  [selectProductState],
  (productState) => productState.data
);

export const selectProductsNewest = createSelector(
  [selectProductState],
  (productState) => productState.dataNewest
);

export const selectProductsBestSeller = createSelector(
  [selectProductState],
  (productState) => productState.dataBestSeller
);

export const selectPagination = createSelector(
  [selectProductState],
  (productState) => productState.pagination
);

export const selectFilters = createSelector(
  [selectProductState],
  (productState) => productState.filters
);

export const selectFilterName = createSelector(
  [selectFilters],
  (filters) => filters.name
);

export const selectSorting = createSelector(
  [selectProductState],
  (productState) => productState.sorting
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
  [selectProductState],
  (productState) => productState.isLoading
);

export const selectError = createSelector(
  [selectProductState],
  (productState) => productState.error
);

export const selectTableKey = createSelector(
  [selectProductState],
  (productState) => productState.tableKey
);

export const selectCurrentFilters = createSelector(
  [selectFilters, selectSorting],
  (filters, sorting) => ({
    filterName: filters.name,
    filterPriceFrom: filters.priceFrom,
    filterPriceTo: filters.priceTo,
    filterStatus: filters.status,
    sortName: sorting.sortName,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
  })
);

export const selectLoadingStates = createSelector(
  [selectProductState],
  (productState) => ({
    isLoading: productState.isLoading,
    currentUserLoading: productState.currentUserLoading,
  })
);

export const selectErrorStates = createSelector(
  [selectProductState],
  (productState) => ({
    error: productState.error,
    currentUserError: productState.currentUserError,
  })
);

// ----------------
export const selectCurrentProduct = createSelector(
  [selectProductState],
  (productState) => productState.currentProduct
);

export const selectCurrentProductLoading = createSelector(
  [selectProductState],
  (productState) => productState.currentProductLoading
);

export const selectCurrentProductError = createSelector(
  [selectProductState],
  (productState) => productState.currentProductError
);

export const selectCurrentProductName = createSelector(
  [selectCurrentProduct],
  (currentProduct) => currentProduct.name
);

export const selectCurrentProductFormData = createSelector(
  [selectCurrentProduct],
  (currentProduct) => ({
    id: currentProduct.id,
    name: currentProduct.name,
    description: currentProduct.description,
    price: currentProduct.price,
    quantity: currentProduct.quantity,
    status: currentProduct.status,
    image_url: currentProduct.image_url,
    created_at: currentProduct.created_at,
    sold_count: currentProduct.sold_count,
    author: currentProduct.author,
  })
);

export const selectCurrentProductStates = createSelector(
  [selectCurrentProduct, selectCurrentProductLoading, selectCurrentProductError],
  (currentProduct, loading, error) => ({
    product: currentProduct,
    isLoading: loading,
    error: error,
  })
);

export const selectCreateEditData = createSelector(
  [selectCurrentProduct, selectCurrentProductLoading, selectCurrentProductError],
  (currentProduct, currentProductLoading, currentProductError) => ({
    currentProduct,
    isLoading: currentProductLoading,
    error: currentProductError,
  })
);