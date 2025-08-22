import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './use-auth';
import '~/assets/css/admin/page-auth.css';
import { toast } from 'react-toastify';
import { useGoogleOneTapLogin } from '@react-oauth/google';

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

    const { isAuthenticated, isLoginLoading, handleLogin, handleVerifyTokenOauth2 } = useAuth();
    const navigate = useNavigate();

    const googleIdClient = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { state: { success: 'Bạn đang đăng nhập' } });
        }
    }, [isAuthenticated, navigate]);

    useGoogleOneTapLogin({
        onSuccess: async (credentialResponse) => {
            try {
                const response = await handleVerifyTokenOauth2(credentialResponse.credential);

                if (response.success) {
                    navigate('/', { state: { success: 'Đăng nhập bằng Google thành công' } });
                } else {
                    toast.error('Đăng nhập bằng Google thất bại!');
                }
            } catch (error) {
                toast.error('Đăng nhập bằng Google thất bại!');
            }
        },
        onError: () => {
            toast.error('Đăng nhập bằng Google thất bại, Vui lòng thử lại sau!');
        },
        disabled: isAuthenticated,
        auto_select: false,
    });

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

    const handleSuccess = async (credentialResponse) => {
        try {
            const response = await handleVerifyTokenOauth2(credentialResponse.credential);

            if (response.success) {
                navigate('/', { state: { success: 'Đăng nhập bằng Google thành công' } });
            } else {
                toast.error('Đăng nhập bằng Google thất bại!');
            }
        } catch (error) {
            toast.error('Đăng nhập bằng Google thất bại!');
        }
    };

    return {
        formData,
        errors,
        isLoginLoading,
        handleInputChange,
        togglePassword,
        handleSubmit,
        googleIdClient,
        handleSuccess,
    };
};