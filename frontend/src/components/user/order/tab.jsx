import React from 'react';
import { Icon } from '@iconify/react';

export const Tab = ({activeTab, setActiveTab}) => {
    return (
        <ul className="nav nav-pills mb-4" role="tablist">
            <li className={`nav-item ${activeTab === '' ? 'active' : ''}`} role="presentation">
                <button
                    className="nav-link"
                    onClick={() => setActiveTab('')}
                >
                    <Icon icon="bx:border-all" width={20} height={20} className='me-2' />
                    Tất cả
                </button>
            </li>
            <li className={`nav-item ${parseInt(activeTab) === 1 ? 'active' : ''}`} role="presentation">
                <button
                    className="nav-link"
                    onClick={() => setActiveTab(1)}
                >
                    <Icon icon="mdi:clock-outline" width={20} height={20} className='me-2' />
                    Đang chờ
                </button>
            </li>
            <li className={`nav-item ${parseInt(activeTab) === 2 ? 'active' : ''}`} role="presentation">
                <button
                    className="nav-link"
                    onClick={() => setActiveTab(2)}
                >
                    <Icon icon="mdi:check-circle" className='me-2' width={20} height={20} />
                    Đã hoàn thành
                </button>
            </li>
            <li className={`nav-item ${parseInt(activeTab) === 3 ? 'active' : ''}`} role="presentation">
                <button
                    className="nav-link"
                    onClick={() => setActiveTab(3)}
                >
                    <Icon icon="mdi:close" className='me-2' width={20} height={20} />
                    Đã huỷ
                </button>
            </li>
        </ul>
    )
}