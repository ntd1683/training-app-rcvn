import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { deleteCustomer, fetchCustomers, resetDeleteCustomer } from '~/services/api';
import { useUserInfo } from './use-auth';

export const useCustomerManage = () => {
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
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterStatus, setFilterStatus] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [sortClickCount, setSortClickCount] = useState({});
  const [lastSortedColumn, setLastSortedColumn] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [lockError, setLockError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);

  const loadCustomers = useCallback(async (page = 1, perPage = 10, filters = {}) => {
    setIsLoading(true);
    try {
      const response = await fetchCustomers(page, perPage, filters);
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
      const filterNameUrl = searchParams.get('name') || '';
      const filterEmailFromUrl = searchParams.get('email') || '';
      const filterStatusFromUrl = searchParams.get('status') || 1;
      const sortByFromUrl = searchParams.get('sort_by') || '';
      const sortOrderFromUrl = searchParams.get('sort_order') || '';

      setFilterName(filterNameUrl);
      setFilterEmail(filterEmailFromUrl);
      setFilterStatus(filterStatusFromUrl);
      setSortBy(sortByFromUrl);
      setSortOrder(sortOrderFromUrl);

      loadCustomers(page, perPage, {
        filterName: filterNameUrl,
        filterEmail: filterEmailFromUrl,
        filterStatus: filterStatusFromUrl,
        sortBy: sortByFromUrl,
        sortOrder: sortOrderFromUrl,
      });
    }
  }, [searchParams, loadCustomers]);

  const updateSearchParams = useCallback(() => {
    const params = {};

    if (searchParams.get('name')) params.name = searchParams.get('name');
    if (searchParams.get('email')) params.email = searchParams.get('email');
    if (searchParams.get('status')) params.status = searchParams.get('status');

    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    if (pagination.current_page !== 1) params.page = pagination.current_page.toString();
    if (pagination.per_page !== 10) params.per_page = pagination.per_page.toString();

    setSearchParams(params, { replace: true });
  }, [searchParams, sortBy, sortOrder, pagination.current_page, pagination.per_page, setSearchParams]);

  useEffect(() => {
    if (!isInitialMount.current) {
      updateSearchParams();
    }
  }, [pagination.current_page, pagination.per_page, sortBy, sortOrder, updateSearchParams]);

  const handleSearch = () => {
    const params = {};

    if (filterName) params.name = filterName;
    if (filterEmail) params.email = filterEmail;
    if (filterStatus) params.status = filterStatus;
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    if (pagination.per_page !== 10) params.per_page = pagination.per_page.toString();

    setSearchParams(params, { replace: true });
    loadCustomers(1, pagination.per_page, { filterName, filterEmail, filterStatus, sortBy, sortOrder });
  };

  const handleReset = () => {
    setFilterName('');
    setFilterEmail('');
    setFilterStatus(1);
    setSortBy('');
    setSortOrder('');
    setSortClickCount({});
    setLastSortedColumn('');
    setTableKey((prev) => prev + 1);
    setSearchParams({}, { replace: true });
    loadCustomers(1, pagination.per_page, {});
  };

  const handlePageChange = (page) => {
    loadCustomers(page, pagination.per_page, { filterName, filterEmail, filterStatus, sortBy, sortOrder });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    loadCustomers(1, newRowsPerPage, { filterName, filterEmail, filterStatus, sortBy, sortOrder });
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
          loadCustomers(pagination.current_page, pagination.per_page, {
            filterName,
            filterEmail,
            filterStatus,
          });
          return;
        }
      }

      setSortBy(selector);
      setSortOrder(sortDirection);
      loadCustomers(pagination.current_page, pagination.per_page, {
        filterName,
        filterEmail,
        filterStatus,
        sortBy: selector,
        sortOrder: sortDirection,
      });
    }
  };

  const handleDelete = async (customerId) => {
    if (!customerId) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      const response = await deleteCustomer(customerId);
      if (!response) throw new Error('Xoá không thành công');
      setData(data.map(customer =>
        customer.id === customerId ? { ...customer, deleted_at: 1 } : customer
      ));
      setData(data.filter(customer => customer.id !== customerId));

      setShowDeleteModal(false);
      toast.success('Xoá khách hàng thành công!');
    } catch (error) {
      setDeleteError('Có lỗi xảy ra khi xoá khách hàng.');
      toast.error('Xoá không thành công.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLock = async (customerId) => {
    if (!customerId) return;
    try {
      setIsLocking(true);
      setLockError(null);
      const response = await resetDeleteCustomer(customerId);
      if (!response) throw new Error(`Mở khoá không thành công`);
      setData(data.map(customer =>
        customer.id === customerId ? { ...customer, deleted_at: null } : customer
      ));
      if (filterStatus === '0') {
        setData(data.filter(customer => customer.id !== customerId));
      }

      setShowLockModal(false);
      toast.success(`Mở khoá khách hàng thành công!`);
    } catch (error) {
      setLockError(`Có lỗi xảy ra khi mở khoá`);
      toast.error(`Mở khoá không thành công.`);
    } finally {
      setIsLocking(false);
    }
  };

  return {
    user,
    data,
    isLoading,
    pagination,
    filterName,
    setFilterName,
    filterEmail,
    setFilterEmail,
    filterStatus,
    setFilterStatus,
    sortBy,
    sortOrder,
    tableKey,
    selectedCustomer,
    setSelectedCustomer,
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
    showLockModal,
    isLocking,
    lockError,
    handleLock,
    setShowLockModal,
  };
};