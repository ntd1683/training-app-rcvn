import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import DataTable from 'react-data-table-component';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import CustomPagination from '~/components/ui/custom-pagination';
import { columns, customStyles } from './permissions-table-config';
import { usePermissionManage } from '~/hooks/use-permission-manage';
import { checkRoleAndPermission } from '~/utils/common';

const Permissions = () => {
    const {
        data,
        isLoading,
        pagination,
        handleSearch,
        handlePageChange,
        handleRowsPerPageChange,
        handleSort,
        filterName,
        sortBy,
        sortOrder,
        tableKey,
    } = usePermissionManage();
    const navigate = useNavigate();

    const shouldForwardProp = (prop, defaultValidatorFn) => {
        return !['allowOverflow', 'button'].includes(prop) && isPropValid(prop);
    };
    return (
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <div className="container-fluid flex-grow-1 py-4">
                <div className="card pb-4">
                    <div className="card-header d-block d-sm-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Quản lý Quyền</h5>
                        {checkRoleAndPermission('permissions.store') && (
                            <Link to="/permissions/add" className="btn btn-primary mt-sm-0 mt-3 ms-sm-3 d-flex d-sm-inline-flex align-items-center">
                                <Icon icon="bx:plus" className="me-1" />
                                Thêm mới
                            </Link>
                        )}
                    </div>
                    <div className="col-md-6 px-6 py-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm Quyền..."
                                value={filterName}
                                onChange={e => handleSearch(e.target.value)}
                            />
                        </div>
                    <div className="px-6 py-2">
                        <p className="mb-0">
                            Hiển thị từ {pagination.from} ~ {pagination.to} trong tổng số {pagination.total} Quyền
                        </p>
                    </div>
                    <div className="table-responsive">
                        <DataTable
                            key={tableKey}
                            columns={columns(navigate, pagination)}
                            data={data}
                            pagination={false}
                            customStyles={customStyles}
                            noDataComponent={isLoading ? "Đang tải..." : "Không có dữ liệu để hiển thị"}
                            sortServer
                            onSort={handleSort}
                            defaultSortFieldId={sortBy || 'id'}
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
}

export default Permissions;