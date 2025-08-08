import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "~/utils/common";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "~/redux/slices/cart-slice";
import { selectIsAddToCart } from "~/redux/selectors/cart-selector";

const isNewProduct = (createdAt, distance = 30) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= distance;
};

const Item = ({ product, className = "", distanceDayNew = 30 }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const isOutStock = product.status === 2 || product.quantity <= 0;

    let tag = "";
    if (isOutStock) {
        tag = <span className="out-stock-tag">Hết hàng</span>;
    } else if (product.sold_count >= 100) {
        tag = <span className="sale-tag">Hot</span>;
    } else if (isNewProduct(product.created_at, distanceDayNew)) {
        tag = <span className="new-tag">Mới</span>;
    }

    const handleItemClick = () => {
        navigate(`/san-pham/${product.id}`);
    };

    const isAddToCart = useSelector(selectIsAddToCart);
    const handleAddToCart = (e) => {
        e.stopPropagation();
        dispatch(addToCart(product));
    };

    return (
        <div
            className={`single-product ${className}`}
            onClick={handleItemClick}
            style={{ cursor: "pointer" }}
        >
            <div className="product-image">
                <img src={product.image_url} alt={product.name.length > 50
                    ? product.name.slice(0, 50) + '...'
                    : product.name} />
                {tag}
                {!isAddToCart && (
                    <div className="button">
                        <button
                            onClick={handleAddToCart}
                            className="btn"
                        >
                            <i className="lni lni-cart"></i> Thêm vào giỏ hàng
                        </button>
                    </div>
                )}
            </div>
            <div className="product-info">
                {/* <span className="category">Watches</span> */}
                <h4 className="title">
                    <Link to={`/san-pham/${product.id}`}>{product.name.length > 50
                        ? product.name.slice(0, 50) + '...'
                        : product.name}</Link>
                </h4>
                {/* <ul className="review">
                                    <li><i className="lni lni-star-filled"></i></li>
                                    <li><i className="lni lni-star-filled"></i></li>
                                    <li><i className="lni lni-star-filled"></i></li>
                                    <li><i className="lni lni-star-filled"></i></li>
                                    <li><i className="lni lni-star"></i></li>
                                    <li><span>4.0 Review(s)</span></li>
                                </ul> */}
                {isOutStock ? (
                    <span className="out-stock fw-bold fs-6">Hết hàng</span>
                ) : (
                    <div className="d-flex justify-content-between">
                        <div className="price mt-0">
                            <span>{formatPrice(parseFloat(product.price))}</span>
                            {product.discountPrice && (
                                <span className="discount-price">{formatPrice(parseFloat(product.discountPrice))}</span>
                            )}
                        </div>
                        <span className="ms-3" style={{ opacity: "80%" }}>{product.sold_count} đã bán</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Item;