import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './use-auth';
import '~/assets/css/admin/page-auth.css';
import { toast } from 'react-toastify';

export const useLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
        showPassword: false,
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const { isAuthenticated, isLoginLoading, handleLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { state: { success: 'Bạn đang đăng nhập' } });
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const togglePassword = () => {
        setFormData(prev => ({
            ...prev,
            showPassword: !prev.showPassword
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.email) {
            newErrors.email = 'Email không được bỏ trống';
            isValid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được bỏ trống';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await handleLogin(formData.email, formData.password, formData.rememberMe, false);
            if (response.success) {
                navigate('/', { state: { success: 'Đăng nhập thành công' } });
            } else {
                setErrors({
                    email: ' ',
                    password: 'Email hoặc mật khẩu không đúng!'
                });
                toast.error('Email hoặc mật khẩu không đúng!');
            }
        } catch (error) {
            setErrors({
                email: ' ',
                password: 'Có lỗi xảy ra, vui lòng thử lại!'
            })
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    return {
        formData,
        errors,
        isLoginLoading,
        handleInputChange,
        togglePassword,
        handleSubmit,
    };
};