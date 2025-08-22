import React from 'react';

const LoadingComponent = ({
    message = "Đang tải...",
    size = "md",
    variant = "primary",
    showSpinner = true,
    className = ""
}) => {
    const sizeClasses = {
        sm: "spinner-border-sm",
        md: "",
        lg: "spinner-border-lg"
    };

    return (
        <div className={`text-center p-4 ${className}`}>
            {showSpinner && (
                <div
                    className={`spinner-border text-${variant} ${sizeClasses[size]} me-2`}
                    role="status"
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
            <div className={`mt-2 text-${variant}`}>{message}</div>
        </div>
    );
};

export default LoadingComponent;