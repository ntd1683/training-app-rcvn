import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './use-auth';
import '~/assets/css/admin/page-auth.css';
import { toast } from 'react-toastify';

export const useVerifyEmail = () => {
    const { handleVerifyEmailCustomer } = useAuth();
    const { token } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/', { state: { error: 'Token không hợp lệ' } });
            return;
        }
    }, [token, navigate]);

    const verifyEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await handleVerifyEmailCustomer(token);

            if (response.success) {
                toast.success('Xác thực email thành công');
            } else {
                setErrors(response.message);
                toast.error(response.message);
            }
        } catch (error) {
            setErrors(error.message || 'Lỗi xác thực email');
            toast.error(error.message || 'Lỗi xác thực email');
        } finally {
            setIsLoading(false);
            setIsVerifiedEmail(true);
        }
    };

    return {
        isLoading,
        errors,
        verifyEmail,
        isVerifiedEmail,
    };
};
