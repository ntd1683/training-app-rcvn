import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import {
    loadProducts,
    setFilterName,
    setFilterPriceFrom,
    setFilterPriceTo,
    setFilterStatus,
    setFilters,
    setSorting,
    clearErrors,
    resetFilters,
} from '~/redux/slices/products-slice';

// Selectors
import {
    selectProducts,
    selectPagination,
    selectMeta,
    selectCurrentFilters,
    selectLoadingStates,
    selectErrorStates,
    selectTableKey,
    selectSorting,
} from '~/redux/selectors/products-selector';

export const useShop = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const isInitialMount = useRef(true);
    const prevSearchParams = useRef(searchParams.toString());

    const data = useSelector(selectProducts);
    const pagination = useSelector(selectPagination);
    const currentFilters = useSelector(selectCurrentFilters);
    const loadingStates = useSelector(selectLoadingStates);
    const errorStates = useSelector(selectErrorStates);
    const tableKey = useSelector(selectTableKey);
    const meta = useSelector(selectMeta);
    const sorting = useSelector(selectSorting);

    const [defaultPriceRange, setDefaultPriceRange] = useState({
        min: 0,
        max: 50000,
    });
    const [inputSearch, setInputSearch] = useState('');
    const [inputPriceFrom, setInputPriceFrom] = useState('');
    const [inputPriceTo, setInputPriceTo] = useState('');

    const {
        filterName,
        filterPriceTo,
        filterPriceFrom,
        filterStatus,
        sortName,
        sortBy,
        sortOrder,
    } = currentFilters;

    const {
        isLoading,
    } = loadingStates;

    const {
        error,
    } = errorStates;

    const handleLoadProducts = useCallback((page = 1, perPage = 10, filters = {}) => {
        if (filters.filterStatus === undefined || filters.filterStatus === null || filters.filterStatus === '') {
            filters.filterStatus = 3;
        }
        if (filters.sortBy === undefined || filters.sortBy === null || filters.sortBy === '') {
            filters.sortBy = 'popular';
        }
        dispatch(loadProducts({ page, perPage, filters }));
    }, [dispatch]);

    const loadDataFromParams = useCallback(async () => {
        console.log('data param run', searchParams.toString(), currentFilters);
        
        const page = parseInt(searchParams.get('page')) || 1;
        const perPage = parseInt(searchParams.get('per_page')) || 10;
        const filterNameUrl = searchParams.get('name') || '';
        const filterPriceFromUrl = searchParams.get('price_from') || '';
        const filterPriceToUrl = searchParams.get('price_to') || '';
        let filterStatusFromUrl = searchParams.get('status') || '';
        let sortNameFromUrl = searchParams.get('sort_name') || '';

        if (filterStatusFromUrl === '') {
            filterStatusFromUrl = 3;
        }

        dispatch(setFilters({
            name: filterNameUrl,
            priceFrom: filterPriceFromUrl,
            priceTo: filterPriceToUrl,
            status: filterStatusFromUrl,
        }));
        setInputSearch(filterNameUrl);
        setInputPriceFrom(filterPriceFromUrl);
        setInputPriceTo(filterPriceToUrl);

        let sortByFromUrl = '';
        let sortOrderFromUrl = '';
        if (sortNameFromUrl === '') {
            sortNameFromUrl = 'popular';
            sortByFromUrl = 'popular';
        } else if (sortNameFromUrl) {
            if (sortNameFromUrl === 'created_at') {
                sortByFromUrl = 'created_at';
                sortOrderFromUrl = 'desc';
            } else if (sortNameFromUrl === 'popular') {
                sortByFromUrl = 'popular';
            } else {
                sortByFromUrl = sortNameFromUrl.split('_')[0];
                sortOrderFromUrl = sortNameFromUrl.split('_')[1] || 'desc';
            }
        }

        dispatch(setSorting({
            sortName: sortNameFromUrl,
            sortBy: sortByFromUrl,
            sortOrder: sortOrderFromUrl,
        }));

        handleLoadProducts(page, perPage, {
            filterName: filterNameUrl,
            filterPriceFrom: filterPriceFromUrl,
            filterPriceTo: filterPriceToUrl,
            filterStatus: filterStatusFromUrl,
            sortBy: sortByFromUrl,
            sortOrder: sortOrderFromUrl,
        });
    }, [searchParams, dispatch, handleLoadProducts]);

    // Update search params
    const updateSearchParams = useCallback(() => {
        console.log('123', filterName, searchParams.toString());
        
        const params = {};

        if (filterName) params.name = filterName;
        if (filterPriceFrom && filterPriceFrom !== defaultPriceRange.min) params.price_from = filterPriceFrom;
        if (filterPriceTo && filterPriceTo !== defaultPriceRange.max) params.price_to = filterPriceTo;
        if (filterStatus && filterStatus !== 3) params.status = filterStatus;
        if (sortName && sortName !== 'popular') params.sort_name = sortName;
        if (pagination.current_page !== 1) params.page = pagination.current_page.toString();
        if (pagination.per_page !== 10) params.per_page = pagination.per_page.toString();

        setSearchParams(params, { replace: true });
    }, [filterName, filterPriceFrom, filterPriceTo, defaultPriceRange, filterStatus, sortName, pagination, setSearchParams]);

    useEffect(() => {
        if (!isInitialMount.current) {
            console.log('Updating search params:', searchParams.toString(), pagination.current_page, pagination.per_page, sortBy, sortOrder);
            updateSearchParams();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.current_page, pagination.per_page, sortBy, sortOrder]);

    useEffect(() => {
        console.log('init mount', isInitialMount.current, searchParams.toString());
        if (isInitialMount.current) {
            loadDataFromParams();
            isInitialMount.current = false;
        }
        
        setDefaultPriceRange({
            min: meta.min || 0,
            max: meta.max || 50000,
        });
    }, [loadDataFromParams, meta]);

    useEffect(() => {
        const currentParams = searchParams.toString();
        console.log('Current search params:', currentParams, isInitialMount.current, prevSearchParams.current);
        // Only reload if params actually changed and it's not the initial mount
        if (!isInitialMount.current && currentParams !== prevSearchParams.current) {
            console.log('Search params changed :', currentParams);
            loadDataFromParams();
            prevSearchParams.current = currentParams;
        } else if (!isInitialMount.current) {
            // Update ref even if no reload needed
            prevSearchParams.current = currentParams;
        }
    }, [searchParams, loadDataFromParams]);

    // Filter handlers
    const handleSetFilterName = useCallback((value) => {
        dispatch(setFilterName(value));
    }, [dispatch]);

    const handleSetFilterPriceFrom = useCallback((value) => {
        dispatch(setFilterPriceFrom(value));
    }, [dispatch]);

    const handleSetFilterPriceTo = useCallback((value) => {
        dispatch(setFilterPriceTo(value));
    }, [dispatch]);

    const handleSetFilterStatus = useCallback((value) => {
        dispatch(setFilterStatus(value));
    }, [dispatch]);

    // Search and reset handlers
    const handleSearch = useCallback(() => {
        const params = {};

        if (inputSearch) params.name = inputSearch;
        if (inputPriceFrom && inputPriceFrom !== defaultPriceRange.min) params.price_from = inputPriceFrom;
        if (inputPriceTo && inputPriceTo !== defaultPriceRange.max) params.price_to = inputPriceTo;
        dispatch(setFilters({
            name: inputSearch,
            priceFrom: inputPriceFrom,
            priceTo: inputPriceTo,
        }));
        if (filterStatus && filterStatus !== 3) params.status = filterStatus;
        if (sortName && sortName !== 'popular') params.sort_name = sortName;
        if (pagination.per_page !== 10) params.per_page = pagination.per_page.toString();

        setSearchParams(params, { replace: true });
        handleLoadProducts(1, pagination.per_page, {
            filterName: inputSearch,
            filterPriceFrom: inputPriceFrom,
            filterPriceTo: inputPriceTo,
            filterStatus,
            sortBy,
            sortOrder,
        });
    }, [dispatch, inputSearch, inputPriceFrom, inputPriceTo, defaultPriceRange, filterStatus, sortName, sortBy, sortOrder, pagination.per_page, setSearchParams, handleLoadProducts]);

    const handleReset = useCallback(() => {
        dispatch(setFilters({
            name: '',
            priceFrom: '',
            priceTo: '',
            status: 3,
        }));
        setInputSearch('');
        setInputPriceFrom('');
        setInputPriceTo('');

        setSearchParams({}, { replace: true });
        handleLoadProducts(1, pagination.per_page, {});
    }, [dispatch, setSearchParams, handleLoadProducts, pagination.per_page]);

    // Pagination handlers
    const handlePageChange = useCallback((page) => {
        handleLoadProducts(page, pagination.per_page, currentFilters);
    }, [handleLoadProducts, pagination.per_page, currentFilters]);

    const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
        handleLoadProducts(1, newRowsPerPage, currentFilters);
    }, [handleLoadProducts, currentFilters]);

    // Sort handler
    const handleSort = useCallback((sortObj) => {
        dispatch(setSorting({
            sortName: sortObj.sortName,
            sortBy: sortObj.sortBy,
            sortOrder: sortObj.sortOrder,
        }));

        handleLoadProducts(1, pagination.per_page, {
            ...currentFilters,
            sortBy: sortObj.sortBy,
            sortOrder: sortObj.sortOrder,
        });
    }, [dispatch, handleLoadProducts, pagination.per_page, currentFilters]);

    // Error handlers
    const handleClearErrors = useCallback(() => {
        dispatch(clearErrors());
    }, [dispatch]);

    // Return memoized object
    return useMemo(() => ({
        // Data
        data,
        pagination,
        sorting,

        // Inputs
        inputSearch,
        inputPriceFrom,
        inputPriceTo,
        setInputSearch,
        setInputPriceFrom,
        setInputPriceTo,

        // Filters
        filterName,
        filterPriceFrom,
        filterPriceTo,
        filterStatus,

        // Sorting
        sortBy,
        sortOrder,
        tableKey,

        // Loading States
        isLoading,

        // Error States
        error,

        // Filter Handlers
        setFilterName: handleSetFilterName,
        setFilterPriceFrom: handleSetFilterPriceFrom,
        setFilterPriceTo: handleSetFilterPriceTo,
        setFilterStatus: handleSetFilterStatus,

        // Action Handlers
        handleSearch,
        handleReset,
        handlePageChange,
        handleRowsPerPageChange,
        handleSort,

        // Error Handlers
        clearErrors: handleClearErrors,
        defaultPriceRange,
    }), [
        data,
        pagination,
        inputSearch,
        inputPriceFrom,
        inputPriceTo,
        setInputSearch,
        setInputPriceFrom,
        setInputPriceTo,
        filterName,
        filterPriceFrom,
        filterPriceTo,
        filterStatus,
        sortBy,
        sortOrder,
        sorting,
        tableKey,
        isLoading,
        error,
        handleSetFilterName,
        handleSetFilterPriceFrom,
        handleSetFilterPriceTo,
        handleSetFilterStatus,
        handleSearch,
        handleReset,
        handlePageChange,
        handleRowsPerPageChange,
        handleSort,
        handleClearErrors,
        defaultPriceRange,
    ]);
};