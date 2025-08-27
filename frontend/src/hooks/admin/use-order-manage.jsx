import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import {
    selectAnalytics,
    selectCurrentFilters,
    selectErrorStates,
    selectLoadingStates,
    selectOrders,
    selectPagination,
    selectSorting,
    selectTableKey
} from "~/redux/selectors/orders-selector";
import {
    loadAllOrders,
    loadAnalytics,
    loadOrders,
    resetFilters,
    resetSorting,
    setFilters,
    setSorting
} from "~/redux/slices/orders-slice";
import { useUserInfo } from "./use-auth";


export const useOrderManage = () => {
    const dispatch = useDispatch();

    const analytics = useSelector(selectAnalytics);
    const data = useSelector(selectOrders);
    const user = useUserInfo().user;
    const pagination = useSelector(selectPagination);
    const currentFilters = useSelector(selectCurrentFilters);
    const loadingStates = useSelector(selectLoadingStates);
    const errorStates = useSelector(selectErrorStates);

    const isInitialMount = useRef(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const tableKey = useSelector(selectTableKey);
    const sorting = useSelector(selectSorting);

    // Destructure for easier access
    const {
        filterName,
        filterDate,
        filterStatus,
        sortBy,
        sortOrder,
    } = currentFilters;

    const [filterSearch, setFilterSearch] = useState({
        name: '',
        date: '',
        status: '',
    });

    const {
        isLoading,
    } = loadingStates;

    // eslint-disable-next-line no-unused-vars
    const { error } = errorStates;

    useEffect(() => {
        dispatch(loadAnalytics());
    }, [dispatch]);

    const handleLoadOrders = useCallback((page = 1, perPage = 10, filters = {}) => {
        dispatch(loadOrders({ page, perPage, filters, isAdmin: true }));
    }, [dispatch]);

    useEffect(() => {
        if (isInitialMount.current) {
            const page = parseInt(searchParams.get('page')) || 1;
            const perPage = parseInt(searchParams.get('per_page')) || 10;
            const filterNameUrl = searchParams.get('name') || '';
            const filterDateUrl = searchParams.get('date') || '';
            const filterStatusFromUrl = searchParams.get('status') || '';
            const sortByFromUrl = searchParams.get('sort_by') || '';
            const sortOrderFromUrl = searchParams.get('sort_order') || '';

            setFilterSearch({
                name: filterNameUrl,
                date: filterDateUrl,
                status: filterStatusFromUrl,
            });

            if (sortByFromUrl && sortOrderFromUrl) {
                dispatch(setSorting({
                    sortBy: sortByFromUrl,
                    sortOrder: sortOrderFromUrl,
                }));
            }

            handleLoadOrders(page, perPage, {
                filterName: filterNameUrl,
                filterDate: filterDateUrl,
                filterStatus: filterStatusFromUrl,
                sortBy: sortByFromUrl,
                sortOrder: sortOrderFromUrl,
            });

            isInitialMount.current = false;
        }
    }, [setFilterSearch, searchParams, dispatch, handleLoadOrders]);

    // Update search params
    const updateSearchParams = useCallback(() => {
        const params = {};

        if (filterName) params.name = filterName;
        if (filterDate) params.date = filterDate;
        if (filterStatus) params.status = filterStatus;
        if (sortBy) params.sort_by = sortBy;
        if (sortOrder) params.sort_order = sortOrder;
        if (pagination.current_page !== 1) params.page = pagination.current_page.toString();
        if (pagination.per_page !== 10) params.per_page = pagination.per_page.toString();

        setSearchParams(params, { replace: true });
        // eslint-disable-next-line
    }, [sortBy, sortOrder, pagination, setSearchParams]);

    useEffect(() => {
        if (!isInitialMount.current) {
            updateSearchParams();
        }
    }, [pagination.current_page, pagination.per_page, sortBy, sortOrder, updateSearchParams]);

    const handleSetFilterName = useCallback((value) => {
        setFilterSearch(prev => ({ ...prev, name: value }));
    }, [setFilterSearch]);

    const handleSetFilterDate = useCallback((value) => {
        setFilterSearch(prev => ({ ...prev, date: value }));
    }, [setFilterSearch]);

    const handleSetFilterStatus = useCallback((value) => {
        setFilterSearch(prev => ({ ...prev, status: value }));
    }, [setFilterSearch]);

    // Search and reset handlers
    const handleSearch = useCallback(() => {
        const params = {};

        if (filterSearch.name) params.name = filterSearch.name;
        if (filterSearch.date) params.email = filterSearch.date;
        if (filterSearch.status) params.status = filterSearch.status;
        if (sortBy) params.sort_by = sortBy;
        if (sortOrder) params.sort_order = sortOrder;
        if (pagination.per_page !== 10) params.per_page = pagination.per_page.toString();

        dispatch(setFilters({
            name: filterSearch.name,
            date: filterSearch.date,
            status: filterSearch.status,
        }));

        setSearchParams(params, { replace: true });
        handleLoadOrders(1, pagination.per_page, {
            filterName: filterSearch.name,
            filterDate: filterSearch.date,
            filterStatus: filterSearch.status,
            sortBy,
            sortOrder,
        });
    }, [dispatch, filterSearch, sortBy, sortOrder, pagination.per_page, setSearchParams, handleLoadOrders]);

    const handleReset = useCallback(() => {
        setFilterSearch({
            name: '',
            date: '',
            status: '',
        });
        dispatch(resetFilters());
        dispatch(resetSorting());
        setSearchParams({}, { replace: true });
        handleLoadOrders(1, pagination.per_page, {});
    }, [setFilterSearch, dispatch, setSearchParams, handleLoadOrders, pagination.per_page]);

    // Pagination handlers
    const handlePageChange = useCallback((page) => {
        handleLoadOrders(page, pagination.per_page, currentFilters);
    }, [handleLoadOrders, pagination.per_page, currentFilters]);

    const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
        handleLoadOrders(1, newRowsPerPage, currentFilters);
    }, [handleLoadOrders, currentFilters]);

    // Sort handler
    const handleSort = useCallback((column, sortDirection) => {
        if (column.sortBy && column.sortable) {
            dispatch(setSorting({
                sortBy: column.sortBy,
                sortOrder: sortDirection
            }));

            // If sorting was reset (3rd click), load without sorting
            if (sorting.sortClickCount[column.sortBy] >= 2) {
                handleLoadOrders(pagination.current_page, pagination.per_page, {
                    ...currentFilters,
                });
            } else {
                handleLoadOrders(pagination.current_page, pagination.per_page, {
                    ...currentFilters,
                    sortBy: column.sortBy,
                    sortOrder: sortDirection,
                });
            }
        }
    }, [dispatch, sorting.sortClickCount, handleLoadOrders, pagination, currentFilters]);

    const handleGetAll = useCallback(async () => {
        const result = await dispatch(loadAllOrders({ count: pagination.total, filters: currentFilters, isAdmin: true }));
        if (result.meta.requestStatus === 'fulfilled') {
            return result.payload;
        }
    }, [dispatch, pagination.total, currentFilters]);

    return {
        analytics,
        user,
        isLoading,
        handleSearch,
        handleReset,
        tableKey,
        pagination,
        data,
        handleSort,
        handleGetAll,
        sortBy,
        sortOrder,
        filterSearch,
        handlePageChange,
        handleRowsPerPageChange,
        handleSetFilterName,
        handleSetFilterDate,
        handleSetFilterStatus,
    };
};