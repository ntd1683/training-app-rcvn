import ProductStatus from '~/constants/product-status';

export const ProductsFilter = ({
    filterText,
    setFilterText,
    filterPriceFrom,
    setFilterPriceFrom,
    filterPriceTo,
    setFilterPriceTo,
    filterStatus,
    setFilterStatus,
    errorFilterPrice,
}) => {
    return (
        <div className="row g-3 px-3">
            <div className="col-md-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm sản phẩm"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                />
            </div>
            <div className="col-md-3">
                <select
                    name="status"
                    className="form-select"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="">Chọn trạng thái</option>
                    {ProductStatus.getAllStatuses().map(status => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-md-6 d-flex justify-content-end align-items-center">
                    <input
                        type="number"
                        className={`form-control ${errorFilterPrice ? 'is-invalid' : ''}`}
                        placeholder="Giá từ"
                        value={filterPriceFrom}
                        onChange={e => setFilterPriceFrom(e.target.value)}
                    />
                    <span className='fs-4 mx-2'>~</span>
                    <input
                        type="number"
                        className={`form-control ${errorFilterPrice ? 'is-invalid' : ''}`}
                        placeholder="Giá đến"
                        value={filterPriceTo}
                        onChange={e => setFilterPriceTo(e.target.value)}
                    />
            </div>
        </div>
    )
}