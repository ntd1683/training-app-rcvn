import React from "react";

const ErrorComponent = ({
    message = "Đã xảy ra lỗi",
    variant = "danger",
    showIcon = true,
    onRetry = null,
    retryText = "Thử lại",
    className = ""
}) => {
    return (
        <div className={`text-center p-4 ${className}`}>
            <div className={`alert alert-${variant} d-inline-block`} role="alert">
                {showIcon && (
                    <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
                )}
                <strong>Lỗi:</strong> {message}
            </div>
            {onRetry && (
                <div className="mt-3">
                    <button
                        className={`btn btn-${variant}`}
                        onClick={onRetry}
                        type="button"
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        {retryText}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ErrorComponent;