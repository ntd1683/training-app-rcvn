import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '~/utils/common';

const ProductsInfo = ({ products }) => {
    return (
        <div className="row mb-4 products-info">
            <div className="col-12">
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        <h5 className="mb-4">Danh Sách Sản Phẩm</h5>
                        {products.map((product, index) => (
                            <div key={index} className="row align-items-center mb-3">
                                <div className="col-auto">
                                    <img
                                        src={product.image_url ?? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjREREIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxMiI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='}
                                        alt={product.name}
                                        className="rounded"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                </div>
                                <Link className='col' to={`/san-pham/${product.id}`}>
                                    <h6 className="mb-2">{product.name}</h6>
                                    {/* <p className="text-muted mb-1">Phân loại hàng: {product.category}</p> */}
                                    <small className="text-muted">x{product.order_quantity}</small>
                                </Link>
                                <div className="col-auto">
                                    <span className="fw-bold">{formatPrice(parseFloat(product.order_price))}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductsInfo;