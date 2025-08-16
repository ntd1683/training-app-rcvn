import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchProducts, deleteProduct } from '~/services/api';
import { useUserInfo } from './use-auth';

export const useProductManage = () => {
  const user = useUserInfo().user;

  // State
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
  });
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriceTo, setFilterPriceTo] = useState('');
  const [filterPriceFrom, setFilterPriceFrom] = useState('');
  const [errorFilterPrice, setErrorFilterPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [sortClickCount, setSortClickCount] = useState({});
  const [lastSortedColumn, setLastSortedColumn] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);

  const loadProducts = useCallback(async (page = 1, perPage = 10, filters = {}) => {
    setIsLoading(true);
    try {
      const response = await fetchProducts(page, perPage, filters);
      if (response.success) {
        setData(response.data);
        const paginationData = response.pagination || {};
        const total = paginationData.total || 0;
        let perPageTmp = total > 20 ? paginationData.per_page : perPage;

        setPagination({
          current_page: page,
          per_page: perPageTmp,
          total: paginationData.total,
          last_page: paginationData.last_page,
          from: paginationData.from,
          to: paginationData.to,
        });
      }
    } catch (error) {
      setData([]);
    } finally {
      setIsLoading(false);
      if (isInitialMount.current) {
        isInitialMount.current = false;
      }
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      const page = parseInt(searchParams.get('page')) || 1;
      const perPage = parseInt(searchParams.get('per_page')) || 10;
      const filterTitleFromUrl = searchParams.get('title') || '';
      const filterStatusFromUrl = searchParams.get('status') || '';
      const filterPriceToFromUrl = searchParams.get('price_to') || '';
      const FilterPriceFromFromUrl = searchParams.get('price_from') || '';
      const sortByFromUrl = searchParams.get('sort_by') || '';
      const sortOrderFromUrl = searchParams.get('sort_order') || '';

      setFilterText(filterTitleFromUrl);
      setFilterStatus(filterStatusFromUrl);
      setFilterPriceTo(filterPriceToFromUrl);
      setFilterPriceFrom(FilterPriceFromFromUrl);
      setSortBy(sortByFromUrl);
      setSortOrder(sortOrderFromUrl);

      loadProducts(page, perPage, {
        filterText: filterTitleFromUrl,
        filterStatus: filterStatusFromUrl,
        filterPriceFrom: FilterPriceFromFromUrl,
        filterPriceTo: filterPriceToFromUrl,
        sortBy: sortByFromUrl,
        sortOrder: sortOrderFromUrl,
      });
    }
  }, [searchParams, loadProducts]);

  const updateSearchParams = useCallback(() => {
    const params = {};
    
    if (searchParams.get('title')) params.title = searchParams.get('title');
    if (searchParams.get('status')) params.status = searchParams.get('status');
    if (searchParams.get('price_from')) params.price_from = searchParams.get('price_from');
    if (searchParams.get('price_to')) params.price_to = searchParams.get('price_to');

    if (pagination.current_page !== 1) params.page = pagination.current_page.toString();
    if (pagination.per_page !== 10) params.per_page = pagination.per_page.toString();
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    setSearchParams(params, { replace: true });
  }, [searchParams, pagination.current_page, pagination.per_page, sortBy, sortOrder, setSearchParams]);

  useEffect(() => {
    if (!isInitialMount.current) {
      updateSearchParams();
    }
  }, [pagination.current_page, pagination.per_page, sortBy, sortOrder, updateSearchParams]);

  const handleSearch = () => {
    const priceFrom = parseFloat(filterPriceFrom);
    const priceTo = parseFloat(filterPriceTo);
    if (filterPriceFrom && filterPriceTo && priceFrom < 0 && priceTo < 0) {
      toast.error('Giá không thể nhỏ hơn 0.', { toastId: 'price-error-toast' });
      setErrorFilterPrice('Giá không thể nhỏ hơn 0.');
      return;
    }

    if (filterPriceFrom && filterPriceTo && priceFrom > priceTo) {
      toast.error('Giá từ không thể lớn hơn giá đến.', { toastId: 'price-error-toast' });
      setErrorFilterPrice('Giá từ không thể lớn hơn giá đến.');
      return;
    } else {
      setErrorFilterPrice('');
    }

    const params = {};

    if (filterText) params.title = filterText;
    if (filterStatus) params.status = filterStatus;
    if (filterPriceFrom) params.price_from = filterPriceFrom;
    if (filterPriceTo) params.price_to = filterPriceTo;
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    if (pagination.per_page !== 10) params.per_page = pagination.per_page.toString

    setSearchParams(params, { replace: true });
    loadProducts(1, pagination.per_page, { filterText, filterStatus, filterPriceTo, filterPriceFrom, sortBy, sortOrder });
  };

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterPriceFrom('');
    setFilterPriceTo('');
    setErrorFilterPrice('');
    setSortBy('');
    setSortOrder('');
    setSortClickCount({});
    setLastSortedColumn('');
    setTableKey((prev) => prev + 1);
    setSearchParams({}, { replace: true });
    loadProducts(1, pagination.per_page, {});
  };

  const handlePageChange = (page) => {
    loadProducts(page, pagination.per_page, { filterText, filterStatus, filterPriceFrom, filterPriceTo, sortBy, sortOrder });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    loadProducts(1, newRowsPerPage, { filterText, filterStatus, filterPriceFrom, filterPriceTo, sortBy, sortOrder });
  };

  const handleSort = (column, sortDirection) => {
    if (column.selector && column.sortable) {
      const selector = typeof column.selector === 'function' 
        ? column.selector.toString().split('.').pop() || column.name.toLowerCase()
        : column.selector;
      
      if (lastSortedColumn !== selector) {
        setSortClickCount({ [selector]: 1 });
        setLastSortedColumn(selector);
      } else {
        const currentCount = sortClickCount[selector] || 0;
        const nextCount = currentCount + 1;
        setSortClickCount({ [selector]: nextCount });
        
        if (nextCount >= 3) {
          setSortBy('');
          setSortOrder('');
          setSortClickCount({});
          setLastSortedColumn('');
          setTableKey((prev) => prev + 1);
          loadProducts(pagination.current_page, pagination.per_page, {
            filterText,
            filterStatus,
            filterPriceFrom,
            filterPriceTo,
          });
          return;
        }
      }
      
      setSortBy(selector);
      setSortOrder(sortDirection);
      loadProducts(pagination.current_page, pagination.per_page, {
        filterText,
        filterStatus,
        filterPriceFrom,
        filterPriceTo,
        sortBy: selector,
        sortOrder: sortDirection,
      });
    }
  };


  const handleDelete = async (productId) => {
    if (!productId) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      const response = await deleteProduct(productId);
      if (!response) throw new Error('Xoá không thành công');
      setData(data.filter(user => user.id !== productId));
      setShowDeleteModal(false);
      toast.success('Xoá sản phẩm thành công!');
    } catch (error) {
      setDeleteError('Có lỗi xảy ra khi xoá sản phẩm.');
      toast.error('Xoá không thành công.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    data,
    user,
    isLoading,
    pagination,
    filterText,
    setFilterText,
    filterStatus,
    setFilterStatus,
    filterPriceTo,
    setFilterPriceTo,
    filterPriceFrom,
    setFilterPriceFrom,
    errorFilterPrice,
    selectedProduct,
    setSelectedProduct,
    sortBy,
    sortOrder,
    tableKey,
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    deleteError,
    handleSearch,
    handleReset,
    handlePageChange,
    handleRowsPerPageChange,
    handleSort,
    handleDelete,
  };
};