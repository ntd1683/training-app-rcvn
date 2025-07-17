import { Icon } from '@iconify/react';
import { checkRoleAndPermission } from '~/utils/common';

export const columns = (navigate, pagination) => [
    {
        name: '#',
        cell: (row, index) => index + 1 + (pagination.current_page - 1) * pagination.per_page,
        sortable: false,
        center: true,
    },
    {
        name: 'Tên Quyền',
        selector: row => row.name,
        sortable: true,
        center: true,
    },
    {
        name: 'Số lượng vai trò sử dụng',
        selector: row => row.roles_count,
        sortable: true,
        center: true,
    },
    {
        name: 'Hành động',
        cell: (row) => (
            <div className="d-flex gap-2">
                { checkRoleAndPermission('permissions.edit') && (
                    <button type="button" className="btn p-0" onClick={() => {
                        navigate(`/permissions/edit/${row.id}`);
                    }}>
                        <Icon icon="bx:pen" className="text-primary" width="20px"/>
                        <span className="ms-1 d-none d-sm-inline">Chỉnh Sửa</span>
                    </button>
                )}
            </div>
        ),
        allowOverflow: true,
        sortable: false,
        center: true,
    },
];

export const customStyles = {
    headCells: {
        style: {
            backgroundColor: '#f8f9fa',
            fontWeight: 'bold',
            fontSize: '14px',
        },
    },
    cells: {
        style: {
            padding: '12px',
            fontSize: '14px',
            minHeight: '60px',
        },
    },
};