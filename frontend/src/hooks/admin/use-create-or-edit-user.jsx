import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, deleteUser, createUser, updateUser, fetchAllRoles } from '~/services/api';
import { toast } from 'react-toastify';
import RoleMain from '../../constants/role-main';
import { useUserInfo } from './use-auth';

export const useCreateOrEdit = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        isActive: 1,
        isDelete: 0,
        groupRole: 'Reviewer',
    });
    const [valDelete, setValDelete] = useState(0);
    const [checkPassword, setCheckPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword((prev) => !prev);
    const [errorName, setErrorName] = useState();
    const [errorEmail, setErrorEmail] = useState();
    const [errorPassword, setErrorPassword] = useState();
    const [errorRole, setErrorRole] = useState();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorDelete, setErrorDelete] = useState();
    const [roles, setRoles] = useState([]);

    const navigate = useNavigate();
    const userLocal = useUserInfo().user;
    const groupRoleLocal = userLocal.group_role || 'Reviewer';

    const path = window.location.pathname;
    const isEdit = path.split('/')[3] === 'edit' ? true : false;
    const { id } = useParams();
    const title = isEdit ? 'Chỉnh Sửa' : 'Thêm';

    if (isEdit && !id) {
        navigate('/admin/users', { state: { error: 'Không tìm thấy ID người dùng để chỉnh sửa' } });
    }

    const fetchUser = useCallback(async () => {
        if (isEdit && id) {
            try {
                const response = await fetchUserById(id);
                if (response) {
                    if (response.group_role && RoleMain.getValue(groupRoleLocal) <= RoleMain.getValue(response.group_role)) {
                        navigate('/admin/users', { state: { error: 'Bạn không có quyền chỉnh sửa thành viên này' } });
                        return;
                    }

                    setUser({
                        name: response.name || '',
                        email: response.email || '',
                        isActive: response.is_active,
                        isDelete: response.is_delete,
                        groupRole: response.group_role || 'Reviewer'
                    });
                    setCheckPassword(false);
                    setValDelete(response.is_delete || 0);
                } else {
                    navigate('/admin/users', { state: { error: 'Không tìm thấy người dùng với ID đã cho' } });
                }
            } catch (error) {
                navigate('/admin/users', { state: { error: 'Có lỗi xảy ra khi tải thông tin người dùng' } });
            }
        }
    }, [isEdit, id, navigate, groupRoleLocal]);

    const loadRoles = useCallback(async () => {
        try {
            const response = await fetchAllRoles();
            if (response.success) {
                setRoles(response.data);
            } else {
                toast.error('Không thể tải danh sách nhóm người dùng.', { toastId: 'fetch-roles-error-toast' });
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tải danh sách nhóm người dùng.', { toastId: 'fetch-roles-error-toast' });
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);


    useEffect(() => {
        loadRoles();
    }, [loadRoles])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let isSubmitForm = true;

        if (!user.name) {
            setErrorName('Vui lòng nhập tên đầy đủ');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (user.name.length < 3 || user.name.length > 50) {
            setErrorName('Tên không hợp lệ, phải từ 3 đến 50 ký tự');
            setIsLoading(false);
            isSubmitForm = false;
        } else {
            setErrorName('');
        }

        if (!user.email) {
            setErrorEmail('Vui lòng nhập email');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user.email)) {
            setErrorEmail('Email không hợp lệ');
            setIsLoading(false);
            isSubmitForm = false;
        } else {
            setErrorEmail('');
        }

        if (checkPassword && !user.password) {
            setErrorPassword('Vui lòng nhập mật khẩu');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (checkPassword && user.password.length > 100) {
            setErrorPassword('Mật khẩu không hợp lệ');
            setIsLoading(false);
            isSubmitForm = false;
        } else {
            setErrorPassword('');
        }

        if (RoleMain.getValue(user.groupRole) >= RoleMain.getValue(groupRoleLocal)) {
            setErrorRole('Bạn không có quyền chỉnh sửa hoặc vai trò cao hơn của bạn');
            setIsLoading(false);
            isSubmitForm = false;
        }

        if (!isSubmitForm) {
            return;
        }

        if (!isEdit) {
            try {
                await createUser({
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    isActive: user.isActive,
                    isDelete: user.isDelete,
                    groupRole: user.groupRole
                });
                navigate('/admin/users', { state: { success: 'Tạo thành viên thành công' } });
            } catch (error) {
                toast.error(`Tạo thành viên không thành công: ${error.response.data.message}`);
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
        } else {
            try {
                await updateUser(id, {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    isActive: user.isActive,
                    isDelete: user.isDelete,
                    groupRole: user.groupRole
                });
                setValDelete(user.isDelete);
                navigate('/admin/users', { state: { success: 'Chỉnh sửa thành viên thành công' } });
            } catch (error) {
                toast.error('Cập nhật thành viên không thành công');
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        setErrorDelete('');
        try {
            const response = await deleteUser(id);

            if (!response) {
                throw new Error('Xoá thành viên không thành công');
            }

            setShowDeleteModal(false);
            navigate('/admin/users', { state: { success: 'Xoá thành viên thành công' } });
        } catch (error) {
            setErrorDelete('Xoá thành viên không thành công');
        } finally {
            setIsDeleting(false);
        }
    }

    return {
        userLocal,
        user,
        setUser,
        isEdit,
        title,
        isLoading,
        showPassword,
        togglePassword,
        errorName,
        setErrorName,
        errorEmail,
        setErrorEmail,
        errorPassword,
        setErrorPassword,
        checkPassword,
        setCheckPassword,
        handleSubmit,
        showDeleteModal,
        setShowDeleteModal,
        isDeleting,
        handleDelete,
        valDelete,
        setValDelete,
        errorDelete,
        errorRole,
        roles,
    }
}