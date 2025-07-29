import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { useAuth } from './hooks/use-auth';
import LoadingSpinner from './components/admin/ui/loading-spinner';

import AppRoutes from './routes/app-routes';
import { ToastContainer } from 'react-toastify';
import ToastHandler from './components/admin/ui/toast-handler';

import { store } from './redux/store';

import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/admin/core.css';
import './assets/css/admin/custom-toast.css';

import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const AppContent = () => {
  const { initialize, isLoading } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <LoadingSpinner text="Đang khởi tạo ứng dụng..." />
      </div>
    );
  }

  return (
    <>
      <ToastHandler />
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;