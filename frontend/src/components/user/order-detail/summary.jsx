import React from 'react';
import { Icon } from '@iconify/react';
import { formatPrice } from '~/utils/common';

const Summary = ({ orderData }) => {
    
    const total_product = () => {
        return orderData.products.reduce((total, product) => total + product.order_price * product.order_quantity, 0);
    };

    return (
        <div className="row">
            <div className="col-12">
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        <div className="row">
                            <div className="col-md-8"></div>
                            <div className="col-md-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tổng tiền hàng</span>
                                    <span>{formatPrice(total_product())}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Phí nền tảng</span>
                                    <span>{orderData.fee ? formatPrice(orderData.fee) : 'Miễn phí'}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <strong>Thành tiền</strong>
                                    <strong className="text-danger">{formatPrice(orderData.totalAmount)}</strong>
                                </div>
                                <div className="text-end">
                                    <small className="text-muted">Phương thức Thanh toán</small><br />
                                    <small className="fw-bold"
                                    ><Icon icon="mdi:paypal" width="24" /> {orderData.payment_type ?? 'Chưa xác định'}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Summary;