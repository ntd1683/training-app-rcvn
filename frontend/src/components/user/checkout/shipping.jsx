export const Shipping = ({ shippingInfo, handleShippingInfoChange, dataProvinces, dataWards, errors, children }) => {
    return (
        <>
            <hr className="divider mt-3" style={{ borderColor: '#000', opacity: '15%' }}/>
            <div className="row mt-3">
                <h6>Thông tin giao hàng</h6>
                <div className="col-md-12">
                    <div className="single-form form-default">
                        <label>Tên đầy đủ <span className="text-danger">*</span></label>
                        <div className="row">
                            <div className="form-input form">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Tên đầy đủ"
                                    value={shippingInfo.name}
                                    onChange={(e) => handleShippingInfoChange('name', e.target.value)}
                                />
                            </div>
                        </div>
                        {errors.name && <p className="text-danger">{errors.name}</p>}
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="single-form form-default">
                        <label>Số điện thoại <span className="text-danger">*</span></label>
                        <div className="form-input form">
                            <input
                                type="text"
                                name="phone"
                                placeholder="Số điện thoại"
                                value={shippingInfo.phone}
                                onChange={(e) => handleShippingInfoChange('phone', e.target.value)}
                            />
                        </div>
                        {errors.phone && <p className="text-danger">{errors.phone}</p>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="single-form form-default">
                        <label>Tỉnh/Thành Phố <span className="text-danger">*</span></label>
                        <div className="select-items">
                            <select
                                className="form-control"
                                name="province"
                                value={shippingInfo.province}
                                onChange={(e) => handleShippingInfoChange('province', e.target.value)}
                            >
                                <option value="">-- Chọn tỉnh/thành phố --</option>
                                {dataProvinces.map((province) => (
                                    <option key={province.code} value={province.code}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.province && <p className="text-danger">{errors.province}</p>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="single-form form-default">
                        <label>Phường <span className="text-danger">*</span></label>
                        <div className="select-items">
                            <select
                                className="form-control"
                                name="ward"
                                value={shippingInfo.ward}
                                onChange={(e) => handleShippingInfoChange('ward', e.target.value)}
                            >
                                <option value="">-- Chọn phường --</option>
                                {dataWards.map((ward) => (
                                    <option key={ward.code} value={ward.code}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.ward && <p className="text-danger">{errors.ward}</p>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="single-form form-default">
                        <label>Địa chỉ <span className="text-danger">*</span></label>
                        <div className="row">
                            <div className="form-input form">
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Địa chỉ"
                                    value={shippingInfo.address}
                                    onChange={(e) => handleShippingInfoChange('address', e.target.value)}
                                />
                            </div>
                        </div>
                        {errors.address && <p className="text-danger">{errors.address}</p>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="single-form form-default">
                        <label>Mã bưu điện <span className="text-danger">*</span></label>
                        <div className="form-input form">
                            <input
                                type="text"
                                name="postCode"
                                placeholder="Mã bưu điện"
                                value={shippingInfo.postCode}
                                onChange={(e) => handleShippingInfoChange('postCode', e.target.value)}
                            />
                        </div>
                        {errors.postCode && <p className="text-danger">{errors.postCode}</p>}
                    </div>
                </div>
                <div className="col-12">
                    <div className="single-form form-default">
                        <label>Ghi chú</label>
                        <div className="form-input form">
                            <textarea
                                type="text"
                                name="note"
                                placeholder="Ghi chú"
                                value={shippingInfo.note}
                                onChange={(e) => handleShippingInfoChange('note', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </>
    )
}