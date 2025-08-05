import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './use-auth';
import '~/assets/css/admin/page-auth.css';
import { toast } from 'react-toastify';

export const useRegister = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        rePassword: '',
    });

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        password: '',
        rePassword: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, handleRegister } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { state: { success: 'Bạn đang đăng nhập' } });
        }
    }, [isAuthenticated, navigate]);

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

        if (!formData.fullName) {
            newErrors.fullName = 'Tên đầy đủ không được bỏ trống';
            isValid = false;
        } else if (formData.fullName.length < 3) {
            newErrors.fullName = 'Tên đầy đủ phải có ít nhất 3 ký tự';
            isValid = false;
        } else if (/^[a-zA-Z\s]*$/.test(formData.fullName)) {
            newErrors.fullName = 'Tên đầy đủ không được chứa kí tự đặc biệt';
            isValid = false;
        }

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
            const response = await handleRegister(formData.fullName, formData.email, formData.password, formData.rePassword);
            if (response.success) {
                navigate('/dang-nhap', { state: { success: 'Đăng ký thành công' } });
            } else {
                setErrors({
                    all: 'Có lỗi xảy ra, vui lòng thử lại!',
                });
                toast.error('Có lỗi xảy ra, vui lòng thử lại!');
            }
        } catch (error) {
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