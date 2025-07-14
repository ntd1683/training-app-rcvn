import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import DataTable from 'react-data-table-component';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import CustomPagination from '~/components/ui/custom-pagination';
import { useProductManage } from '~/hooks/use-product-manage';
import { ProductsFilter } from './products-filter';
import { columns, customStyles } from './products-table-config';
import { DeleteProductsModal } from './manage-products-modal';

const ManageProducts = () => {
  const {
    data,
    roles,
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
    sortBy,
    sortOrder,
    tableKey,
  } = useProductManage();
  const navigate = useNavigate();

  const shouldForwardProp = (prop, defaultValidatorFn) => {
    return !['allowOverflow', 'button'].includes(prop) && isPropValid(prop);
  };

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <div className="container-fluid flex-grow-1 py-4">
        <div className="card pb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Quản lý Sản Phẩm</h5>
            <Link to="/products/add" className="btn btn-primary">
              <Icon icon="bx:plus" className="me-1" />
              Thêm mới
            </Link>
          </div>
          <div>
            <ProductsFilter
              filterText={filterText}
              setFilterText={setFilterText}
              filterPriceFrom={filterPriceFrom}
              setFilterPriceFrom={setFilterPriceFrom}
              filterPriceTo={filterPriceTo}
              setFilterPriceTo={setFilterPriceTo}
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
              columns={columns(navigate, pagination, setSelectedProduct, setShowDeleteModal)}
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

        <DeleteProductsModal
          selectedProduct={selectedProduct}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          isDeleting={isDeleting}
          deleteError={deleteError}
          handleDelete={handleDelete}
        />
      </div>
    </StyleSheetManager>
  );
};
export default ManageProducts;