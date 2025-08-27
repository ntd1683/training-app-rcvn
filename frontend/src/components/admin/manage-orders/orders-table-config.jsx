import React from 'react';
import { Icon } from '@iconify/react';
import OrderStatus from '~/constants/order-status';
import '~/assets/css/admin/image-tooltip.css';
import { checkRoleAndPermission, combinedAddress, formatDate } from '~/utils/common';

export const columns = (navigate, pagination, user) => [
    {
        id: 'index',
        name: '#',
        cell: (row, index) => index + 1 + (pagination.current_page - 1) * pagination.per_page,
        sortable: false,
        width: '80px',
    },
    {
        id: 'order_code',
        name: 'Mã đơn hàng',
        selector: row => row.order_code,
        sortable: false,
    },
    {
        id: 'created_at',
        name: 'Ngày mua hàng',
        selector: row => formatDate(row.created_at),
        sortable: true,
        sortBy: 'created_at',
    },
    {
        id: 'total_amount',
        name: 'Tổng tiền',
        selector: row => row.price,
        cell: row => row.total_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        sortable: true,
        sortBy: 'total_amount',
        right: true,
    },
    {
        id: 'recipient_name',
        name: 'Người nhận',
        selector: row => row?.recipient_name?.trim().split(' ').pop(),
        sortable: true,
        sortBy: 'recipient_name',
    },
    {
        id: 'status',
        name: 'Trạng thái',
        sortable: true,
        selector: row => row.status,
        cell: row => {
            const status = row.status;
            let colorStatus = "";
            switch (status) {
                case OrderStatus.PENDING:
                    colorStatus = 'bg-warning';
                    break;
                case OrderStatus.PROCESSING:
                    colorStatus = 'bg-info';
                    break;
                case OrderStatus.COMPLETED:
                    colorStatus = 'bg-success';
                    break;
                case OrderStatus.PAYMENT_FAILED:
                    colorStatus = 'bg-danger';
                    break;
                default:
                    colorStatus = 'bg-primary';
            }

            return (
                <span className={`badge ${colorStatus} me-1`} style={{ fontSize: '13px' }}>
                    {OrderStatus.getStatusText(status)}
                </span>
            );
        },
    },
    {
        id: 'actions',
        name: '',
        cell: (row) => (
            <div className="d-flex gap-2">
                { checkRoleAndPermission('orders.edit', user) && (
                    <button type="button" className="btn p-0" onClick={() => {
                        navigate(`/admin/order/${row.id}`);
                    }}>
                        <Icon icon="bx:pen" className="text-primary fs-4" />
                    </button>
                )}
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

export const exportColumns = (pagination) => {
    return [
        {
            id: 'index',
            name: '#',
            getValue: (row, index) => index + 1 + (pagination.current_page - 1) * pagination.per_page,
        },
        {
            id: 'order_code',
            name: 'Mã đơn hàng',
            getValue: row => row.order_code,
        },
        {
            id: 'created_at',
            name: 'Ngày mua hàng',
            getValue: row => formatDate(row.created_at),
        },
        {
            id: 'total_amount',
            name: 'Tổng tiền',
            getValue: row => row.total_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        },
        {
            id: 'recipient_name',
            name: 'Tên Người nhận',
            getValue: row => row?.recipient_name || '',
        },
        {
            id: 'recipient_phone',
            name: 'Số điện thoại',
            getValue: row => row?.recipient_phone || '',
        },
        {
            id: 'recipient_address',
            name: 'Địa chỉ',
            getValue: row => combinedAddress(
                row.recipient_address,
                row.recipient_ward,
                row.recipient_district,
                row.recipient_province
            ) || '',
        },
        {
            id: 'post_code',
            name: 'Mã bưu điện',
            getValue: row => row?.post_code || '',
        },
        {
            id: 'note',
            name: 'Ghi chú',
            getValue: row => row?.note || '',
        },
        {
            id: 'status',
            name: 'Trạng thái',
            getValue: row => OrderStatus.getStatusText(row.status),
        },
    ]
}