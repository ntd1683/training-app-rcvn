import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import errorImage from '../assets/images/404-not-found.png';
import { getUrlPrefix } from '../utils/common';

const NotFound = () => {
  const location = useLocation();
  const urlPrefix = getUrlPrefix(location) === 'admin' ? '/admin' : '';
  
  return (
    <div className="container text-center my-5">
      <div>
        <h1 className="display-1 mb-2" style={{ lineHeight: '6rem', fontSize: '6rem' }}>
          404
        </h1>
        <h4 className="mb-2">Không Tìm Thấy Trang ⚠️</h4>
        <Link to={`${urlPrefix}`} className="btn btn-primary">
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