import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import OrderStatus from '~/constants/order-status';

export const OrdersFilter = ({
    filterName,
    setFilterName,
    filterDate,
    setFilterDate,
    filterStatus,
    setFilterStatus
}) => {
    const inputDateRef = useRef(null);

    const handleFocus = () => {
        if (inputDateRef.current) {
            inputDateRef.current.showPicker();
        }
    };
    return (
        <div className="row g-3 px-3">
            <div className="col-md-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm sản phẩm"
                    value={filterName}
                    onChange={e => setFilterName(e.target.value)}
                />
            </div>
            <div className="col-md-4">
                <select
                    name="status"
                    className="form-select"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="">Chọn trạng thái</option>
                    <option value="">Tất Cả</option>
                    {OrderStatus.getAllStatuses().map(status => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-md-4">
                <div className="input-group">
                    <span className="input-group-text">
                        <Icon icon="mdi:calendar" width={20} height={20} className='me-1' />
                    </span>
                    <input
                        type="date"
                        name='order_date'
                        className="form-control"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        onFocus={handleFocus}
                        ref={inputDateRef}
                    />
                </div>
            </div>
        </div>
    )
}