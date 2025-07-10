import React from 'react';
import { Link } from 'react-router-dom';
import errorImage from '../assets/images/403-forbidden.png';

const NotFound = () => {
  return (
    <div className="container text-center my-5">
      <div>
        <h1 className="display-1 mb-2" style={{ lineHeight: '6rem', fontSize: '6rem' }}>
          403
        </h1>
        <h4 className="mb-2">Bạn không có quyền vào trang này ⚠️</h4>
        <Link to="/" className="btn btn-primary">
          Về Trang Chủ
        </Link>
        <div className="mt-4">
          <img
            src={errorImage}
            alt="page-misc-error-light"
            width="400"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;