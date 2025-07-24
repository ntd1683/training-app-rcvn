import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPermission, deletePermission, fetchPermission, updatePermission } from '~/services/api';
import { toast } from 'react-toastify';

export const useCreateOrEditPermission = () => {
    const [inputModel, setInputModel] = useState('');
    const [errorModel, setErrorModel] = useState('');
    const [inputPermission, setInputPermission] = useState('');
    const [errorPermission, setErrorPermission] = useState('');
    const [inputPermissionOther, setInputPermissionOther] = useState('');
    const [errorPermissionOther, setErrorPermissionOther] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorDelete, setErrorDelete] = useState('');

    const navigate = useNavigate();

    const path = window.location.pathname;
    const isEdit = path.split('/')[2] === 'edit' ? true : false;
    const { id } = useParams();
    const title = isEdit ? 'Chỉnh Sửa' : 'Thêm';

    if(isEdit && !id) {
        navigate('/permissions', {state: {error: "Không tìm thấy quyền để chỉnh sửa"}})
    }

    const loadPermission = useCallback(async () => {
        if(isEdit && id) {
            try {
                const response = await fetchPermission(id);
                if (response) {
                    const name = response.name.split('.');
                    setInputModel(name[0]);
                    const permission = name[1];
                    if (permission === 'index' || permission === 'store' || permission === 'edit' || permission === 'update' || permission === 'delete') {
                        setInputPermission(permission);
                    } else {
                        setInputPermission('other');
                        setInputPermissionOther(permission);
                    }
                }
            } catch (error) {
            }
        }
    },[isEdit, id])

    useEffect(() => {
        loadPermission();
    }, [loadPermission])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorModel('');
        setErrorPermission('');
        setErrorPermissionOther('');
        setIsLoading(true);

        let isSubmitForm = true;

        if (inputModel.trim() === '') {
            setErrorModel('Tên quyền không được để trống');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (inputModel.length > 255) {
            setErrorModel('Tên quyền không được vượt quá 255 ký tự');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (/<.*?>/.test(inputModel)) {
            setErrorModel('Tên quyền không được chứa các kí tự đặc biệt');
            setIsLoading(false);
            isSubmitForm = false;
        } else {
            setErrorModel('');
        }

        if (inputPermission === '') {
            setErrorPermission('Chức năng không được để trống');
            setIsLoading(false);
            isSubmitForm = false;
        } else {
            setErrorPermission('');
        }

        if (inputPermission === 'other' && inputPermissionOther.trim() === '') {
            setErrorPermissionOther('Tên chức năng khác không được để trống');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (inputPermissionOther.length > 255) {
            setErrorPermissionOther('Tên chức năng khác không được vượt quá 255 ký tự');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (/<.*?>/.test(inputPermissionOther)) {
            setErrorPermissionOther('Tên chức năng khác không được chứa các kí tự đặc biệt');
            setIsLoading(false);
            isSubmitForm = false;
        } else {
            setErrorPermissionOther('');
        }

        setInputModel(inputModel.trim().toLowerCase());
        
        const permission = inputPermission === 'other' ? inputPermissionOther : inputPermission;
        const name = inputModel + '.' + permission;
        if (name.length > 255) {
            setErrorModel('Tên quyền quá dài');
            setIsLoading(false);
            isSubmitForm = false;
        }

        if (!isSubmitForm) {
            return;
        }

        if(!isEdit) {
            try {
                const response = await createPermission({
                    name: name,
                    model: inputModel,
                    permission: permission,
                });

                if (response.success) {
                    toast.success('Tạo quyền thành công!');
                    setInputModel('');
                    setInputPermission('');
                    setInputPermissionOther('');
                } else {
                    toast.error('Tạo quyền  thất bại: ' + response.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra trong quá trình tạo quyền. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const response = await updatePermission(id, {
                    name: name,
                })

                if(response.success) {
                    navigate('/permissions', {state: {success: "Chỉnh sửa quyền thành công!"}});
                } else {
                    toast.error('Chỉnh sửa quyền thất bại: ' + response.message);
                }
            } catch (error) {
                toast.error('Đã có lỗi xảy ra trong quá trình chỉnh sửa quyền. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        setErrorDelete('');
        try {
            const deleteResponse = await deletePermission(id);
            if (deleteResponse) {
                toast.success('Xoá quyền thành công!');
                setShowDeleteModal(false);
                navigate('/permissions');
            } else {
                setErrorDelete('Xoá quyền thất bại. Vui lòng thử lại sau.');
            }
        } catch (error) {
            setErrorDelete('Đã có lỗi xảy ra trong quá trình xoá quyền.\n' + error.response.data.message + '\nVui lòng thử lại sau.');
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        inputModel,
        setInputModel,
        errorModel,
        setErrorModel,
        inputPermission,
        setInputPermission,
        errorPermission,
        setErrorPermission,
        inputPermissionOther,
        setInputPermissionOther,
        errorPermissionOther,
        setErrorPermissionOther,
        isLoading,
        setIsLoading,
        handleSubmit,
        title,
        isEdit,
        showDeleteModal,
        setShowDeleteModal,
        isDeleting,
        setIsDeleting,
        errorDelete,
        setErrorDelete,
        handleDelete,
    };
}