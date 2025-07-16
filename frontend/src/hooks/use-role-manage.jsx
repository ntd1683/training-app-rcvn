import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchRoles } from '~/services/api';

export const useRoleManage = () => {

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
  const [filterPermissions, setFilterPermissions] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [sortClickCount, setSortClickCount] = useState({});
  const [lastSortedColumn, setLastSortedColumn] = useState('');
  const [tableKey, setTableKey] = useState(0);
  
  const isInitialMount = useRef(true);

  // Load roles
  const loadRoles = useCallback(async (page = 1, perPage = 10, filters = {}) => {
    setIsLoading(true);
    try {
      const response = await fetchRoles(page, perPage, filters);
      if (response.success) {
        setData(response.data);
        if (!isInitialMount.current) {
          setPagination(response.pagination);
        } else {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            from: response.pagination.from,
            to: response.pagination.to,
          }));
        }
      }
    } catch (error) {
      setData([]);
    } finally {
      setIsLoading(false);
      if (isInitialMount.current) {
        isInitialMount.current = false;
      }
    }
  },[]);

  useEffect(() => {
    const timer = setTimeout(() => {
    // Search when filterName changes 1.5 seconds after the last change
        loadRoles(1, pagination.per_page, { 
          filterName, 
          filterPermissions, 
        });
    }, isInitialMount.current ? 0 : 1500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName, filterPermissions]);

  const handleSearch = (value) => {
    setFilterName(value);
  };

  const handleReset = () => {
    setFilterName('');
    setFilterPermissions('');
    setSortBy('');
    setSortOrder('');
    loadRoles(1, pagination.per_page, {});
  };

  const handlePageChange = (page) => {
    loadRoles(page, pagination.per_page, { filterName, filterPermissions, sortBy, sortOrder });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    loadRoles(1, newRowsPerPage, { filterName, filterPermissions, sortBy, sortOrder });
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

          loadRoles(pagination.current_page, pagination.per_page, {});
          return;
        }
      }

      setSortBy(selector);
      setSortOrder(sortDirection);
      loadRoles(pagination.current_page, pagination.per_page, {
        filterName,
        filterPermissions,
        sortBy: selector,
        sortOrder: sortDirection,
      });
    }
  };

  return {
    data,
    isLoading,
    pagination,
    filterName,
    setFilterName,
    filterPermissions,
    setFilterPermissions,
    sortBy,
    sortOrder,
    handleSearch,
    handleReset,
    handlePageChange,
    handleRowsPerPageChange,
    handleSort,
    tableKey,
  };
};