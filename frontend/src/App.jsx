import './App.css';
import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';

import routes from './routes';
import { AuthProvider } from './context/AuthContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

import './assets/css/core.css';

import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// import '../public/assets/vendor/js/helpers.js';
// import '../public/assets/vendor/js/menu.js';
// import '../public/assets/js/main.js';
// import '../public/assets/js/config.js';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>{routes}</Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
