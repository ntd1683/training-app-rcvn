import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/contexts/auth-context';
import { toast } from 'react-toastify';

export const useLogin = () => {
    // state
    const [showPassword, setShowPassword] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const togglePassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorEmail('');
        setErrorPassword('');

        if (!email) {
            setErrorEmail('Email không được bỏ trống');
            return;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setErrorEmail('Email không hợp lệ');
            return;
        }

        if (!password) {
            setErrorPassword('Mật khẩu không được bỏ trống');
            return;
        }

        const success = await handleLogin(email, password, rememberMe);
        if (success) {
            navigate('/users');
        } else {
            setErrorPassword('Invalid username or password');
            toast.error('Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.', {toastId: 'login-error'});
        }
    };

    return {
        showPassword,
        togglePassword,
        errorEmail,
        setErrorEmail,
        errorPassword,
        setErrorPassword,
        email,
        setEmail,
        password,
        setPassword,
        rememberMe,
        setRememberMe,
        handleSubmit
    };
}