import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ToastHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.error) {
      toast.error(location.state.error, { toastId: 'state-error-toast' });
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.success) {
      toast.success(location.state.success, { toastId: 'state-success-toast' });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  return null;
};

export default ToastHandler;