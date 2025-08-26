import React, { Fragment } from 'react';
import { Icon } from '@iconify/react';
import OrderStatus from '~/constants/order-status';

const STATUS_ICONS = {
    0: 'mdi:file-document-outline',
    1: 'mdi:truck-delivery',
    2: 'mdi:check-circle',
    3: 'iconoir:web-window-close',
    default: 'mdi:file-document-outline',
};

const STATUS_CLASSES = {
    // eslint-disable-next-line no-unused-vars
    0: (status) => 'bg-success text-white',
    1: (status) => (status >= 1 ? 'bg-success text-white' : 'bg-secondary text-white'),
    2: (status) => (status >= 2 ? 'border-success text-success' : 'border-secondary text-secondary'),
    3: (status) => (status >= 3 ? 'border-danger text-danger' : 'border-secondary text-secondary'),
};

const Progress = ({ status }) => {
    const steps = status === 3 ? [0, 1, 3] : [0, 1, 2];

    const getIconFromStatus = (status) => (
        <Icon
            icon={STATUS_ICONS[status] || STATUS_ICONS.default}
            width="24"
            height="24"
        />
    );
    const getStatusClasses = (s) => STATUS_CLASSES[s]?.(status) || '';
    return (
        <>
            {steps.map((step, index) => (
                <Fragment key={step}>
                    <div className="col text-center">
                        <div
                            className={`
                                rounded-circle d-flex align-items-center justify-content-center 
                                mx-auto mb-3 ${getStatusClasses(step)}
                            `}
                            style={{ width: '60px', height: '60px', zIndex: 2 }}
                        >
                            {getIconFromStatus(step)}
                        </div>
                        <h6 className="mb-1 fw-bold" style={{ fontSize: '14px' }}>
                            {OrderStatus.getStatusText(step)}
                        </h6>
                    </div>
                    {(index === 0 || index === 1) && (
                        <div className="col d-flex justify-content-center position-relative">
                            <div className="position-absolute" style={{ top: '15%' }}>
                                <Icon
                                    icon="iconoir:dot-arrow-right"
                                    width="50"
                                    height="50"
                                    className={status >= step + 1 ? 'text-success' : 'text-secondary'}
                                />
                            </div>
                        </div>
                    )}
                </Fragment>
            ))}
        </>
    );
};

export default Progress;