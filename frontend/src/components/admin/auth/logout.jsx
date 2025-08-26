import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/hooks/admin/use-auth';
import { useEffect, useState } from 'react';
import { getUrlPrefix } from '~/utils/common';

const Logout = () => {
  const navigate = useNavigate();
  const { handleLogout, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const urlPrefix = getUrlPrefix(location) === 'admin' ? '/admin' : '';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`${urlPrefix}/login`, { state: { error: 'Bạn chưa đăng nhập.' } });
      return;
    }

    const performLogout = async () => {
      try {
        await handleLogout();
        setTimeout(() => {
          navigate(`${urlPrefix}/login`, { state: { success: 'Đăng xuất thành công' } });
        }, 100);
      } catch (error) {
        setError('Đăng xuất thất bại. Vui lòng thử lại.');
        setTimeout(() => {
          navigate(`${urlPrefix}/login`, { state: { error: 'Đăng xuất thất bại. Vui lòng thử lại.' } });
        }, 100);
      } finally {
        setIsLoading(false);
      }
    };

    performLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, handleLogout]);

  if (isLoading) {
    return <div>Đang đăng xuất...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return null;
};

export default Logout;