import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './use-auth';
import '~/assets/css/admin/page-auth.css';
import { toast } from 'react-toastify';

export const useForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState('');
    const [loading, setLoading] = useState(false);

    const { isAuthenticated, handleResetPassword } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { state: { success: 'Bạn đang đăng nhập' } });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {        
        e.preventDefault();
        setLoading(true);

        if (!email) {
            setErrors('Email không được bỏ trống');
            setLoading(false);
            return;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setErrors('Email không hợp lệ');
            setLoading(false);
            return;
        }

        try {
            const response = await handleResetPassword(email);
            
            if (response.success) {
                navigate('/dang-nhap', { state: { success: 'Vui lòng kiểm tra email để lấy lại mật khẩu' } });
            } else {
                setErrors(response.message || 'Có lỗi xảy ra, vui lòng thử lại!');
                toast.error(response.message || 'Có lỗi xảy ra, vui lòng thử lại!');
            }
        } catch (error) {
            setErrors('Có lỗi xảy ra, vui lòng thử lại!');
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        errors,
        loading,
        handleSubmit,
    };
};