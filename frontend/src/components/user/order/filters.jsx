import React from 'react';
import { Icon } from '@iconify/react';
import { CustomBtn } from '../ui/custom-btn';

export const Filters = ({ searchTerm, setSearchTerm, dateFilter, setDateFilter }) => {
    return (
        <div className="row mb-4">
            <div className="col-md-6 mb-3">
                <div className="input-group">
                    <span className="input-group-text">
                        <Icon icon="mdi:magnify" width={20} height={20} className='me-2' />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="col-md-6 mb-3">
                <div className="input-group">
                    <span className="input-group-text">
                        <Icon icon="mdi:calendar" width={20} height={20} className='me-2' />
                    </span>
                    <input
                        type="date"
                        className="form-control"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>
            </div>
            <div className="d-block d-md-flex gap-3 justify-content-md-end">
                <div className="col-12 col-md-4 mb-3">
                    <CustomBtn classNameBtn="w-100" >Tìm Kiếm</CustomBtn>
                </div>
                <div className="col-12 col-md-4 mb-3">
                    <CustomBtn
                        classNameBtn="w-100 bg-secondary"
                    >Xoá Tìm Kiếm</CustomBtn>
                </div>
            </div>
        </div>
    );
};