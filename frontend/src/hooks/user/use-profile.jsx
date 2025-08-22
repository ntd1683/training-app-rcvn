import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './use-auth';
import { toast } from 'react-toastify';

export const useProfile = () => {
    const { isAuthenticated, customer, handleUpdateProfile, handleSendVerificationEmail } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
        isVerify: false,
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/', { state: { error: 'Bạn chưa đăng nhập' } });
        }
    }, [isAuthenticated, navigate]);

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userStats, setUserStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
    });
    const [showModal, setShowModal] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const isMounted = useRef(false);

    useEffect(() => {
        if (customer && !isMounted.current) {
            setFormData(prev => ({
                ...prev,
                name: customer.fullName || customer.name || '',
                email: customer.email || '',
                isVerify: customer.email_verified_at || false
            }));
            setUserStats(prev => ({
                ...prev,
                totalOrders: customer.total_products || 0,
                totalSpent: customer.total_price || 0,
            }));
            setIsLoading(false);
        }
    }, [customer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên không được để trống';
        }

        if (isChangingPassword) {
            if (!formData.password) {
                newErrors.password = 'Vui lòng nhập mật khẩu hiện tại';
            }

            if (!formData.newPassword) {
                newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
            } else if (formData.newPassword.length < 4) {
                newErrors.newPassword = 'Mật khẩu phải có ít nhất 4 ký tự';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
            } else if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await handleUpdateProfile(formData);
            if (response.success) {
                toast.success('Cập nhật thông tin thành công');
                setIsChangingPassword(false);
                setFormData((prev) => ({
                    ...prev,
                    password: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            } else {
                setErrors({ all: response.message || 'Có lỗi xảy ra, vui lòng thử lại!' });
                toast.error(response.message || 'Có lỗi xảy ra, vui lòng thử lại!');
            }
        } catch (error) {
            toast.error('Không thể cập nhật thông tin người dùng');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangingPassword = (e) => {
        e.preventDefault();
        setIsChangingPassword(!isChangingPassword);
        if (isChangingPassword) {
            setFormData(prev => ({
                ...prev,
                password: '',
                newPassword: '',
                confirmPassword: ''
            }));
            setErrors({});
        }
    }

    const handleVerifyEmail = async () => {
        setIsVerifyingEmail(true);
        try {
            const response = await handleSendVerificationEmail();
            if (response.success) {
                toast.success('Email xác minh đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
            } else {
                toast.error(response.message || 'Không thể gửi email xác minh. Vui lòng thử lại sau.');
            }
        } catch (error) {
            toast.error('Không thể gửi email xác minh. Vui lòng thử lại sau.');
        } finally {
            setIsVerifyingEmail(false);
            setShowModal(false);
        }
    };

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

    return {
        customer,
        formData,
        errors,
        showPasswords,
        isChangingPassword,
        handleChangingPassword,
        togglePasswordVisibility,
        userStats,
        isLoading,
        handleInputChange,
        handleSubmit,
        showModal,
        setShowModal,
        isVerifyingEmail,
        handleVerifyEmail,
    };
};