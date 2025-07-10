import { tab } from '@testing-library/user-event/dist/tab';
import { useState, useEffect } from 'react';
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
  const [filterText, setFilterText] = useState('');
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

  // Load users
  const loadUsers = async (page = 1, perPage = 10, filters = {}) => {
    setIsLoading(true);
    try {
      const response = await fetchUsers(page, perPage, filters);
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

  const loadRoles = async () => {
    try {
      const response = await fetchAllRoles();
      if (response.success) {
        setRoles(response.data);
      } else {
        toast.error('Không thể tải danh sách nhóm người dùng.', { toastId: 'fetch-roles-error-toast' });
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách nhóm người dùng.', { toastId: 'fetch-roles-error-toast' });
    }
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  // Handlers
  const handleSearch = () => {
    loadUsers(1, pagination.per_page, { filterText, filterEmail, filterGroup, filterStatus, sortBy, sortOrder });
  };

  const handleReset = () => {
    setFilterText('');
    setFilterEmail('');
    setFilterGroup('');
    setFilterStatus('');
    setSortBy('');
    setSortOrder('');
    setSortClickCount({});
    setLastSortedColumn('');
    setTableKey(prev => prev + 1);
    loadUsers(1, pagination.per_page, {});
  };

  const handlePageChange = (page) => {
    loadUsers(page, pagination.per_page, { filterText, filterEmail, filterGroup, filterStatus, sortBy, sortOrder });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    loadUsers(1, newRowsPerPage, { filterText, filterEmail, filterGroup, filterStatus, sortBy, sortOrder });
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
          
          loadUsers(pagination.current_page, pagination.per_page, {});
          return;
        }
      }
      
      setSortBy(selector);
      setSortOrder(sortDirection);
      loadUsers(pagination.current_page, pagination.per_page, {
        filterText,
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
      toast.success('Xoá thành viên thành công!', { toastId: 'delete-success-toast' });
    } catch (error) {
      setDeleteError('Có lỗi xảy ra khi xoá thành viên.');
      toast.error('Xoá không thành công.', { toastId: 'delete-error-toast' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLock = async (userId) => {
    if (!userId) return;
    const textLock = selectedUser.is_active === 1 ? 'khoá' : 'mở khoá';
    try {
      setIsLocking(true);
      setLockError(null);
      const response = await toggleUserStatus(userId);
      if (!response) throw new Error(`${textLock} không thành công`);
      setData(data.map(user => 
        user.id === userId ? { ...user, is_active: selectedUser.is_active === 1 ? 0 : 1 } : user
      ));
      setShowLockModal(false);
      toast.success(`${textLock} thành viên thành công!`, { toastId: 'lock-success-toast' });
    } catch (error) {
      setLockError(`Có lỗi xảy ra khi ${selectedUser.is_active === 1 ? 'khoá' : 'mở khoá'}.`);
      toast.error(`${textLock} không thành công.`, { toastId: 'lock-error-toast' });
    } finally {
      setIsLocking(false);
    }
  };

  return {
    data,
    roles,
    isLoading,
    pagination,
    filterText,
    setFilterText,
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