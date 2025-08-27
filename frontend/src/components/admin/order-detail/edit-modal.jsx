import { Icon } from '@iconify/react';
import React from 'react';
import Modal from '~/components/admin/ui/modal';
import OrderStatus from '~/constants/order-status';

export const EditModal = ({
    orderCode,
    showEditModal,
    setShowEditModal,
    isEditing,
    handleEdit,
    error,
    errorUpdate,
    formEdit,
    setFormEdit,
    dataProvinces,
    dataWards
}) => {
    return (
        <>
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title={`Chỉnh sửa đơn hàng : ${orderCode || ''}`}
                showCloseButton={true}
                backdrop={true}
                keyboard={true}
                footer={
                    <div>
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => setShowEditModal(false)}
                            disabled={isEditing}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleEdit()}
                            disabled={isEditing}
                        >
                            {isEditing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Đang chỉnh sửa...
                                </>
                            ) : (
                                'Xác nhận chỉnh sửa'
                            )}
                        </button>
                    </div>
                }
            >
                <div className="p-4">
                    <form action="" className="mb-4">
                        <div className='mb-3'>
                            <label className="form-label" htmlFor="recipient_name">
                                Tên người nhận <span className="text-danger fw-bold fs-6">*</span>
                            </label>
                            <div className="input-group input-group-merge">
                                <span className={`input-group-text ${error?.recipient_name ? 'is-invalid' : ''}`}>
                                    <Icon icon="bx:user" className='icon-base bx' />
                                </span>
                                <input
                                    type="text"
                                    id="recipient_name"
                                    className={`form-control ${error?.recipient_name ? 'is-invalid' : ''}`}
                                    placeholder="Tên người nhận"
                                    value={formEdit.recipient_name}
                                    onChange={(e) => setFormEdit({ ...formEdit, recipient_name: e.target.value })}
                                />
                            </div>
                            <div className="text-danger">{error?.recipient_name}</div>
                        </div>
                        <div className='mb-3'>
                            <label className="form-label" htmlFor="recipient_phone">
                                Số điện thoại <span className="text-danger fw-bold fs-6">*</span>
                            </label>
                            <div className="input-group input-group-merge">
                                <span className={`input-group-text ${error?.recipient_phone ? 'is-invalid' : ''}`}>
                                    <Icon icon="bx:phone" className='icon-base bx' />
                                </span>
                                <input
                                    type="text"
                                    id="recipient_phone"
                                    className={`form-control ${error?.recipient_phone ? 'is-invalid' : ''}`}
                                    placeholder="Số điện thoại"
                                    value={formEdit.recipient_phone}
                                    onChange={(e) => setFormEdit({ ...formEdit, recipient_phone: e.target.value })}
                                />
                            </div>
                            <div className="text-danger">{error?.recipient_phone}</div>
                        </div>
                        <div className='mb-3'>
                            <label className="form-label" htmlFor="recipient_address">
                                Địa chỉ <span className="text-danger fw-bold fs-6">*</span>
                            </label>
                            <div className="input-group input-group-merge">
                                <span className={`input-group-text ${error?.recipient_address ? 'is-invalid' : ''}`}>
                                    <Icon icon="bx:map" className='icon-base bx' />
                                </span>
                                <input
                                    type="text"
                                    id="recipient_address"
                                    className={`form-control ${error?.recipient_address ? 'is-invalid' : ''}`}
                                    placeholder="Địa chỉ"
                                    value={formEdit.recipient_address}
                                    onChange={(e) => setFormEdit({ ...formEdit, recipient_address: e.target.value })}
                                />
                            </div>
                            <div className="text-danger">{error?.recipient_address}</div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6 mb-3 mb-md-0">
                                <label className="form-label" htmlFor="recipient_province">
                                    Tỉnh/Thành phố
                                </label>
                                <select
                                    id="recipient_province"
                                    className={`form-select ${error?.recipient_province ? 'is-invalid' : ''}`}
                                    value={formEdit.recipient_province}
                                    onChange={(e) => setFormEdit({ ...formEdit, recipient_province: e.target.value })}
                                >
                                    <option value="">Chọn Tỉnh/Thành phố</option>
                                    {dataProvinces.map((province) => (
                                        <option key={province.code} value={province.name}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="text-danger">{error?.recipient_province}</div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="recipient_ward">
                                    Phường/Xã
                                </label>
                                <select
                                    id="recipient_ward"
                                    className={`form-select ${error?.recipient_ward ? 'is-invalid' : ''}`}
                                    value={formEdit.recipient_ward}
                                    onChange={(e) => setFormEdit({ ...formEdit, recipient_ward: e.target.value })}
                                >
                                    <option value="">Chọn Phường/Xã</option>
                                    {dataWards.map((ward) => (
                                        <option key={ward.code} value={ward.name}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="text-danger">{error?.recipient_ward}</div>
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label className="form-label" htmlFor="note">
                                Ghi chú
                            </label>
                            <textarea
                                id="note"
                                className="form-control"
                                placeholder="Ghi chú"
                                value={formEdit.note}
                                onChange={(e) => setFormEdit({ ...formEdit, note: e.target.value })}
                            />
                        </div>
                        <div className='mb-3'>
                            <label className="form-label" htmlFor="post_code">
                                Mã bưu điện
                            </label>
                            <input
                                type="text"
                                id="post_code"
                                className="form-control"
                                placeholder="Mã bưu điện"
                                value={formEdit.post_code}
                                onChange={(e) => setFormEdit({ ...formEdit, post_code: e.target.value })}
                            />
                        </div>
                        <div className='mb-3'>
                            <label className="form-label" htmlFor="input_status">
                                Trạng thái
                            </label>
                            <select
                                id="input_status"
                                className={`form-select ${error?.status ? 'is-invalid' : ''}`}
                                value={formEdit.status}
                                onChange={(e) => setFormEdit({ ...formEdit, status: e.target.value })}
                            >
                                <option value="">Chọn trạng thái</option>
                                {OrderStatus.getAllStatuses().map((status, index) => (
                                    <option key={index} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                            <div className="text-danger">{error?.status}</div>
                        </div>
                    </form>
                    {errorUpdate && (
                        <div className="alert alert-danger">
                            {errorUpdate}
                        </div>
                    )}
                </div>
            </Modal>
        </>
    )
}

export default EditModal;