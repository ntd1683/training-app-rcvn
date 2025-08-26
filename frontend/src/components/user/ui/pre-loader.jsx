import React from 'react';
import '~/assets/css/user/pre-loader.css';

const PreLoader = () => {

  return (
    <div className="preloader" style={{ opacity: 1, transition: 'opacity 0.5s ease' }}>
      <div className="preloader-inner">
        <div className="preloader-icon">
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default PreLoader;