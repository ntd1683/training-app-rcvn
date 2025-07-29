import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);

  const loadRoles = useCallback(async (page = 1, perPage = 10, filters = {}) => {
    setIsLoading(true);
    try {
      const response = await fetchRoles(page, perPage, filters);
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
    if (!isInitialMount.current) {
      const timer = setTimeout(() => {
        // Search when filterName changes 1.5 seconds after the last change
        loadRoles(1, pagination.per_page, {
          filterName,
          filterPermissions,
        });
      }, isInitialMount.current ? 0 : 1500);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName, filterPermissions]);

  const updateSearchParams = useCallback(() => {
    const params = {};
    
    if (filterName) params.name = filterName;
    if (filterPermissions) params.permissions = filterPermissions;
    if (pagination.current_page !== 1) params.page = pagination.current_page.toString();
    if (pagination.per_page !== 10) params.per_page = pagination.per_page.toString();
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;

    setSearchParams(params, { replace: true });
  }, [pagination, filterName, filterPermissions, sortBy, sortOrder, setSearchParams]);

  useEffect(() => {
    if (isInitialMount.current) {
      const page = parseInt(searchParams.get('page')) || 1;
      const perPage = parseInt(searchParams.get('per_page')) || 10;
      const filterNameFromUrl = searchParams.get('name') || '';
      const filterPermissionsFromUrl = searchParams.get('permissions') || '';
      const sortByFromUrl = searchParams.get('sort_by') || '';
      const sortOrderFromUrl = searchParams.get('sort_order') || '';

      setPagination((prev) => ({ ...prev, current_page: page, per_page: perPage }));
      setFilterName(filterNameFromUrl);
      setFilterPermissions(filterPermissionsFromUrl);
      setSortBy(sortByFromUrl);
      setSortOrder(sortOrderFromUrl);

      loadRoles(page, perPage, {
        filterName: filterNameFromUrl,
        filterPermissions: filterPermissionsFromUrl,
        sortBy: sortByFromUrl,
        sortOrder: sortOrderFromUrl,
      });
    }
  }, [searchParams, loadRoles]);

  useEffect(() => {
    if (!isInitialMount.current) {
      updateSearchParams();
    }
  }, [pagination.current_page, pagination.per_page, filterName, filterPermissions, sortBy, sortOrder, updateSearchParams]);

  const handleSearch = (value) => {
    setFilterName(value);
  };

  const handleReset = () => {
    setFilterName('');
    setFilterPermissions('');
    setSortBy('');
    setSortOrder('');
    setTableKey((prev) => prev + 1);
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
          setTableKey((prev) => prev + 1);
          loadRoles(pagination.current_page, pagination.per_page, { filterName, filterPermissions });
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