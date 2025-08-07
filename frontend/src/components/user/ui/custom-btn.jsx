export const CustomBtn = ({ onClick, className = '', classNameBtn = '', children }) => {
    return (
        <div className={`button ${className}`}>
            <button className={`btn ${classNameBtn}`} onClick={onClick}>{children}</button>
        </div>

    );
}