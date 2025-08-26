import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/user/use-auth';
import { useEffect, useState } from 'react';
import LoadingComponent from '../ui/loading-component';
import ErrorComponent from '../ui/error-component';
import { googleLogout } from '@react-oauth/google';

const Logout = () => {
  const navigate = useNavigate();
  const { handleLogout, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/dang-nhap", { state: { error: 'Bạn chưa đăng nhập.' } });
      return;
    }

    const performLogout = async () => {
      try {
        await handleLogout();
        await googleLogout();
        setTimeout(() => {
          navigate("/dang-nhap", { state: { success: 'Đăng xuất thành công' } });
        }, 100);
      } catch (error) {
        setError('Đăng xuất thất bại. Vui lòng thử lại.');
        setTimeout(() => {
          navigate("/dang-nhap", { state: { error: 'Đăng xuất thất bại. Vui lòng thử lại.' } });
        }, 100);
      } finally {
        setIsLoading(false);
      }
    };

    performLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, handleLogout]);

  if (isLoading) return <LoadingComponent message="Đang đăng xuất..." />;
  if (error) return <ErrorComponent message={error} />;

  return null;
};

export default Logout;