export const NumberInput = ({ value, setValue, className = "" }) => {
    const handleIncrement = () => {
        setValue((prevValue) => prevValue + 1);
    };

    const handleDecrement = () => {
        setValue((prevValue) => (prevValue > 1 ? prevValue - 1 : 1));
    };

    const handleChange = (e) => {
        const newValue = parseInt(e.target.value);
        if (!isNaN(newValue) && newValue >= 1) {
            setValue(newValue);
        }
    };

    return (
        <div className={`input-group ${className}`}>
            <button
                className="btn btn-outline-secondary border-bs-custom"
                type="button"
                onClick={handleDecrement}
            >
                -
            </button>
            <input
                type="number"
                className="form-control text-center p-0"
                value={value}
                onChange={handleChange}
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