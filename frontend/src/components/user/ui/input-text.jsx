import React from "react";

const InputText = ({label, name, value,placeholder, onChange, disabled, isRequired, errors}) => {
    return (
        <div className="mb-3 form-password-toggle">
            <label className="form-label" htmlFor={`input_text_${name}`}>
                {label} {isRequired && <span className="fw-bold fs-6">*</span>}
            </label>
            <div className="input-group">
                <input
                    id={`input_text_${name}`}
                    className="form-control "
                    placeholder={placeholder}
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
            </div>
            {errors && <p className={`text-danger error-${name} mb-0 mt-1`}>{errors}</p>}
        </div>
    );
};

export default InputText;