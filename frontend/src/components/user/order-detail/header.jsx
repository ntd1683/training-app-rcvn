import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import OrderStatus from '~/constants/order-status';

const Header = ({ orderData }) => {
    const getClassColor = (status) => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'text-primary';
            case OrderStatus.PROCESSING:
                return 'text-primary';
            case OrderStatus.COMPLETED:
                return 'text-success';
            case OrderStatus.PAYMENT_FAILED:
                return 'text-danger';
            default:
                return 'text-primary';
        }
    }
    
    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Link to="/don-hang" className="btn btn-link btn-comeback text-decoration-none text-muted p-0">
                        <Icon icon="mdi:arrow-back" width="24" height="24" className="me-2" />
                        TRỞ LẠI
                    </Link>
                    <div className="text-end">
                        <small className="text-muted order-code">MÃ ĐƠN HÀNG: {orderData.order_code}</small>
                        <span className="mx-2">|</span>
                        <small className={`${getClassColor(orderData.status)} fw-bold`}
                        >{OrderStatus.getStatusText(orderData.status)}</small>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;