import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
    clearErrors,
    loadOrders,
    loadMoreOrders,
    setFilterDate,
    setFilterName,
    setFilters,
    setFilterStatus,
    resetOrders,
    setSorting,
} from '~/redux/slices/orders-slice';
import {
    selectCurrentFilters,
    selectErrorStates,
    selectLoadingStates,
    selectOrders,
    selectPagination,
    selectSorting,
    selectTableKey,
    selectHasMore,
} from '~/redux/selectors/orders-selector';

export const useOrders = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const isInitialMount = useRef(true);

    const data = useSelector(selectOrders);
    const pagination = useSelector(selectPagination);
    const currentFilters = useSelector(selectCurrentFilters);
    const loadingStates = useSelector(selectLoadingStates);
    const errorStates = useSelector(selectErrorStates);
    const tableKey = useSelector(selectTableKey);
    const sorting = useSelector(selectSorting);
    const hasMore = useSelector(selectHasMore);

    const [inputName, setInputName] = useState('');
    const [inputDate, setInputDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const {
        filterName,
        filterDate,
        filterStatus,
        sortBy,
        sortOrder,
    } = currentFilters;

    const {
        isLoading,
        isLoadingMore,
    } = loadingStates;

    const {
        error,
        loadMoreError,
    } = errorStates;

    // Load orders with optional loadMore flag
    const handleLoadOrders = useCallback((page = 1, perPage = 8, filters = {}, isLoadMore = false) => {
        const loadFilters = {
            filterName: filters.filterName || '',
            filterDate: filters.filterDate || '',
            filterStatus: filters.filterStatus || '',
            sortBy: filters.sortBy || 'created_at',
            sortOrder: filters.sortOrder || 'desc',
        };

        if (isLoadMore) {
            dispatch(loadMoreOrders({ page, perPage, filters: loadFilters }));
        } else {
            dispatch(loadOrders({ page, perPage, filters: loadFilters }));
        }
    }, [dispatch]);

    // Logic onLoadMore cho infinite scroll
    const handleLoadMore = useCallback(() => {
        if (isLoadingMore || !hasMore) {
            return;
        }

        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);

        const filters = {
            filterName,
            filterDate,
            filterStatus,
            sortBy,
            sortOrder,
        };

        handleLoadOrders(nextPage, 8, filters, true);
    }, [
        currentPage,
        hasMore,
        isLoadingMore,
        filterName,
        filterDate,
        filterStatus,
        sortBy,
        sortOrder,
        handleLoadOrders
    ]);

    // Load data from URL params
    const loadDataFromParams = useCallback(() => {
        const filterNameUrl = searchParams.get('name') || '';
        const filterDateFromUrl = searchParams.get('date') || '';
        const filterStatusFromUrl = searchParams.get('status') || '';
        const sortByUrl = searchParams.get('sortBy') || 'created_at';
        const sortOrderUrl = searchParams.get('sortOrder') || 'desc';

        // Set filters in Redux
        dispatch(setFilters({
            name: filterNameUrl,
            date: filterDateFromUrl,
            status: filterStatusFromUrl,
        }));

        // Set sorting in Redux
        dispatch(setSorting({
            sortBy: sortByUrl,
            sortOrder: sortOrderUrl,
        }));

        // Set local input states
        setInputName(filterNameUrl);
        setInputDate(filterDateFromUrl);
        setCurrentPage(1);

        // Reset orders and load first page
        dispatch(resetOrders());
        handleLoadOrders(1, 8, {
            filterName: filterNameUrl,
            filterDate: filterDateFromUrl,
            filterStatus: filterStatusFromUrl,
            sortBy: sortByUrl,
            sortOrder: sortOrderUrl,
        });
    }, [searchParams, dispatch, handleLoadOrders]);

    // Initial data load
    useEffect(() => {
        if (isInitialMount.current) {
            loadDataFromParams();
            isInitialMount.current = false;
        }
    }, [loadDataFromParams]);

    // Filter handlers
    const handleSetFilterName = useCallback((value) => {
        dispatch(setFilterName(value));
    }, [dispatch]);

    const handleSetFilterDate = useCallback((value) => {
        dispatch(setFilterDate(value));
    }, [dispatch]);

    const handleSetFilterStatus = useCallback((value) => {
        dispatch(setFilterStatus(value));

        const params = {};

        if (filterName) params.name = filterName;
        if (filterDate) params.date = filterDate;
        if (value) params.status = value;

        setSearchParams(params, { replace: true });

        handleLoadOrders(1, 8, {
            ...currentFilters,
            filterStatus: value,
        });
    }, [dispatch, currentFilters, handleLoadOrders, filterName, filterDate, setSearchParams]);

    const handleSearch = useCallback(() => {
        const params = {};

        if (inputName) params.name = inputName;
        if (inputDate && inputDate !== '') params.date = inputDate;
        if (filterStatus) params.status = filterStatus;
        
        dispatch(setFilters({
            name: inputName,
            date: inputDate,
            status: filterStatus,
        }));

        // Reset to first page and clear existing data
        setCurrentPage(1);
        dispatch(resetOrders());

        setSearchParams(params, { replace: true });
        handleLoadOrders(1, 8, {
            filterName: inputName,
            filterDate: inputDate,
            filterStatus: filterStatus,
            sortBy,
            sortOrder,
        });
    }, [dispatch, inputName, inputDate, filterStatus, sortBy, sortOrder, setSearchParams, handleLoadOrders]);

    // Reset handler
    const handleReset = useCallback(() => {
        dispatch(setFilters({
            name: '',
            date: '',
        }));
        
        dispatch(setSorting({
            sortBy: 'created_at',
            sortOrder: 'desc',
        }));
        
        setInputName('');
        setInputDate('');
        setCurrentPage(1);
        
        // Reset orders and load fresh data
        dispatch(resetOrders());

        const params = {};

        if (filterStatus) params.status = filterStatus;
        setSearchParams(params, { replace: true });
        handleLoadOrders(1, 8, {
            filterStatus: filterStatus,
            sortBy: 'created_at',
            sortOrder: 'desc',
        });
    }, [dispatch, setSearchParams, filterStatus, handleLoadOrders]);

    // Pagination handler (for traditional pagination if needed)
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        dispatch(resetOrders());
        
        const filters = {
            filterName,
            filterDate,
            filterStatus,
            sortBy,
            sortOrder,
        };
        
        handleLoadOrders(page, 8, filters);
        
        // Update URL
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        setSearchParams(params, { replace: true });
    }, [filterName, filterDate, filterStatus, sortBy, sortOrder, handleLoadOrders, searchParams, setSearchParams, dispatch]);

    // Error handlers
    const handleClearErrors = useCallback(() => {
        dispatch(clearErrors());
    }, [dispatch]);

    // Refresh handler
    const handleRefresh = useCallback(() => {
        setCurrentPage(1);
        dispatch(resetOrders());
        
        const filters = {
            filterName,
            filterDate,
            filterStatus,
            sortBy,
            sortOrder,
        };
        
        handleLoadOrders(1, 8, filters);
    }, [dispatch, filterName, filterDate, filterStatus, sortBy, sortOrder, handleLoadOrders]);

    return useMemo(() => ({
        data,
        pagination,
        sorting,
        hasMore,
        currentPage,
        handleLoadMore,
        inputName,
        inputDate,
        setInputName,
        setInputDate,
        filterName,
        filterDate,
        filterStatus,
        sortBy,
        sortOrder,
        tableKey,
        isLoading,
        isLoadingMore,
        error,
        loadMoreError,
        setFilterName: handleSetFilterName,
        setFilterDate: handleSetFilterDate,
        setFilterStatus: handleSetFilterStatus,
        handleSearch,
        handleReset,
        handleRefresh,
        handlePageChange,
        clearErrors: handleClearErrors,
    }), [
        data,
        pagination,
        sorting,
        hasMore,
        currentPage,
        handleLoadMore,
        inputName,
        inputDate,
        filterName,
        filterDate,
        filterStatus,
        sortBy,
        sortOrder,
        tableKey,
        isLoading,
        isLoadingMore,
        error,
        loadMoreError,
        handleSetFilterName,
        handleSetFilterDate,
        handleSetFilterStatus,
        handleSearch,
        handleReset,
        handleRefresh,
        handlePageChange,
        handleClearErrors,
    ]);
};