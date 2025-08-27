import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

// Progress Component
const ProgressBar = ({ progress, isVisible, onComplete }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [shouldHide, setShouldHide] = useState(false);

    useEffect(() => {
        if (progress === 100) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShouldHide(true);
                if (onComplete) {
                    onComplete();
                }
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setShowSuccess(false);
            setShouldHide(false);
        }
    }, [progress, onComplete]);

    if (!isVisible || shouldHide) {
        return null;
    }

    return (
        <div className="position-fixed top-50 start-50 translate-middle bg-white p-4 rounded shadow-lg border" style={{ zIndex: 1050, minWidth: '300px' }}>
            <div className="text-center mb-3">
                <h6 className="mb-0">
                    {showSuccess ? (
                        <span className="text-success">
                            <Icon icon="mdi:check-circle" className="me-2" />
                            Đã tải thành công!
                        </span>
                    ) : (
                        'Đang xuất dữ liệu...'
                    )}
                </h6>
            </div>

            <div className="progress mb-2" style={{ height: '8px' }}>
                <div
                    className={`progress-bar ${showSuccess ? 'bg-success' : 'bg-primary'} progress-bar-striped progress-bar-animated`}
                    role="progressbar"
                    style={{
                        width: `${progress}%`,
                        transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out'
                    }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                />
            </div>

            <div className="text-center">
                <small className={`${showSuccess ? 'text-success' : 'text-muted'}`}>
                    {progress}%
                </small>
            </div>
        </div>
    );
};

export default ProgressBar;