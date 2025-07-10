import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/contexts/auth-context';
import { useEffect, useState } from 'react';

const Logout = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      console.error('No token found in local storage');
      navigate('/login');
      return;
    }

    const performLogout = async () => {
      try {
        await handleLogout();
        navigate('/login', { state: { success: 'Đăng xuất thành công' } });
      } catch (error) {
        console.error('Logout failed:', error);
        setError('Đăng xuất thất bại. Vui lòng thử lại.');
        navigate('/login', { state: { error: 'Đăng xuất thất bại. Vui lòng thử lại.' } });
      } finally {
        setIsLoading(false);
      }
    };

    performLogout();
  }, [navigate, handleLogout, token]);

  if (isLoading) {
    return <div>Đang đăng xuất...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return null;
};

export default Logout;