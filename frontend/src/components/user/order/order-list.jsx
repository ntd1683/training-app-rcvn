import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { formatPrice } from '~/utils/common';
import Image from '~/assets/images/404-not-found.png'

export const OrderList = ({ filteredOrders, getStatusBadge }) => {
    return (
        <div className="order-list">
            {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                    const displayProducts = order.products.slice(0, 3);
                    const remainingCount = order.products.length - 3;

                    return (
                        <div key={order.id} className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="badge bg-light text-dark border">
                                            <Icon icon="mdi:package-variant-closed" width={24} height={24} className="me-1" />
                                            {order.id}
                                        </span>
                                    </div>
                                    <div className="text-end">
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>

                                {displayProducts.map((product, index) => (
                                    <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                        <div className="me-3">
                                            <div
                                                className="bg-light rounded d-flex align-items-center justify-content-center"
                                                style={{ width: '60px', height: '60px' }}
                                            >
                                                {product.image_url ? (
                                                    <img
                                                        src={Image}
                                                        alt={product.name}
                                                        className="img-fluid rounded"
                                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                    />
                                                ) : (
                                                    <Icon icon="mdi:package-variant-closed" width={24} height={24} className="text-muted" />

                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1 text-primary">{product.name}</h6>
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="text-muted">x{product.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="text-danger fw-bold">{formatPrice(product.price * product.quantity)}</div>
                                        </div>
                                    </div>
                                ))}

                                {remainingCount > 0 && (
                                    <div className="text-center mb-3 pb-3 border-bottom">
                                        <span className="text-muted fs-6">
                                            <Icon icon="mdi:package-variant-plus" className='me-2' width="24" height="24" />
                                            + {remainingCount} sản phẩm
                                        </span>
                                    </div>
                                )}

                                <div className="d-flex justify-content-between align-items-center pt-2">
                                    <div>
                                        <strong>Thành tiền: </strong>
                                        <span className="ms-2 text-danger fw-bold fs-5">{formatPrice(order.totalAmount)}</span>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <a
                                            className="btn btn-outline-primary btn-sm"
                                            data-bs-toggle="modal"
                                            data-bs-target="#orderDetailModal"
                                        >
                                            <Icon icon="mdi:eye" width={16} height={16} className="me-1" />
                                            Chi tiết
                                        </a>
                                        <Link to="tel:0912345678" className="btn btn-outline-secondary btn-sm">
                                            Liên Hệ Người Bán
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-top">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <small className="text-muted">
                                                <strong>Khách hàng:</strong> {order.customerName}
                                            </small>
                                        </div>
                                        <div className="col-md-4">
                                            <small className="text-muted">
                                                <strong>Số điện thoại:</strong> {order.phone}
                                            </small>
                                        </div>
                                        <div className="col-md-4">
                                            <small className="text-muted">
                                                <strong>Ngày mua hàng:</strong> {order.orderDate}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <Icon icon="mdi:package-variant-closed" width={48} height={48} className="mb-3" />
                        <p>Không tìm thấy đơn hàng nào</p>
                    </div>
                </div>
            )}
        </div>
    );
}