// components/Toast.js
import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Toast as BootstrapToast } from 'bootstrap';
import { Icon } from "@iconify/react";


const Toast = ({ title = 'Thông báo', message = '', type = 'primary', autohide = true }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    const toastEl = toastRef.current;
    const bsToast = new BootstrapToast(toastEl, {
      autohide,
      delay: 3000,
    });
    bsToast.show();
  }, [autohide]);

  return (
    <div
      ref={toastRef}
      className={`toast align-items-center text-white bg-${type} border-0 position-fixed top-0 end-0 m-3`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ zIndex: 1050 }}
    >
      <div className="toast-header" style={{ color: 'white' }}>
        <Icon icon="bx:bell" className="icon-base me-2" />
        <strong className="me-auto">{title}</strong>
        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
};

export default Toast;
