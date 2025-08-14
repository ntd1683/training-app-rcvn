import React from 'react';
import Breadcrumbs from "../ui/breadcrumbs"
import { Tab } from './tab';
import { Filters } from './filters';
import { OrderList } from './order-list';
import { useOrders } from '~/hooks/user/use-orders';

const OrderManagement = () => {
    const {
        data,
        hasMore,
        handleLoadMore,
        inputName,
        inputDate,
        setInputName,
        setInputDate,
        filterStatus,
        setFilterStatus,
        isLoading,
        isLoadingMore,
        handleSearch,
        handleReset,
    } = useOrders();
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
                            <Tab activeTab={filterStatus} setActiveTab={setFilterStatus} />
                            <div className="card-body pt-0">
                                <Filters
                                    inputName={inputName}
                                    setInputName={setInputName}
                                    inputDate={inputDate}
                                    setInputDate={setInputDate}
                                    onSearch={handleSearch}
                                    onResetSearch={handleReset}
                                />
                                {isLoading && data.length === 0 ? (
                                    <div className="row">
                                        {[1, 2, 3].map((item) => (
                                            <div key={item} className="col-12 mb-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div className="placeholder-glow">
                                                                <span className="placeholder col-3"></span>
                                                            </div>
                                                            <div className="placeholder-glow">
                                                                <span className="placeholder col-4"></span>
                                                            </div>
                                                        </div>
                                                        <div className="placeholder-glow mb-2">
                                                            <span className="placeholder col-7"></span>
                                                        </div>
                                                        <div className="placeholder-glow">
                                                            <span className="placeholder col-4"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <OrderList
                                        orders={data}
                                        onLoadMore={handleLoadMore}
                                        hasMore={hasMore}
                                        isLoading={isLoadingMore}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderManagement;