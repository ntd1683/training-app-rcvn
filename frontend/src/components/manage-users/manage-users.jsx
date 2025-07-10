import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import DataTable from 'react-data-table-component';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import CustomPagination from '~/components/ui/custom-pagination';
import { useUserManage } from '~/hooks/use-user-manage';
import { UsersFilter } from './users-filter';
import { columns, customStyles } from './user-table-config';
import { DeleteUserModal, LockUserModal } from './manage-users-modal';

const ManageUsers = () => {
  const {
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
    sortBy,
    sortOrder,
    tableKey,
  } = useUserManage();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = user.id;

  const shouldForwardProp = (prop, defaultValidatorFn) => {
    return !['allowOverflow', 'button'].includes(prop) && isPropValid(prop);
  };

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <div className="container-fluid flex-grow-1 py-4">
        <div className="card pb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Quản lý Users</h5>
            <Link to="/users/add" className="btn btn-primary">
              <Icon icon="bx:plus" className="me-1" />
              Thêm mới
            </Link>
          </div>
          <div>
            <UsersFilter
              filterText={filterText}
              setFilterText={setFilterText}
              filterEmail={filterEmail}
              setFilterEmail={setFilterEmail}
              roles={roles}
              filterGroup={filterGroup}
              setFilterGroup={setFilterGroup}
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
              Hiển thị từ {pagination.from} ~ {pagination.to} trong tổng số {pagination.total} thành viên
            </p>
          </div>
          <div className="table-responsive">
            <DataTable
              key={tableKey}
              columns={columns(navigate, pagination, currentUserId, setSelectedUser, setShowDeleteModal, setShowLockModal)}
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

        <DeleteUserModal
          selectedUser={selectedUser}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          isDeleting={isDeleting}
          deleteError={deleteError}
          handleDelete={handleDelete}
        />

        <LockUserModal
          selectedUser={selectedUser}
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
export default ManageUsers;