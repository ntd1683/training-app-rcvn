import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import AppRoutes from './routes/app-routes';
import { ToastContainer } from 'react-toastify';
import ToastHandler from './components/admin/ui/toast-handler';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const AppContent = () => {
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
        limit={10}
      />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
      >
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;