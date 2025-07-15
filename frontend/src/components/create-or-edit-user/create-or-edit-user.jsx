import React from 'react';
import { Icon } from '@iconify/react';
import { useCreateOrEdit } from '~/hooks/use-create-or-edit-user';
import { DeleteUserModal } from './delete-user-modal';

const CreateOrEditUser = () => {
    const {
        user,
        setUser,
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
        errorRole,
        roles,
    } = useCreateOrEdit();
    
    return (
        <div className="card" style={{ margin: '0.5rem' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{`${title} thành viên`}</h5>
            </div>
            <div className="card-body">
                <form>
                    <div className="mb-6">
                        <label className="form-label" htmlFor="basic-icon-default-name">*Tên của bạn</label>
                        <div className="input-group input-group-merge">
                            <span id="basic-icon-default-name2" className={`input-group-text ${errorName ? 'is-invalid' : ''}`}>
                                <Icon icon="bx:user" className='icon-base bx' />
                            </span>
                            <input
                                type="text"
                                className={`form-control ${errorName ? 'is-invalid' : ''}`}
                                id="basic-icon-default-name"
                                placeholder="Nguyễn Văn A"
                                aria-label="Nguyễn Văn A"
                                aria-describedby="basic-icon-default-name2"
                                value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                            />
                        </div>
                        <div className="text-danger">{errorName}</div>
                    </div>
                    <div className="mb-6">
                        <label className="form-label" htmlFor="basic-icon-default-email">*Email</label>
                        <div className="input-group input-group-merge">
                            <span id="basic-icon-default-email2" className={`input-group-text ${errorEmail ? 'is-invalid' : ''}`}>
                                <Icon icon="bx:mail-send" className='icon-base bx' />
                            </span>
                            <input
                                type="text"
                                id="basic-icon-default-email"
                                className={`form-control ${errorEmail ? 'is-invalid' : ''}`}
                                placeholder="abc@example.com"
                                aria-label="abc@example.com"
                                aria-describedby="basic-icon-default-email2"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
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
                                <label className="form-label" htmlFor="basic-icon-default-password">*Mật khẩu</label>
                                <div className="input-group input-group-merge">
                                    <span id="basic-icon-default-password2" className={`input-group-text ${errorPassword ? 'is-invalid' : ''}`}>
                                        <Icon icon="bx:lock-alt" className='icon-base bx' />
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        className={`form-control ${errorPassword ? 'is-invalid' : ''}`}
                                        name="password"
                                        value={user.password}
                                        onChange={(e) => setUser({ ...user, password: e.target.value })}
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
                    {isEdit && (
                        <div className="mb-6">
                            <label className="form-label">Trạng thái:</label>
                            <div className="form-check">
                                <input
                                    name="isActive"
                                    className="form-check-input"
                                    type="radio"
                                    id="isActiveRadio"
                                    value="1"
                                    checked={user.isActive === 1}
                                    onChange={() => setUser({ ...user, isActive: 1 })}
                                />
                                <label className="form-check-label" htmlFor="isActiveRadio"> Hoạt động </label>
                            </div>
                            <div className="form-check">
                                <input
                                    name="isActive"
                                    className="form-check-input"
                                    type="radio"
                                    id="notActiveRadio"
                                    value="0"
                                    checked={user.isActive === 0}
                                    onChange={() => setUser({ ...user, isActive: 0 })}
                                />
                                <label className="form-check-label" htmlFor="notActiveRadio"> Khoá tài khoản </label>
                            </div>
                        </div>
                    )}
                    {isEdit && valDelete === 1 && (
                        <div className="mb-6">
                            <label htmlFor="isDelete" className="form-label">Khôi Phục Tài Khoản</label>
                            <select
                                className="form-select"
                                id="isDelete"
                                aria-label="Default select"
                                onChange={(e) => setUser({ ...user, isDelete: Number(e.target.value) })}
                            >
                                <option value="">Bạn có muốn khôi phục tài khoản không?</option>
                                <option value="0">Khôi Phục Tài Khoản</option>
                            </select>
                        </div>
                    )}
                    <div className="mb-6">
                        <label htmlFor="groupRole" className="form-label">Quyền</label>
                        <select
                            className={`form-select ${errorRole ? 'is-invalid' : ''}`}
                            id="groupRole"
                            aria-label="Default select2"
                            value={user.groupRole}
                            onChange={(e) => setUser({ ...user, groupRole: e.target.value })}
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        <div className="text-danger">{errorRole}</div>
                    </div>
                    <div className="mb-6 w-100 d-flex justify-content-center">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                            onClick={handleSubmit}
                        >{`${title} thành viên`}</button>
                        {isEdit && (
                            <button
                                type="button"
                                className="btn btn-danger ms-2"
                                disabled={isLoading}
                                onClick={() => setShowDeleteModal(true)}
                            >Xoá Thành Viên</button>
                        )}
                    </div>
                </form>
            </div>
            <DeleteUserModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                isDeleting={isDeleting}
                errorDelete={errorDelete}
                handleDelete={handleDelete}
            />
        </div>
    );
}

export default CreateOrEditUser;