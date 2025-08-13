import React from 'react';
import { Icon } from '@iconify/react';

export const Tab = ({activeTab, setActiveTab}) => {
    return (
        <ul className="nav nav-pills mb-4" role="tablist">
            <li className={`nav-item ${activeTab === 'all' ? 'active' : ''}`} role="presentation">
                <button
                    className="nav-link"
                    onClick={() => setActiveTab('all')}
                >
                    <Icon icon="bx:border-all" width={20} height={20} className='me-2' />
                    Tất cả
                </button>
            </li>
            <li className={`nav-item ${activeTab === 'incomplete' ? 'active' : ''}`} role="presentation">
                <button
                    className="nav-link"
                    onClick={() => setActiveTab('incomplete')}
                >
                    <Icon icon="mdi:clock-outline" width={20} height={20} className='me-2' />
                    Đang chờ
                </button>
            </li>
            <li className={`nav-item ${activeTab === 'complete' ? 'active' : ''}`} role="presentation">
                <button
                    className="nav-link"
                    onClick={() => setActiveTab('complete')}
                >
                    <Icon icon="mdi:check-circle" className='me-2' width={20} height={20} />
                    Đã hoàn thành
                </button>
            </li>
            <li className={`nav-item ${activeTab === 'cancelled' ? 'active' : ''}`} role="presentation">
                <button
                    className="nav-link"
                    onClick={() => setActiveTab('cancelled')}
                >
                    <Icon icon="mdi:close" className='me-2' width={20} height={20} />
                    Đã huỷ
                </button>
            </li>
        </ul>
    )
}