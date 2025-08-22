import React, { useState } from 'react';

export const NumberInput = ({ value, setValue, className = "", name="", max="" }) => {
    const [error, setError] = useState(false);
    const handleIncrement = () => {
        setValue(value + 1);
    };

    const handleDecrement = () => {
        setValue(value > 1 ? value - 1 : 1);
    };

    const handleChange = (e) => {
        const newValue = parseInt(e.target.value);
        if(newValue > max) {
            setError(true);
            return;
        } else if (!isNaN(newValue) && newValue >= 1) {
            setError(false);
            setValue(newValue);
        } else if (e.target.value === '') {
            // Cho phép field trống tạm thời khi user đang nhập
            setError(false);
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
                className={`form-control text-center p-0 ${error ? 'text-danger border-danger' : ''}`}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                name={name}
                min="1"
                style={{ zIndex: 5 }}
                max={max}
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