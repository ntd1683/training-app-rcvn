import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsOpen } from '~/redux/slices/search-slice';
import placeholderImg from '~/assets/images/placeholder.jpg';
import { sanitizeContent, truncateText } from '~/utils/common';

export const SearchResultItem = ({ product, toggleMobileSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(setIsOpen(false));
    if (toggleMobileSearch) {
      toggleMobileSearch();
    }
    navigate(`/san-pham/${product.id}`);
  };

  const formatPrice = (price, currency = 'VND') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);
    } else {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price * 24000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span className="badge bg-success">Đang bán</span>;
      case 2:
        return <span className="badge bg-warning">Hết hàng</span>;
      case 0:
        return <span className="badge bg-secondary">Ngừng bán</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className="px-3 py-2 cursor-pointer hover-bg-light border-bottom"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="row align-items-center">
        <div className="col-2">
          <img
            src={product.image || placeholderImg}
            alt={product.name}
            className="img-fluid rounded"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = placeholderImg;
            }}
          />
        </div>

        {/* Product Info */}
        <div className="col-10">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h6 className="mb-1" style={{ fontSize: '14px', lineHeight: '1.3' }}>
                {truncateText(product.name, 60)}
              </h6>

              {/* Description */}
              {product.description && (
                <p
                  className="mb-1 text-muted"
                  style={{ fontSize: '12px', lineHeight: '1.2', overflowWrap: "break-word" }}
                  dangerouslySetInnerHTML={{ __html: truncateText(sanitizeContent(product.description), 100) }} />
              )}

              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="text-primary fw-bold" style={{ fontSize: '14px' }}>
                  {formatPrice(product.price, product.currency)}
                </span>
                {getStatusBadge(product.status)}
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Còn lại: <span className="fw-bold">{product.quantity || 0}</span>
                </small>

                {/* Sold count */}
                {product.soldCount > 0 && (
                  <small className="text-success">
                    Đã bán: <span className="fw-bold">{product.soldCount}</span>
                  </small>
                )}
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="ms-2">
              <i className="lni lni-chevron-right text-muted"></i>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};