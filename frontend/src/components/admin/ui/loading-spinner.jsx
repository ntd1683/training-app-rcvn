import React from "react";

const LoadingSpinner = ({message, color}) => {
    return (
        <div className="col-md p-6">
            <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                <div className={`spinner-border spinner-border-lg text-${color ? color : 'primary'}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div>
                    <span className="text-muted">{message ? message : 'Đang tải dữ liệu ...'}</span>
                </div>
            </div>
        </div>
    );
}

export default LoadingSpinner;