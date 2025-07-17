import React from 'react';
import { Icon } from '@iconify/react';
import { useCreateOrEditPermission } from '~/hooks/use-create-or-edit-permission';
import CustomShowGroupButtonCreateOrEdit from '~/components/ui/custom-show-group-button-create-or-edit';
import CustomModalDelete from '~/components/ui/custom-modal-delete';

const CreateOrEditPermission = () => {
    const {
        inputModel,
        setInputModel,
        errorModel,
        inputPermission,
        setInputPermission,
        errorPermission,
        inputPermissionOther,
        setInputPermissionOther,
        errorPermissionOther,
        isLoading,
        handleSubmit,
        title,
        isEdit,
        showDeleteModal,
        setShowDeleteModal,
        isDeleting,
        errorDelete,
        handleDelete,
    } = useCreateOrEditPermission();

    return (
        <div className="card" style={{ margin: '0.5rem' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{title} Quyền</h5>
            </div>
            <div className="card-body">
                <form>
                    <div className="mb-6">
                        <div className="text-warning">
                            <div className="mb-2">
                                <small>
                                    Tên quyền có cấu trúc theo dạng: <code className="text-info">models.permission</code>
                                </small>
                            </div>

                            <div className="mb-2">
                                <small>
                                    <strong>Models:</strong> Tên model cần xử lý (ví dụ: products, users, roles, ...). Viết thường và nên có hậu tố 's' nếu cần
                                </small>
                            </div>

                            <div className="mb-2">
                                <small>
                                    <strong>Permission:</strong> Tên chức năng cần xử lý, bao gồm:
                                </small>
                            </div>

                            <div className="ps-3">
                                <small>
                                    • <code>index</code> - Xem tất cả model<br />
                                    • <code>store</code> - Tạo mới<br />
                                    • <code>edit</code> - Xem chi tiết một model<br />
                                    • <code>update</code> - Chỉnh sửa<br />
                                    • <code>delete</code> - Xóa
                                </small>
                            </div>
                            <div className="ps-3">
                                <strong>
                                    *model.permission không được quá 255 ký tự và không được chứa các ký tự đặc biệt &lt; , &gt;*
                                </strong>
                            </div>
                        </div>
                        <label className="form-label fs-6 mt-6" htmlFor="basic-icon-default-name">*Tên model</label>
                        <div className="input-group input-group-merge">
                            <span id="basic-icon-default-name2" className={`input-group-text ${errorModel ? 'is-invalid' : ''}`}>
                                <Icon icon="bx:user" className='icon-base bx' />
                            </span>
                            <input
                                type="text"
                                className={`form-control ${errorModel ? 'is-invalid' : ''}`}
                                id="basic-icon-default-name"
                                placeholder="users"
                                aria-label="users"
                                aria-describedby="basic-icon-default-name2"
                                value={inputModel}
                                onChange={(e) => setInputModel(e.target.value)}
                            />
                        </div>
                        <div className="text-danger">{errorModel}</div>
                    </div>
                    <div className="mb-6">
                        <label className="form-label fs-6" htmlFor="basic-icon-default-permission">*Chức năng</label>
                        <div className="input-group input-group-merge">
                            <span id="basic-icon-default-permission" className={`input-group-text ${errorPermission ? 'is-invalid' : ''}`}>
                                <Icon icon="bx:user-voice" className='icon-base bx' />
                            </span>
                            <select
                                name="basic-icon-default-permission"
                                className={`form-select ${errorPermission ? 'is-invalid' : ''}`}
                                aria-label='Chọn quyền'
                                value={inputPermission}
                                onChange={e => setInputPermission(e.target.value)}
                            >
                                <option value="">Chọn nhóm</option>
                                {!isEdit && (
                                    <option value="all">all - Tất cả quyền</option>
                                )}
                                <option value="index">index - Xem tất cả</option>
                                <option value="store">store - Tạo mới</option>
                                <option value="edit">edit - Xem chi tiết</option>
                                <option value="update">update - Chỉnh sửa</option>
                                <option value="delete">delete - Xoá</option>
                                <option value="other">Chọn chức năng khác</option>
                            </select>
                        </div>
                        <div className="text-danger">{errorPermission}</div>
                    </div>
                    {inputPermission === 'other' && (
                        <div className="mb-6">
                            <label className="form-label fs-6" htmlFor="basic-icon-default-permission-other">Tên chức năng khác</label>
                            <div className="input-group input-group-merge">
                                <span id="basic-icon-default-permission-other2" className={`input-group-text ${errorPermissionOther ? 'is-invalid' : ''}`}>
                                    <Icon icon="bx:user-voice" className='icon-base bx' />
                                </span>
                                <input
                                    type="text"
                                    className={`form-control ${errorPermissionOther ? 'is-invalid' : ''}`}
                                    id="basic-icon-default-permission-other"
                                    placeholder="toggleStatus"
                                    aria-label="toogleStatus"
                                    aria-describedby="basic-icon-default-permission-other2"
                                    value={inputPermissionOther}
                                    onChange={(e) => setInputPermissionOther(e.target.value)}
                                />
                            </div>
                            <div className="text-danger">{errorPermissionOther}</div>
                        </div>
                    )}
                    <div className="mb-6 w-100 d-flex justify-content-center">
                        <CustomShowGroupButtonCreateOrEdit
                            isEdit={isEdit}
                            isLoading={isLoading}
                            handleSubmit={handleSubmit}
                            title={title}
                            titleModel="Quyền"
                            page="permissions"
                            setShowModal={setShowDeleteModal}
                        />
                    </div>
                </form>
            </div>
            <CustomModalDelete
                title="Quyền"
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                isDeleting={isDeleting}
                errorDelete={errorDelete}
                handleDelete={handleDelete}
            />
        </div>
    );
}

export default CreateOrEditPermission;