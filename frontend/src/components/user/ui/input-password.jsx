import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

const InputPassword = ({label, name, value, onChange, disabled, isRequired, errors}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-3 form-password-toggle">
            <label className="form-label" htmlFor={`input_password_${name}`}>
                {label} {isRequired && <span className="fw-bold fs-6">*</span>}
            </label>
            <div className="input-group input-group-merge">
                <input
                    id={`input_password_${name}`}
                    className="form-control "
                    placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
                <span
                    className="input-group-text cursor-pointer bg-white"
                    style={{zIndex: 1, padding: '5px 10px', border: 'var(--bs-border-width) solid var(--bs-border-color)'}}
                    onClick={togglePasswordVisibility}
                >
                    <Icon icon={showPassword ? 'bx:hide' : 'bx:show'} />
                </span>
            </div>
            {errors && <p className={`text-danger error-${name} mb-0 mt-1`}>{errors}</p>}
        </div>
    );
};

export default InputPassword;