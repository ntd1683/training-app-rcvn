import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '~/hooks/user/use-auth';
import { useEffect, useState } from 'react';
import LoadingComponent from '../ui/loading-component';

const OauthToken = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useParams();


  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/dang-nhap", { state: { error: 'Bạn đang đăng nhập.' } });
      return;
    }
    setIsLoading(true);
    if (token) {
      localStorage.setItem('customer_token', token);
      navigate("/");
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  if (isLoading) return <LoadingComponent message="Đang tải dữ liệu..." />;

  return null;
};

export default OauthToken;