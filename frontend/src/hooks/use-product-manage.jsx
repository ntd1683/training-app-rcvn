import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchProducts, deleteProduct } from '~/services/api';

export const useProductManage = () => {

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
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [sortClickCount, setSortClickCount] = useState({});
  const [lastSortedColumn, setLastSortedColumn] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const loadProducts = async (page = 1, perPage = 10, filters = {}) => {
    setIsLoading(true);
    try {
      const response = await fetchProducts(page, perPage, filters);
      if (response.success) {
        setData(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handlers
  const handleSearch = () => {
    console.log('Searching products with filters:', pagination.per_page);
    loadProducts(1, pagination.per_page, { filterText, filterStatus, filterPriceTo, filterPriceFrom, sortBy, sortOrder });
  };

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterPriceFrom('');
    setFilterPriceTo('');
    setSortBy('');
    setSortOrder('');
    setSortClickCount({});
    setLastSortedColumn('');
    setTableKey(prev => prev + 1);
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
          setTableKey(prev => prev + 1);
          
          loadProducts(pagination.current_page, pagination.per_page, {});
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
      toast.success('Xoá sản phẩm thành công!', { toastId: 'delete-success-toast' });
    } catch (error) {
      setDeleteError('Có lỗi xảy ra khi xoá sản phẩm.');
      toast.error('Xoá không thành công.', { toastId: 'delete-error-toast' });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    data,
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