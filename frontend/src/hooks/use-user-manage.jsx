import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { fetchUsers, deleteUser, toggleUserStatus, fetchAllRoles } from '~/services/api';

export const useUserManage = () => {

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
  const [filterGroup, setFilterGroup] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [sortClickCount, setSortClickCount] = useState({});
  const [lastSortedColumn, setLastSortedColumn] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isLocking, setIsLocking] = useState(false);
  const [lockError, setLockError] = useState(null);
  const [roles, setRoles] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);

  const loadUsers = useCallback(async (page = 1, perPage = 10, filters = {}) => {
    setIsLoading(true);
    try {
      const response = await fetchUsers(page, perPage, filters);
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

  const loadRoles = useCallback(async () => {
    try {
      const response = await fetchAllRoles();
      if (response.success) {
        setRoles(response.data);
      } else {
        toast.error('Không thể tải danh sách nhóm người dùng.', { toastId: 'fetch-roles-error-toast' });
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách nhóm người dùng.', { toastId: 'fetch-roles-error-toast' });
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  useEffect(() => {
    if (isInitialMount.current) {
      const page = parseInt(searchParams.get('page')) || 1;
      const perPage = parseInt(searchParams.get('per_page')) || 10;
      const filterNameUrl = searchParams.get('name') || '';
      const filterEmailFromUrl = searchParams.get('email') || '';
      const filterGroupRoleFromUrl = searchParams.get('role') || '';
      const filterStatusFromUrl = searchParams.get('status') || '';
      const sortByFromUrl = searchParams.get('sort_by') || '';
      const sortOrderFromUrl = searchParams.get('sort_order') || '';

      setFilterName(filterNameUrl);
      setFilterEmail(filterEmailFromUrl);
      setFilterGroup(filterGroupRoleFromUrl);
      setFilterStatus(filterStatusFromUrl);
      setSortBy(sortByFromUrl);
      setSortOrder(sortOrderFromUrl);

      loadUsers(page, perPage, {
        filterName: filterNameUrl,
        filterEmail: filterEmailFromUrl,
        filterGroup: filterGroupRoleFromUrl,
        filterStatus: filterStatusFromUrl,
        sortBy: sortByFromUrl,
        sortOrder: sortOrderFromUrl,
      });
    }
  }, [searchParams, loadUsers]);

  const updateSearchParams = useCallback(() => {
    const params = {};

    if (searchParams.get('name')) params.name = searchParams.get('name');
    if (searchParams.get('email')) params.email = searchParams.get('email');
    if (searchParams.get('role')) params.role = searchParams.get('role');
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
    if (filterGroup) params.role = filterGroup;
    if (filterStatus) params.status = filterStatus;
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    if (pagination.per_page !== 10) params.per_page = pagination.per_page.toString();

    setSearchParams(params, { replace: true });
    loadUsers(1, pagination.per_page, { filterName, filterEmail, filterGroup, filterStatus, sortBy, sortOrder });
  };

  const handleReset = () => {
    setFilterName('');
    setFilterEmail('');
    setFilterGroup('');
    setFilterStatus('');
    setSortBy('');
    setSortOrder('');
    setSortClickCount({});
    setLastSortedColumn('');
    setTableKey((prev) => prev + 1);
    setSearchParams({}, { replace: true });
    loadUsers(1, pagination.per_page, {});
  };

  const handlePageChange = (page) => {
    loadUsers(page, pagination.per_page, { filterName, filterEmail, filterGroup, filterStatus, sortBy, sortOrder });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    loadUsers(1, newRowsPerPage, { filterName, filterEmail, filterGroup, filterStatus, sortBy, sortOrder });
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
          loadUsers(pagination.current_page, pagination.per_page, {
            filterName,
            filterEmail,
            filterGroup,
            filterStatus,
          });
          return;
        }
      }

      setSortBy(selector);
      setSortOrder(sortDirection);
      loadUsers(pagination.current_page, pagination.per_page, {
        filterName,
        filterEmail,
        filterGroup,
        filterStatus,
        sortBy: selector,
        sortOrder: sortDirection,
      });
    }
  };

  const handleDelete = async (userId) => {
    if (!userId) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      const response = await deleteUser(userId);
      if (!response) throw new Error('Xoá không thành công');
      setData(data.filter(user => user.id !== userId));
      setShowDeleteModal(false);
      toast.success('Xoá thành viên thành công!');
    } catch (error) {
      setDeleteError('Có lỗi xảy ra khi xoá thành viên.');
      toast.error('Xoá không thành công.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLock = async (userId) => {
    if (!userId) return;
    const textLock = selectedUser.is_active === 1 ? 'Khoá' : 'Mở khoá';
    try {
      setIsLocking(true);
      setLockError(null);
      const response = await toggleUserStatus(userId);
      if (!response) throw new Error(`${textLock} không thành công`);
      setData(data.map(user =>
        user.id === userId ? { ...user, is_active: selectedUser.is_active === 1 ? 0 : 1 } : user
      ));
      setShowLockModal(false);
      toast.success(`${textLock} thành viên thành công!`);
    } catch (error) {
      setLockError(`Có lỗi xảy ra khi ${selectedUser.is_active === 1 ? 'Khoá' : 'Mở khoá'}.`);
      toast.error(`${textLock} không thành công.`);
    } finally {
      setIsLocking(false);
    }
  };

  return {
    data,
    roles,
    isLoading,
    pagination,
    filterName,
    setFilterName,
    filterEmail,
    setFilterEmail,
    filterGroup,
    setFilterGroup,
    filterStatus,
    setFilterStatus,
    sortBy,
    sortOrder,
    tableKey,
    selectedUser,
    setSelectedUser,
    showDeleteModal,
    setShowDeleteModal,
    showLockModal,
    setShowLockModal,
    isDeleting,
    deleteError,
    isLocking,
    lockError,
    handleSearch,
    handleReset,
    handlePageChange,
    handleRowsPerPageChange,
    handleSort,
    handleDelete,
    handleLock,
  };
};