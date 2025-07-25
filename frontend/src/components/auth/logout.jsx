import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/use-auth';
import { useEffect, useState } from 'react';

const Logout = () => {
  const navigate = useNavigate();
  const { handleLogout, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { error: 'Bạn chưa đăng nhập.' } });
      return;
    }

    const performLogout = async () => {
      try {
        await handleLogout();
        setTimeout(() => {
          navigate('/login', { state: { success: 'Đăng xuất thành công' } });
        }, 100);
      } catch (error) {
        setError('Đăng xuất thất bại. Vui lòng thử lại.');
        setTimeout(() => {
          navigate('/login', { state: { error: 'Đăng xuất thất bại. Vui lòng thử lại.' } });
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