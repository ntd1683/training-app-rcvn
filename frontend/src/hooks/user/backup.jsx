import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectProducts,
    selectPagination,
    selectIsLoading,
    selectError,
    selectFilters,
    selectSorting
} from '~/redux/selectors/products-selector';
import {
    loadProducts,
    setFilterName,
    setSorting,
    setFilters,
} from '~/redux/slices/products-slice';

export const useShop = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const isInitialMount = useRef(true);

    const products = useSelector(selectProducts);
    const pagination = useSelector(selectPagination);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);
    const filters = useSelector(selectFilters);
    const sorting = useSelector(selectSorting);

    const handleLoadProducts = useCallback((page = 1, perPage = 10, filters = {}) => {
        dispatch(loadProducts({ page, perPage, filters }));
    }, [dispatch])

    useEffect(() => {
        if (isInitialMount.current) {
            const page = parseInt(searchParams.get('page')) || 1;
            const perPage = parseInt(searchParams.get('per_page')) || 10;
            const filterNameUrl = searchParams.get('name') || '';
            const filterPriceFromUrl = searchParams.get('price_from') || '';
            const filterPriceToUrl = searchParams.get('price_to') || '';
            const filterStatusFromUrl = searchParams.get('status') || '';
            const sortByFromUrl = searchParams.get('sort_by') || '';
            const sortOrderFromUrl = searchParams.get('sort_order') || '';
 
            // Set filters in Redux
            dispatch(setFilters({
                name: filterNameUrl,
                email: filterPriceFromUrl,
                group: filterPriceToUrl,
                status: filterStatusFromUrl,
            }));
 
            // Set sorting in Redux
            if (sortByFromUrl && sortOrderFromUrl) {
                dispatch(setSorting({
                    sortBy: sortByFromUrl,
                    sortOrder: sortOrderFromUrl,
                }));
            }
 
            handleLoadProducts(page, perPage, {
                filterName: filterNameUrl,
                filterPriceFrom: filterPriceFromUrl,
                filterPriceTo: filterPriceToUrl,
                filterStatus: filterStatusFromUrl,
                sortBy: sortByFromUrl,
                sortOrder: sortOrderFromUrl,
            });
 
            isInitialMount.current = false;
        }
    }, [searchParams, dispatch, handleLoadProducts]);

    // useEffect(() => {
    //     dispatch(loadProducts({
    //         page: pagination.current_page,
    //         perPage: pagination.per_page,
    //         filters: {
    //             name: filters.name,
    //             sortBy: sorting.sortBy,
    //             sortOrder: sorting.sortOrder
    //         }
    //     }));
    // }, [dispatch, pagination.current_page, pagination.per_page, filters.name, sorting.sortBy, sorting.sortOrder]);

    const handleSearch = (value) => {
        dispatch(setFilterName(value));
    };

    const handleSort = (sortObj) => {
        dispatch(setSorting(sortObj));
    };

    return {
        products,
        pagination,
        isLoading,
        error,
        filters,
        sorting,
        handleSearch,
        handleSort,
        dispatch
    };
}