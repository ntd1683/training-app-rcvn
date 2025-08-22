import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../ui/breadcrumbs';
import Progress from './progress';
import Header from './header';
import Timeline from './timeline';
import RecipientInfo from './recipient-info';
import ProductsInfo from './products-info';
import Summary from './summary';
import { useOrderDetail } from '~/hooks/user/use-order-detail';
import Modal from '../ui/modal';
import { PayPalButton } from '../checkout/paypal-button';
import OrderStatus from '~/constants/order-status';
import moment from 'moment';

const OrderDetailPage = () => {
    const {
        currentOrder,
        showModal,
        handleCreateOrder,
        handleApproveOrder,
        handleCancelOrder,
        handleErrorOrder,
        setShowModal,
    } = useOrderDetail();

    return (
        <>
            <Breadcrumbs
                title="<i class='lni lni-package me-2'></i> Chi tiết Đơn hàng"
                items={[
                    { icon: 'lni lni-home', label: "Trang chủ", link: "/" },
                    { label: "Đơn hàng", link: "/don-hang" },
                    { label: "Chi tiết Đơn hàng" }
                ]}
            />
            <div className="container-fluid order-detail bg-light min-vh-100 py-3">
                <div className="container">
                    <Header orderData={currentOrder} />

                    {/* Order Progress */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="row">
                                        <Progress status={currentOrder.status} />
                                    </div>

                                    <div className="mt-4 p-3 bg-light rounded row d-flex justify-content-end">
                                        {(currentOrder.status !== OrderStatus.COMPLETED
                                            && moment().diff(moment(currentOrder.updated_at), 'days') <= 30
                                        ) && (
                                            <button
                                                className="btn btn-danger me-md-3 col-md-3 mb-3 mb-md-0"
                                                onClick={() => setShowModal(true)}
                                            >Thanh Toán Lại</button>
                                        )}
                                        <Link
                                            to="tel:+1234567890"
                                            className='btn btn-outline-primary col-md-3'
                                        >Liên Hệ Người Bán</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h5 className="mb-4">Địa Chỉ Nhận Hàng</h5>
                                    <RecipientInfo recipient={currentOrder.recipient} />
                                    <Timeline timeline={currentOrder.order_timeline} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h5 className="mb-4">Ghi Chú Đơn Hàng</h5>
                                    <p>{currentOrder?.recipient?.note}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ProductsInfo products={currentOrder.products} />
                    <Summary orderData={currentOrder} />
                </div>
            </div>
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={`Thanh toán đơn hàng cũ`}
                showCloseButton={true}
                backdrop={true}
                keyboard={true}
                footer={
                    <div className='mt-3 row w-100 px-5'>
                        <button
                            className="btn btn-secondary mb-3"
                            onClick={() => setShowModal(false)}
                        >
                            Hủy bỏ
                        </button>
                        <PayPalButton
                            handleCreateOrder={handleCreateOrder}
                            handleApproveOrder={handleApproveOrder}
                            handleCancelOrder={handleCancelOrder}
                            handleErrorOrder={handleErrorOrder}
                            className="px-0"
                        />
                    </div>
                }
            >
                <p className='mb-0'>
                    Bạn chắc chắn muốn thanh toán lại đơn hàng <strong>{currentOrder.order_code}</strong> này? Đơn hàng sẽ được xử lý lại và bạn sẽ nhận được email xác nhận mới.
                </p>
            </Modal>
        </>
    );
};

export default OrderDetailPage;