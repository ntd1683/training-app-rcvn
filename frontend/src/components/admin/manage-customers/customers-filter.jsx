import React from "react";

export const CustomersFilter = ({
    filterName,
    setFilterName,
    filterEmail,
    setFilterEmail,
    filterStatus,
    setFilterStatus
}) => {
    return (
        <div className="row g-3 px-3">
            <div className="col-md-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm họ tên..."
                    value={filterName}
                    onChange={e => setFilterName(e.target.value)}
                />
            </div>
            <div className="col-md-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm email..."
                    value={filterEmail}
                    onChange={e => setFilterEmail(e.target.value)}
                />
            </div>
            <div className="col-md-4">
                <select
                    name="status"
                    className="form-select"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="2">Tất cả</option>
                    <option value="1">Đang hoạt động</option>
                    <option value="0">Đã xoá</option>
                </select>
            </div>
        </div>
    )
}