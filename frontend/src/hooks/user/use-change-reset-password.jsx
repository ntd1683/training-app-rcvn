import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './use-auth';
import '~/assets/css/admin/page-auth.css';
import { toast } from 'react-toastify';

export const useChangeResetPassword = () => {
    const { token } = useParams();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rePassword: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        rePassword: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, handleChangeResetPassword } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { state: { success: 'Bạn đang đăng nhập' } });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (token) {
            setFormData(prev => ({
                ...prev,
                token
            }));
        }
    }, [token]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.password && formData.rePassword && formData.password !== formData.rePassword) {
                setErrors(prev => ({
                    ...prev,
                    rePassword: 'Mật khẩu xác nhận không khớp'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    rePassword: ''
                }));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.password, formData.rePassword]);

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

        if (!formData.rePassword) {
            newErrors.rePassword = 'Vui lòng xác nhận mật khẩu';
            isValid = false;
        }

        if (formData.password !== formData.rePassword) {
            newErrors.rePassword = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await handleChangeResetPassword(formData.email, formData.password, formData.rePassword, token);
            if (response.success) {
                navigate('/dang-nhap', { state: { success: 'Đổi mật khẩu thành công' } });
            } else {
                let message = response.message || 'Có lỗi xảy ra, vui lòng thử lại!';
                setErrors({
                    all: message,
                });
                toast.error(message);
            }
        } catch (error) {
            console.log('Error during password change:', error);
            setErrors({
                all: 'Có lỗi xảy ra, vui lòng thử lại!',
            })
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
    };
};