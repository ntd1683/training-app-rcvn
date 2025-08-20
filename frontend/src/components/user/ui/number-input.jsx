import React from 'react';

export const NumberInput = ({ value, setValue, className = "", name="" }) => {
    const handleIncrement = () => {
        setValue(value + 1);
    };

    const handleDecrement = () => {
        setValue(value > 1 ? value - 1 : 1);
    };

    const handleChange = (e) => {
        const newValue = parseInt(e.target.value);
        if (!isNaN(newValue) && newValue >= 1) {
            setValue(newValue);
        } else if (e.target.value === '') {
            // Cho phép field trống tạm thời khi user đang nhập
            return;
        }
    };

    const handleBlur = (e) => {
        // Khi user rời khỏi input, đảm bảo giá trị hợp lệ
        const newValue = parseInt(e.target.value);
        if (isNaN(newValue) || newValue < 1) {
            setValue(1);
        }
    };

    return (
        <div className={`input-group ${className}`}>
            <button
                className="btn btn-outline-secondary border-bs-custom"
                type="button"
                onClick={handleDecrement}
                disabled={value <= 1}
            >
                -
            </button>
            <input
                type="number"
                className="form-control text-center p-0"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                name={name}
                min="1"
                style={{ zIndex: 5 }}
            />
            <button
                className="btn btn-outline-secondary border-bs-custom"
                type="button"
                onClick={handleIncrement}
            >
                +
            </button>
        </div>
    );
};