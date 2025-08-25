import { Icon } from '@iconify/react';
import { checkRoleAndPermission } from '~/utils/common';

export const columns = (navigate, pagination, setSelectedCustomer, setShowLockModal, setShowDeleteModal, user) => [
    {
        name: '#',
        cell: (row, index) => index + 1 + (pagination.current_page - 1) * pagination.per_page,
        sortable: false,
        width: '80px',
    },
    {
        name: 'Họ tên',
        selector: row => row.name,
        sortable: true,
    },
    {
        name: 'Email',
        selector: row => row.email,
        sortable: true,
    },
    {
        name: 'Số lượng đơn hàng',
        selector: row => row.total_orders,
        sortable: true,
        center: true,
    },
    {
        name: 'Trạng thái',
        selector: row => row.deleted_at,
        sortable: true,
        cell: row => (
            <span
                className={`badge ${row.deleted_at ? 'bg-danger' : 'bg-primary'} me-1`}
                style={{ fontSize: '13px' }}
            >
                {row.deleted_at ? 'Đã xoá' : 'Hoạt động'}
            </span>
        ),
    },
    {
        name: '',
        cell: (row) => {
            return (
                <div className="d-flex gap-2">
                    {checkRoleAndPermission('customers.edit', user) && (
                        <button type="button" className="btn p-0" onClick={() => {
                            navigate(`/admin/customers/edit/${row.id}`);
                        }}>
                            <Icon icon="bx:pen" className="text-primary fs-4" />
                        </button>
                    )}
                    {!row.deleted_at && checkRoleAndPermission('customers.delete', user) && (
                        <button type="button" className="btn p-0" onClick={() => {
                            setSelectedCustomer(row);
                            setShowDeleteModal(true);
                        }}>
                            <Icon icon="bx:trash" className="text-danger fs-4" />
                        </button>
                    )}
                    {row.deleted_at && checkRoleAndPermission('customers.update', user) && (
                        <button type="button" className="btn p-0" onClick={() => {
                            setSelectedCustomer(row);
                            setShowLockModal(true);
                        }}>
                            <Icon icon="bx:lock-open" className="fs-4" />
                        </button>
                    )}
                </div>
            );
        },
        allowOverflow: true,
        button: true,
        sortable: false,
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
        },
    },
};