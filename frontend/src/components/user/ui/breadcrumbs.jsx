import React from 'react';

const Breadcrumbs = ({ title, items = [] }) => {
  return (
    <div className="breadcrumbs">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6 col-12">
            <div className="breadcrumbs-content">
              <h1 className="page-title" dangerouslySetInnerHTML={{ __html: title }}></h1>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <ul className="breadcrumb-nav">
              {items.map((item, index) => (
                <li key={index}>
                  {item ? (
                    <a href={item.link}>
                      {item.icon && <i className={item.icon}></i>} {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;