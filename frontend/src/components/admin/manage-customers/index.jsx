import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import DataTable from 'react-data-table-component';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import CustomPagination from '~/components/admin/ui/custom-pagination';
import { CustomersFilter } from './customers-filter';
import { columns, customStyles } from './customers-table-config';
import { DeleteCustomerModal, LockCustomerModal } from './manage-customers-modal';
import { checkRoleAndPermission } from '~/utils/common.jsx';
import { useCustomerManage } from '~/hooks/admin/use-customer-manage';

const ManageCustomers = () => {
  const {
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
    setShowLockModal,
    handleLock,
  } = useCustomerManage();
  const navigate = useNavigate();

  // eslint-disable-next-line
  const shouldForwardProp = (prop, defaultValidatorFn) => {
    return !['allowOverflow', 'button'].includes(prop) && isPropValid(prop);
  };

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <div className="container-fluid flex-grow-1 py-4">
        <div className="card pb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Quản lý khách hàng</h5>
            {checkRoleAndPermission('customers.store', user) && (
              <Link to="/admin/customers/add" className="btn btn-primary">
                <Icon icon="bx:plus" className="me-1" />
                Thêm mới
              </Link>
            )}
          </div>
          <div>
            <CustomersFilter
              filterName={filterName}
              setFilterName={setFilterName}
              filterEmail={filterEmail}
              setFilterEmail={setFilterEmail}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
            <div className="d-flex row gap-3 py-3 px-6 justify-content-end">
              <button className="btn btn-primary col-md-2" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Đang tìm kiếm..." : "Tìm kiếm"}
              </button>
              <button className="btn btn-secondary col-md-2" onClick={handleReset} disabled={isLoading}>
                Xóa bộ lọc
              </button>
            </div>
          </div>
          <div className="px-3 py-2">
            <p className="mb-0">
              Hiển thị từ {pagination.from} ~ {pagination.to} trong tổng số {pagination.total} khách hàng
            </p>
          </div>
          <div className="table-responsive">
            <DataTable
              key={tableKey}
              columns={columns(navigate, pagination, setSelectedCustomer,setShowLockModal, setShowDeleteModal, user)}
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

        <DeleteCustomerModal
          selectedCustomer={selectedCustomer}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          isDeleting={isDeleting}
          deleteError={deleteError}
          handleDelete={handleDelete}
        />

        <LockCustomerModal
          selectedCustomer={selectedCustomer}
          showLockModal={showLockModal}
          setShowLockModal={setShowLockModal}
          isLocking={isLocking}
          lockError={lockError}
          handleLock={handleLock}
        />
      </div>
    </StyleSheetManager>
  );
};
export default ManageCustomers;