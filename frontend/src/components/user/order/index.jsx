import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import Breadcrumbs from "../ui/breadcrumbs"
import { Tab } from './tab';
import { Filters } from './filters';
import { OrderList } from './order-list';

const OrderManagement = () => {
    const [orders] = useState([
        {
            id: 'DH001',
            customerName: 'Nguyễn Văn An',
            phone: '0912345678',
            products: [
                { name: 'Set 10 Miếng Dán Thông Mũi Chống Nghẹt Mũi', quantity: 1, price: 23200 }
            ],
            totalAmount: 23200,
            status: 'pending',
            orderDate: '2024-08-10',
            address: 'Số 123, Đường ABC, Quận 1, TP.HCM',
            paymentMethod: 'COD'
        },
        {
            id: 'DH002',
            customerName: 'Trần Thị Bình',
            phone: '0987654321',
            products: [
                { name: 'Máy massage mặt', quantity: 1, price: 450000, image_url: '1' },
                { name: 'Serum vitamin C', quantity: 2, price: 200000 },
                { name: 'Kem dưỡng da ban đêm', quantity: 1, price: 320000 },
                { name: 'Sữa rửa mặt', quantity: 1, price: 180000 },
            ],
            totalAmount: 650000,
            status: 'completed',
            orderDate: '2024-08-08',
            address: 'Số 456, Đường XYZ, Quận 2, TP.HCM',
            paymentMethod: 'Chuyển khoản'
        },
        {
            id: 'DH003',
            customerName: 'Lê Văn Cường',
            phone: '0909123456',
            products: [
                { name: 'Thuốc bôi trị mụn', quantity: 3, price: 150000 }
            ],
            totalAmount: 450000,
            status: 'shipped',
            orderDate: '2024-08-09',
            address: 'Số 789, Đường DEF, Quận 3, TP.HCM',
            paymentMethod: 'COD'
        },
        {
            id: 'DH004',
            customerName: 'Phạm Thị Dung',
            phone: '0901234567',
            products: [
                { name: 'Kem dưỡng da ban đêm', quantity: 1, price: 320000 },
                { name: 'Sữa rửa mặt', quantity: 1, price: 180000 }
            ],
            totalAmount: 500000,
            status: 'processing',
            orderDate: '2024-08-11',
            address: 'Số 321, Đường GHI, Quận 4, TP.HCM',
            paymentMethod: 'Chuyển khoản'
        },
        {
            id: 'DH005',
            customerName: 'Hoàng Văn Em',
            phone: '0912987654',
            products: [
                { name: 'Nước hoa hồng', quantity: 2, price: 250000 }
            ],
            totalAmount: 500000,
            status: 'completed',
            orderDate: '2024-08-07',
            address: 'Số 654, Đường JKL, Quận 5, TP.HCM',
            paymentMethod: 'COD'
        },
        {
            id: 'DH006',
            customerName: 'Vũ Thị Phượng',
            phone: '0908765432',
            products: [
                { name: 'Mặt nạ collagen', quantity: 5, price: 100000 }
            ],
            totalAmount: 500000,
            status: 'cancelled',
            orderDate: '2024-08-06',
            address: 'Số 987, Đường MNO, Quận 6, TP.HCM',
            paymentMethod: 'COD'
        }
    ]);

    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Trạng thái đơn hàng
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { class: 'bg-warning text-dark', text: 'Chờ xác nhận', icon: 'mdi:clock-outline' },
            processing: { class: 'bg-info text-white', text: 'Đang xử lý', icon: 'mdi:package-variant' },
            shipped: { class: 'bg-primary text-white', text: 'Đang giao', icon: 'mdi:truck' },
            completed: { class: 'bg-success text-white', text: 'Hoàn thành', icon: 'mdi:check-circle' },
            cancelled: { class: 'bg-danger text-white', text: 'Đã hủy', icon: 'mdi:clock' }
        };

        const config = statusConfig[status];

        return (
            <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
                <Icon icon={config.icon} width={15} height={15} />
                {config.text}
            </span>
        );
    };

    // Lọc đơn hàng
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        // Lọc theo tab
        if (activeTab === 'incomplete') {
            filtered = filtered.filter(order =>
                ['pending', 'processing', 'shipped'].includes(order.status)
            );
        } else {
            filtered = filtered.filter(order =>
                ['completed', 'cancelled'].includes(order.status)
            );
        }

        // Tìm kiếm
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.phone.includes(searchTerm)
            );
        }

        // Lọc theo ngày
        if (dateFilter) {
            filtered = filtered.filter(order => order.orderDate === dateFilter);
        }

        return filtered;
    }, [orders, activeTab, searchTerm, dateFilter]);
    return (
        <>
            <Breadcrumbs
                title="<i class='lni lni-package me-2'></i> Quản Lý Đơn hàng"
                items={[
                    { icon: 'lni lni-home', label: "Trang chủ", link: "/" },
                    { label: "Quản Lý Đơn hàng", link: "/quan-ly-don-hang" }
                ]}
            />
            <div className="order container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <Tab activeTab={activeTab} setActiveTab={setActiveTab} orders={orders} />
                            <div className="card-body pt-0">
                                <Filters
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    dateFilter={dateFilter}
                                    setDateFilter={setDateFilter}
                                />
                                <OrderList
                                    filteredOrders={filteredOrders}
                                    getStatusBadge={getStatusBadge}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderManagement;