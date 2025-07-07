import { Icon } from '@iconify/react';

export const columns = (navigate, pagination, currentUserId, setSelectedUser, setShowDeleteModal, setShowLockModal) => [
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
        name: 'Nhóm',
        selector: row => row.group_role,
        sortable: true,
    },
    {
        name: 'Trạng thái',
        selector: row => row.is_active,
        sortable: true,
        cell: row => (
            <span
                className={`badge ${row.is_active === 1 ? 'bg-primary' : 'bg-danger'} me-1`}
                style={{ fontSize: '13px' }}
            >
                {row.is_active === 1 ? 'Hoạt động' : 'Đang tạm khoá'}
            </span>
        ),
    },
    {
        name: '',
        cell: (row) => (
            <div className="d-flex gap-2">
                <button type="button" className="btn p-0" onClick={() => {
                    navigate(`/users/edit/${row.id}`);
                }}>
                    <Icon icon="bx:pen" className="text-primary fs-4" />
                </button>
                {row.id != currentUserId ? (
                    <button type="button" className="btn p-0" onClick={() => {
                        setSelectedUser(row);
                        setShowDeleteModal(true);
                    }}>
                        <Icon icon="bx:trash" className="text-danger fs-4" />
                    </button>
                ) : null}
                <button type="button" className="btn p-0" onClick={() => {
                    setSelectedUser(row);
                    setShowLockModal(true);
                }}>
                    <Icon icon="bx:user-x" className="fs-4" />
                </button>
            </div>
        ),
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