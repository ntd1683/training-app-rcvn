import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectCartTotalQuantity,
    selectCountItemInCart,
    selectCartTotalAmount,
    selectTopCartItems
} from '~/redux/selectors/cart-selector';
import { Link } from 'react-router-dom';
import { formatPrice } from '~/utils/common';
import { removeFromCart, cartRehydrated } from '~/redux/slices/cart-slice';

export const CartLayout = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const cartRef = useRef(null);
    const timeoutRef = useRef(null);

    const totalQuantity = useSelector(selectCartTotalQuantity);
    const totalItems = useSelector(selectCountItemInCart);
    const totalAmount = useSelector(selectCartTotalAmount);
    const { topItems, remainingCount } = useSelector(selectTopCartItems);

    useEffect(() => {
        dispatch(cartRehydrated());
    }, [dispatch]);

    const handleDeleteItem = (id) => (e) => {
        e.preventDefault();
        dispatch(removeFromCart(id));
    };

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const handleCartClick = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsOpen(true);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className="cart-items"
            ref={cartRef}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            <a href="#" className="main-btn" onClick={handleCartClick}>
                <i className="lni lni-cart"></i>
                <span className="total-items">{totalQuantity}</span>
            </a>

            {/* Thêm class active dựa trên state isOpen */}
            <div className={`shopping-item ${isOpen ? 'active' : ''}`}>
                <div className="dropdown-cart-header">
                    <span>{totalItems} Sản Phẩm</span>
                    <Link to="/gio-hang" onClick={handleLinkClick}>
                        Xem giỏ hàng
                    </Link>
                </div>
                <ul className="shopping-list">
                    {topItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                className="remove"
                                title="Xóa sản phẩm"
                                onClick={handleDeleteItem(item?.productInfo?.id)}
                            >
                                <i className="lni lni-close"></i>
                            </Link>
                            <div className="cart-img-head">
                                <Link
                                    className="cart-img"
                                    to={`/san-pham/${item?.productInfo?.id}`}
                                    onClick={handleLinkClick}
                                >
                                    <img src={item?.productInfo?.image} alt={item?.productInfo?.name.length > 50
                                        ? item?.productInfo?.name.slice(0, 50) + '...'
                                        : item?.productInfo?.name} />
                                </Link>
                            </div>

                            <div className="content">
                                <h4>
                                    <Link
                                        to={`/san-pham/${item.id}`}
                                        onClick={handleLinkClick}
                                    >
                                        {item?.productInfo?.name.length > 50
                                            ? item?.productInfo?.name.slice(0, 50) + '...'
                                            : item?.productInfo?.name}
                                    </Link>
                                </h4>
                                <p className="quantity d-flex justify-content-between">
                                    <span>{item?.quantity}x</span>
                                    <span className="amount">
                                        {formatPrice(parseFloat(item?.productInfo?.price))}
                                    </span>
                                </p>
                            </div>
                        </li>
                    ))}
                    {remainingCount > 0 && (
                        <li className="more-items">
                            <div className="text-center w-100">
                                <p className="text-muted">
                                    ... và {remainingCount} sản phẩm khác
                                </p>
                            </div>
                        </li>
                    )}
                </ul>
                <div className="bottom">
                    <div className="total">
                        <span>Tổng tiền</span>
                        <span className="total-amount">
                            {formatPrice(parseFloat(totalAmount))}
                        </span>
                    </div>
                    <div className="button">
                        <Link
                            to="/thanh-toan"
                            className="btn animate"
                            onClick={handleLinkClick}
                        >
                            Thanh toán
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};