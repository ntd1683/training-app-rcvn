import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPermissions, fetchAllPermissions, createRole, deleteRole, fetchRoleByName, updateRole } from '~/services/api';
import { toast } from 'react-toastify';

export const useCreateOrEditRole = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [inputName, setInputName] = useState('');
    const [errorName, setErrorName] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [errorPermissions, setErrorPermissions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorDelete, setErrorDelete] = useState('');

    const navigate = useNavigate();

    const path = window.location.pathname;
    const isEdit = path.split('/')[3] === 'edit' ? true : false;
    const { role } = useParams();
    const title = isEdit ? 'Chỉnh Sửa' : 'Thêm';

    if(isEdit && !role) {
        navigate('/admin/roles', {state: {error: "Không tìm thấy vai trò để chỉnh sửa"}})
    }

    const fetchRole = useCallback(async () => {
        if(isEdit && role) {
            try {
                const response = await fetchRoleByName(role);
                if (response) {
                    setInputName(response.name);
                    setPermissions(response.permissions);
                    setSelectedItems(response.permissions);
                }
            } catch (error) {
            }
        }
    },[isEdit, role])

    useEffect(() => {
        fetchRole();
    }, [fetchRole])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorName('');
        setErrorPermissions('');
        setIsLoading(true);

        let isSubmitForm = true;

        if (inputName.trim() === '') {
            setErrorName('Tên vai trò không được để trống');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (inputName.length > 50) {
            setErrorName('Tên vai trò không được vượt quá 50 ký tự');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (/[\\/]|<.*?>/.test(inputName)) {
            setErrorName('Tên vai trò không được chứa các kí tự đặc biệt');
            setIsLoading(false);
            isSubmitForm = false;
        } else {
            setErrorName('');
        }

        if (!isSubmitForm) {
            return;
        }

        if(!isEdit) {
            try {
                const response = await createRole({
                    name: inputName,
                    permissions: permissions.map(permission => permission.name),
                });

                if (response.success) {
                    toast.success('Tạo vai trò thành công!');
                    setInputName('');
                    setPermissions([]);
                    setSelectedItems([]);
                } else {
                    toast.error('Tạo vai trò thất bại: ' + response.message);
                }
            } catch (error) {
                toast.error('Đã có lỗi xảy ra trong quá trình tạo vai trò. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const response = await updateRole(role, {
                    name: inputName,
                    permissions: permissions.map(permission => permission.name)
                })

                if(response.success) {
                    navigate('/admin/roles', {state: {success: "Chỉnh sửa vai trò thành công!"}});
                } else {
                    toast.error('Chỉnh sửa vai trò thất bại: ' + response.message);
                }
            } catch (error) {
                toast.error('Đã có lỗi xảy ra trong quá trình chỉnh sửa vai trò. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleSearch = async (filterName, selectedItems, setFilteredOptions, setLoading) => {
        setLoading(true);
        try {
            const response = await fetchPermissions(1, 10, {
                filterName: filterName,
                selected: selectedItems.map(item => item.id),
            });
            if (response.success) {
                const data = response.data;
                setFilteredOptions(data);
            } else {
                setFilteredOptions([]);
            }
        } catch (error) {
            setFilteredOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const selectedAll = async (selectedItems, setSelectedItems, setLoading) => {
        setLoading(true);
        try {
            const response = await fetchAllPermissions();
            if (response.success) {
                const data = response.data;
                data.forEach(item => {
                    if (!selectedItems.find(selected => selected.id === item.id)) {
                        setSelectedItems(prev => [...prev, item]);
                    }
                });
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setErrorDelete('');
        try {
            const deleteResponse = await deleteRole(role);
            if (deleteResponse) {
                toast.success('Xoá vai trò thành công!');
                setShowDeleteModal(false);
                navigate('/admin/roles');
            } else {
                setErrorDelete('Xoá vai trò thất bại. Vui lòng thử lại sau.');
            }
        } catch (error) {
            setErrorDelete('Đã có lỗi xảy ra trong quá trình xoá vai trò.\n' + error.response.data.message + '\nVui lòng thử lại sau.');
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        inputName,
        setInputName,
        errorName,
        setErrorName,
        permissions,
        setPermissions,
        errorPermissions,
        setErrorPermissions,
        isLoading,
        setIsLoading,
        handleSubmit,
        handleSearch,
        selectedAll,
        title,
        isEdit,
        selectedItems,
        setSelectedItems,
        showDeleteModal,
        setShowDeleteModal,
        isDeleting,
        setIsDeleting,
        errorDelete,
        setErrorDelete,
        handleDelete,
    };
}