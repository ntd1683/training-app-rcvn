export const UsersFilter = ({ filterName, setFilterName, filterEmail, setFilterEmail,roles,filterGroup, setFilterGroup, filterStatus, setFilterStatus }) => {
    return (
        <div className="row g-3 px-3">
            <div className="col-md-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm họ tên..."
                    value={filterName}
                    onChange={e => setFilterName(e.target.value)}
                />
            </div>
            <div className="col-md-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm email..."
                    value={filterEmail}
                    onChange={e => setFilterEmail(e.target.value)}
                />
            </div>
            <div className="col-md-3">
                <select
                    name="group"
                    className="form-select"
                    value={filterGroup}
                    onChange={e => setFilterGroup(e.target.value)}
                >
                    <option value="">Chọn nhóm</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.name}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-md-3">
                <select
                    name="status"
                    className="form-select"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="">Chọn trạng thái</option>
                    <option value="0">Đang tạm khoá</option>
                    <option value="1">Hoạt động</option>
                </select>
            </div>
        </div>
    )
}