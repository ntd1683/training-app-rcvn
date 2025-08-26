import React from 'react';
import { Icon } from '@iconify/react';
import { useCreateOrEdit } from '~/hooks/admin/use-create-or-edit-customer';
import CustomShowGroupButtonCreateOrEdit from '~/components/admin/ui/custom-show-group-button-create-or-edit';
import CustomModalDelete from '~/components/admin/ui/custom-modal-delete';

const CreateOrEditCustomer = () => {
    const {
        user,
        customer,
        setCustomer,
        isEdit,
        title,
        isLoading,
        showPassword,
        togglePassword,
        errorName,
        errorEmail,
        errorPassword,
        checkPassword,
        setCheckPassword,
        handleSubmit,
        showDeleteModal,
        setShowDeleteModal,
        isDeleting,
        handleDelete,
        valDelete,
        errorDelete,
    } = useCreateOrEdit();

    return (
        <div className="card" style={{ margin: '0.5rem' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{`${title} thành viên`}</h5>
            </div>
            <div className="card-body">
                <form>
                    <div className="mb-6">
                        <label className="form-label" htmlFor="basic-icon-default-name">
                            Tên khách hàng <span className="text-danger fw-bold fs-6">*</span>
                        </label>
                        <div className="input-group input-group-merge">
                            <span id="basic-icon-default-name2" className={`input-group-text ${errorName ? 'is-invalid' : ''}`}>
                                <Icon icon="bx:user" className='icon-base bx' />
                            </span>
                            <input
                                type="text"
                                className={`form-control ps-2 ${errorName ? 'is-invalid' : ''}`}
                                id="basic-icon-default-name"
                                placeholder="Nguyễn Văn A"
                                aria-label="Nguyễn Văn A"
                                aria-describedby="basic-icon-default-name2"
                                disabled={isEdit}
                                value={customer.name}
                                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                            />
                        </div>
                        <div className="text-danger">{errorName}</div>
                    </div>
                    <div className="mb-6">
                        <label className="form-label" htmlFor="basic-icon-default-email">
                            Email <span className="text-danger fw-bold fs-6">*</span>
                        </label>
                        <div className="input-group input-group-merge">
                            <span id="basic-icon-default-email2" className={`input-group-text ${errorEmail ? 'is-invalid' : ''}`}>
                                <Icon icon="bx:mail-send" className='icon-base bx' />
                            </span>
                            <input
                                type="text"
                                id="basic-icon-default-email"
                                className={`form-control ps-2 ${errorEmail ? 'is-invalid' : ''}`}
                                placeholder="abc@example.com"
                                aria-label="abc@example.com"
                                aria-describedby="basic-icon-default-email2"
                                disabled={isEdit}
                                value={customer.email}
                                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                            />
                        </div>
                        <div className="text-danger">{errorEmail}</div>
                    </div>
                    <div className="mb-6">
                        {isEdit && (
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="checkPassword"
                                    checked={checkPassword}
                                    onChange={(e) => setCheckPassword(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="checkPassword"> Khôi Phục Mật Khẩu </label>
                            </div>
                        )}
                        {checkPassword && (
                            <>
                                <label className="form-label" htmlFor="basic-icon-default-password">
                                    Mật khẩu <span className="text-danger fw-bold fs-6">*</span>
                                </label>
                                <div className="input-group input-group-merge">
                                    <span id="basic-icon-default-password2" className={`input-group-text ${errorPassword ? 'is-invalid' : ''}`}>
                                        <Icon icon="bx:lock-alt" className='icon-base bx' />
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        className={`form-control ${errorPassword ? 'is-invalid' : ''}`}
                                        name="password"
                                        value={customer.password}
                                        onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
                                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                        aria-describedby="password"
                                    />
                                    <span className={`input-group-text cursor-pointer ${errorPassword ? "is-invalid" : ""}`} onClick={togglePassword} style={{ zIndex: 10 }}>
                                        <Icon icon={showPassword ? 'bx:show' : 'bx:hide'} className='icon-base' />
                                    </span>
                                </div>
                                <div className="text-danger">{errorPassword}</div>
                            </>
                        )}
                    </div>
                    {isEdit && valDelete !== 0 && (
                        <div className="mb-6">
                            <label htmlFor="isDelete" className="form-label">Khôi Phục Tài Khoản</label>
                            <select
                                className="form-select"
                                id="isDelete"
                                aria-label="Default select"
                                onChange={(e) => setCustomer({ ...customer, deleted_at: Number(e.target.value) })}
                            >
                                <option value="">Bạn có muốn khôi phục tài khoản không?</option>
                                <option value="0">Khôi Phục Tài Khoản</option>
                            </select>
                        </div>
                    )}

                    {isEdit && (
                        <>
                            <div className="mb-6">
                                <label className="form-label">
                                    ID Kết Nối
                                </label>
                                <div className="input-group input-group-merge">
                                    <span className={`input-group-text ${errorName ? 'is-invalid' : ''}`}>
                                        <Icon icon="bx:user" className='icon-base bx' />
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-control ps-2 ${errorName ? 'is-invalid' : ''}`}
                                        aria-describedby="basic-icon-default-name2"
                                        disabled
                                        value={customer.provider_id}
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="form-label">
                                    Email Xác Thực Lúc
                                </label>
                                <div className="input-group input-group-merge">
                                    <span className={`input-group-text ${errorName ? 'is-invalid' : ''}`}>
                                        <Icon icon="bx:user" className='icon-base bx' />
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-control ps-2 ${errorName ? 'is-invalid' : ''}`}
                                        aria-describedby="basic-icon-default-name2"
                                        disabled
                                        value={customer.email_verified_at ? new Date(customer.email_verified_at).toLocaleString('vi-VN') : 'Chưa xác thực'}
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="form-label">
                                    Lần đăng nhập gần nhất
                                </label>
                                <div className="input-group input-group-merge">
                                    <span className={`input-group-text ${errorName ? 'is-invalid' : ''}`}>
                                        <Icon icon="bx:user" className='icon-base bx' />
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-control ps-2 ${errorName ? 'is-invalid' : ''}`}
                                        aria-describedby="basic-icon-default-name2"
                                        disabled
                                        value={customer.last_login_at ? new Date(customer.last_login_at).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="form-label">
                                    IP đăng nhập gần nhất
                                </label>
                                <div className="input-group input-group-merge">
                                    <span className={`input-group-text ${errorName ? 'is-invalid' : ''}`}>
                                        <Icon icon="bx:user" className='icon-base bx' />
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-control ps-2 ${errorName ? 'is-invalid' : ''}`}
                                        aria-describedby="basic-icon-default-name2"
                                        disabled
                                        value={customer.last_login_ip ? customer.last_login_ip : 'Chưa đăng nhập'}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <CustomShowGroupButtonCreateOrEdit
                        isEdit={isEdit}
                        isLoading={isLoading}
                        handleSubmit={handleSubmit}
                        title={title}
                        titleModel="Khách hàng"
                        page="customers"
                        setShowModal={setShowDeleteModal}
                        user={user}
                    />
                </form>
            </div>
            <CustomModalDelete
                title="Khách hàng"
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                isDeleting={isDeleting}
                errorDelete={errorDelete}
                handleDelete={handleDelete}
            />
        </div>
    );
}

export default CreateOrEditCustomer;