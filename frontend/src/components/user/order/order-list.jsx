import React, { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { formatPrice, truncateText } from '~/utils/common';
import OrderStatus from '~/constants/order-status';
import moment from 'moment';

export const OrderList = ({ orders, onLoadMore, hasMore = true, isLoading = false }) => {
    const loadingRef = useRef(null);

    const getStatusBadge = (status) => {
        const statusConfig = {
            [OrderStatus.PENDING]: { class: 'bg-warning text-dark', icon: 'mdi:clock-outline' },
            [OrderStatus.PROCESSING]: { class: 'bg-info text-white', icon: 'mdi:package-variant' },
            [OrderStatus.COMPLETED]: { class: 'bg-success text-white', icon: 'mdi:check-circle' },
            [OrderStatus.PAYMENT_FAILED]: { class: 'bg-danger text-white', icon: 'mdi:clock' }
        };
        const config = statusConfig[status];
        return (
            <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
                <Icon icon={config.icon} width={15} height={15} />
                {OrderStatus.getStatusText(status)}
            </span>
        );
    };

    const formatDate = (timeString) => {
        return moment(timeString).format('HH:mm:ss DD-MM-YYYY');
    };

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading && onLoadMore) {
            onLoadMore();
        }
    }, [hasMore, isLoading, onLoadMore]);

    useEffect(() => {
        const element = loadingRef.current;
        if (!element) return;

        // KHi loading ref xuất hiện 10% cách mép 10px
        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
            rootMargin: '10px'
        });

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [handleObserver]);

    return (
        <div 
            className="order-list"
        >
            {orders.length > 0 ? (
                <>
                    {orders.map((order) => {
                        const displayProducts = order.products.slice(0, 3);
                        const remainingCount = order.products.length - 3;

                        return (
                            <div key={order.id} className="card mb-3 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge bg-light text-dark border">
                                                <Icon icon="mdi:package-variant-closed" width={24} height={24} className="me-1" />
                                                {truncateText(order.order_code, 20)}
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
                                                            src={product.image_url}
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
                                                <h6 className="mb-1 text-primary">{truncateText(product.name, 50)}</h6>
                                                <div className="d-flex align-items-center gap-3">
                                                    <span className="text-muted">x{product.order_quantity}</span>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <div className="text-danger fw-bold">{formatPrice(product.order_price * product.order_quantity)}</div>
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
                                            <span className="ms-2 text-danger fw-bold fs-5">{formatPrice(parseFloat(order.total_amount))}</span>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Link to={`/don-hang-chi-tiet/${order.id}`} className="btn btn-outline-primary btn-sm">
                                                <Icon icon="mdi:eye" width={16} height={16} className="me-1" />
                                                Chi tiết
                                            </Link>
                                            <Link to="tel:0912345678" className="btn btn-outline-secondary btn-sm">
                                                Liên Hệ Người Bán
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-top">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <small className="text-muted">
                                                    <strong>Khách hàng:</strong> {order.recipient_name}
                                                </small>
                                            </div>
                                            <div className="col-md-4">
                                                <small className="text-muted">
                                                    <strong>Số điện thoại:</strong> {order.recipient_phone}
                                                </small>
                                            </div>
                                            <div className="col-md-4">
                                                <small className="text-muted">
                                                    <strong>Ngày mua hàng:</strong> {formatDate(order.created_at)}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Loading indicator và trigger element cho Intersection Observer */}
                    <div ref={loadingRef} className="d-flex justify-content-center py-3">
                        {isLoading ? (
                            <div className="d-flex align-items-center">
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <span className="text-muted">Đang tải thêm đơn hàng...</span>
                            </div>
                        ) : hasMore ? (
                            <span className="text-muted">Cuộn để xem thêm</span>
                        ) : (
                            <span className="text-muted">Đã hiển thị tất cả đơn hàng</span>
                        )}
                    </div>
                </>
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
};