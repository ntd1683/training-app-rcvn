import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import { CustomBtn } from '../ui/custom-btn';

export const Filters = ({ inputName, setInputName, inputDate, setInputDate, onSearch, onResetSearch }) => {
    const inputDateRef = useRef(null);

    const handleFocus = () => {
        if (inputDateRef.current) {
            inputDateRef.current.showPicker(); // Kích hoạt lịch của trình duyệt
        }
    };
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
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
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
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                        onFocus={handleFocus}
                        ref={inputDateRef}
                    />
                </div>
            </div>
            <div className="d-block d-md-flex gap-3 justify-content-md-end">
                <div className="col-12 col-md-4 mb-3">
                    <CustomBtn classNameBtn="w-100" onClick={onSearch}>
                        Tìm Kiếm
                    </CustomBtn>
                </div>
                <div className="col-12 col-md-4 mb-3">
                    <CustomBtn
                        classNameBtn="w-100 bg-secondary"
                        onClick={onResetSearch}
                    >Xoá Tìm Kiếm</CustomBtn>
                </div>
            </div>
        </div>
    );
};