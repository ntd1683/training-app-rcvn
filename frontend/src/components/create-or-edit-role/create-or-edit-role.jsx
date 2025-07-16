import React from 'react';
import MultiSelectInput from '~/components/ui/multi-select-input';
import { Icon } from '@iconify/react';
import { useCreateOrEditRole } from '~/hooks/use-create-or-edit-role';
import { DeleteRoleModal } from './delete-role-modal';

const CreateOrEditRole = () => {
    const {
        inputName,
        setInputName,
        errorName,
        setPermissions,
        selectedItems,
        setSelectedItems,
        errorPermissions,
        isLoading,
        handleSubmit,
        handleSearch,
        selectedAll,
        title,
        isEdit,
        showDeleteModal,
        setShowDeleteModal,
        isDeleting,
        errorDelete,
        handleDelete,
    } = useCreateOrEditRole();

    return (
        <div className="card" style={{ margin: '0.5rem' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{title} Vai Trò</h5>
            </div>
            <div className="card-body">
                <form>
                    <div className="mb-6">
                        <label className="form-label fs-6" htmlFor="basic-icon-default-name">*Tên vai trò mới</label>
                        <div className="input-group input-group-merge">
                            <span id="basic-icon-default-name2" className={`input-group-text ${errorName ? 'is-invalid' : ''}`}>
                                <Icon icon="bx:user" className='icon-base bx' />
                            </span>
                            <input
                                type="text"
                                className={`form-control ${errorName ? 'is-invalid' : ''}`}
                                id="basic-icon-default-name"
                                placeholder="Admin"
                                aria-label="Admin"
                                aria-describedby="basic-icon-default-name2"
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                            />
                        </div>
                        <div className="text-danger">{errorName}</div>
                        <div className="form-text fw-bold fst-italic">*Tên không được chứa các ký tự &apos;/&apos;, &apos;\&apos;, hoặc thẻ HTML như &lt;tag&gt;</div>
                    </div>
                    <MultiSelectInput
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        onSelectionChange={setPermissions}
                        label="Chọn quyền cho vai trò mới"
                        placeholder="Nhập để tìm kiếm quyền..."
                        error={errorPermissions}
                        handleSearch={handleSearch}
                        selectedAll={selectedAll}
                    />
                    <div className="mt-3">
                    </div>

                    <div className="mb-6 w-100 d-flex justify-content-center">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                            onClick={handleSubmit}
                        >{title} Vai Trò</button>
                        {isEdit && (
                            <button
                                type="button"
                                className="btn btn-danger ms-2"
                                onClick={() => setShowDeleteModal(true)}
                            >Xoá Vai Trò</button>
                        )}
                    </div>
                </form>
            </div>
            <DeleteRoleModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                isDeleting={isDeleting}
                errorDelete={errorDelete}
                handleDelete={handleDelete}
            />
        </div>
    );
}

export default CreateOrEditRole;