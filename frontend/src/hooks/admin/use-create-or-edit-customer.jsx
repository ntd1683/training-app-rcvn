import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCustomerById, createCustomer, updateCustomer, deleteCustomer } from '~/services/api';
import { toast } from 'react-toastify';
import { useUserInfo } from './use-auth';

export const useCreateOrEdit = () => {
    const user = useUserInfo().user;
    const [customer, setCustomer] = useState({
        provider_id: '',
        name: '',
        email: '',
        password: '',
        email_verified_at: null,
        last_login_ip: '',
        last_login_at: null,
        created_at: null,
        deleted_at: null
    });
    const [valDelete, setValDelete] = useState(0);
    const [checkPassword, setCheckPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword((prev) => !prev);
    const [errorName, setErrorName] = useState();
    const [errorEmail, setErrorEmail] = useState();
    const [errorPassword, setErrorPassword] = useState();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorDelete, setErrorDelete] = useState();

    const navigate = useNavigate();

    const path = window.location.pathname;
    const isEdit = path.split('/')[3] === 'edit' ? true : false;
    const { id } = useParams();
    const title = isEdit ? 'Chỉnh Sửa' : 'Thêm';

    if (isEdit && !id) {
        navigate('/admin/customers', { state: { error: 'Không tìm thấy ID khách hàng để chỉnh sửa' } });
    }

    const fetchCustomer = useCallback(async () => {
        if (isEdit && id) {
            try {
                const response = await fetchCustomerById(id);
                if (response) {
                    setCustomer({
                        provider_id: response.provider_id || '',
                        name: response.name || '',
                        email: response.email || '',
                        password: '',
                        email_verified_at: response.email_verified_at || null,
                        last_login_ip: response.last_login_ip || '',
                        last_login_at: response.last_login_at || null,
                        created_at: response.created_at || null,
                        deleted_at: response.deleted_at || null
                    });
                    setCheckPassword(false);
                    setValDelete(response.deleted_at || 0);
                } else {
                    navigate('/admin/customers', { state: { error: 'Không tìm thấy khách hàng với ID đã cho' } });
                }
            } catch (error) {
                navigate('/admin/customers', { state: { error: 'Có lỗi xảy ra khi tải thông tin khách hàng' } });
            }
        }
    }, [isEdit, id, navigate]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    const validateForm = (customer) => {
        let isSubmitForm = true;
        if (!customer.name) {
            setErrorName('Vui lòng nhập tên đầy đủ');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (customer.name.length < 3 || customer.name.length > 50) {
            setErrorName('Tên không hợp lệ, phải từ 3 đến 50 ký tự');
            setIsLoading(false);
            isSubmitForm = false;
        } else {
            setErrorName('');
        }

        if (!customer.email) {
            setErrorEmail('Vui lòng nhập email');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(customer.email)) {
            setErrorEmail('Email không hợp lệ');
            setIsLoading(false);
            isSubmitForm = false;
        } else {
            setErrorEmail('');
        }

        if (checkPassword && !customer.password) {
            setErrorPassword('Vui lòng nhập mật khẩu');
            setIsLoading(false);
            isSubmitForm = false;
        } else if (checkPassword && customer.password.length > 100) {
            setErrorPassword('Mật khẩu không hợp lệ');
            setIsLoading(false);
            isSubmitForm = false;
        } else {
            setErrorPassword('');
        }

        return isSubmitForm;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!validateForm(customer)) {
            return;
        }

        if (!isEdit) {
            try {
                await createCustomer({
                    name: customer.name,
                    email: customer.email,
                    password: customer.password,
                });
                navigate('/admin/customers', { state: { success: 'Tạo khách hàng thành công' } });
            } catch (error) {
                toast.error(`Tạo khách hàng không thành công: ${error.response.data.message}`);
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
        } else {
            try {
                await updateCustomer(id, {
                    password: customer.password,
                    deleted_at: customer.deleted_at === 0 ? null : customer.deleted_at,
                });
                setValDelete(customer.deleted_at);
                navigate('/admin/customers', { state: { success: 'Chỉnh sửa khách hàng thành công' } });
            } catch (error) {
                toast.error('Cập nhật khách hàng không thành công');
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
            const response = await deleteCustomer(id);

            if (!response) {
                throw new Error('Xoá khách hàng không thành công');
            }

            setShowDeleteModal(false);
            navigate('/admin/customers', { state: { success: 'Xoá khách hàng thành công' } });
        } catch (error) {
            setErrorDelete('Xoá khách hàng không thành công');
        } finally {
            setIsDeleting(false);
        }
    }

    return {
        user,
        customer,
        setCustomer,
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
    }
}