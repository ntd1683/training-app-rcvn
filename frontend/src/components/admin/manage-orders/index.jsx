import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import CustomPagination from '~/components/admin/ui/custom-pagination';
import { OrdersFilter } from './orders-filter';
import { columns, customStyles, exportColumns } from './orders-table-config';
import { useOrderManage } from '~/hooks/admin/use-order-manage';
import ExportButton from '../ui/export-button';
import CardAnalytics from './card-analytics';

const ManageOrders = () => {
  const {
    analytics,
    user,
    isLoading,
    handleSearch,
    handleReset,
    tableKey,
    pagination,
    data,
    handleSort,
    sortBy,
    sortOrder,
    handlePageChange,
    handleRowsPerPageChange,
    filterSearch,
    handleSetFilterName,
    handleSetFilterDate,
    handleSetFilterStatus,
    handleGetAll,
  } = useOrderManage();

  const navigate = useNavigate();

  // eslint-disable-next-line
  const shouldForwardProp = (prop, defaultValidatorFn) => {
    return !['allowOverflow', 'button'].includes(prop) && isPropValid(prop);
  };

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <div className="container-xxl flex-grow-1 container-p-y">
        <CardAnalytics analytics={analytics} />
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center flex-md-row flex-column">
            <h5 className="mb-sm-0">Quản lý Đơn Hàng</h5>
            <ExportButton
                filename='orders'
                exportColumnConfig={exportColumns}
                data={data}
                pagination={pagination}
                handleGetAll={handleGetAll}
              />
          </div>
          <div>
            <OrdersFilter
              filterName={filterSearch.name}
              setFilterName={handleSetFilterName}
              filterDate={filterSearch.date}
              setFilterDate={handleSetFilterDate}
              filterStatus={filterSearch.status}
              setFilterStatus={handleSetFilterStatus}
            />
            <div className="d-flex row gap-3 py-3 px-6 justify-content-end">
              <button className="btn btn-primary col-md-2" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Đang tìm kiếm..." : "Tìm kiếm"}
              </button>
              <button className="btn btn-secondary col-md-3" onClick={handleReset} disabled={isLoading}>
                Xóa bộ lọc
              </button>
            </div>
          </div>
          <div className="px-3 py-2">
            <p className="mb-0">
              Hiển thị từ {pagination.from} ~ {pagination.to} trong tổng số {pagination.total} sản phẩm
            </p>
          </div>
          <div className="card-datatable table-responsive mb-6">
            <DataTable
              key={tableKey}
              columns={columns(navigate, pagination, user)}
              data={data}
              pagination={false}
              customStyles={customStyles}
              noDataComponent={isLoading ? "Đang tải..." : "Không có dữ liệu để hiển thị"}
              sortServer
              onSort={handleSort}
              defaultSortFieldId={sortBy || 'created_at'}
              defaultSortAsc={sortOrder === 'desc'}
              progressPending={isLoading}
              progressComponent={<div className="p-3">Đang tải dữ liệu...</div>}
            />
            {pagination.total > 20 && (
              <CustomPagination
                rowsPerPage={pagination.per_page}
                rowCount={pagination.total}
                currentPage={pagination.current_page}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
              />
            )}
          </div>
        </div>

      </div>
    </StyleSheetManager>
  );
};
export default ManageOrders;