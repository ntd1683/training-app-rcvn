  import React from 'react';
  import { BrowserRouter, Routes } from 'react-router-dom';

  import routes from './routes';
  import { AuthProvider } from './contexts/auth-context';
  import { ToastContainer } from 'react-toastify';
  import ToastHandler from './components/ui/toast-handler';

  import './app.css';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';
  import './assets/css/core.css';
  import 'react-toastify/dist/ReactToastify.css';
  import './assets/css/custom-toast.css';

  import 'jquery';
  import 'popper.js';
  import 'bootstrap/dist/js/bootstrap.bundle.min';


  function App() {
    return (
      <AuthProvider>
        <BrowserRouter>
          <ToastHandler />
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
          <Routes>{routes}</Routes>
        </BrowserRouter>
      </AuthProvider>
    );
  }

  export default App;
