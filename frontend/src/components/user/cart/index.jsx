import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../ui/breadcrumbs';
import { NumberInput } from '../ui/number-input';
import { formatPrice } from '~/utils/common';
import { useCart } from '~/hooks/user/use-cart';

const Cart = () => {
    const { cartItems, totalAmount, fee, handleQuantityChange, handleDeleteItem } = useCart();

    return (
        <>
            <Breadcrumbs
                title="Giỏ hàng"
                items={[
                    { icon: 'lni lni-home', label: "Trang chủ", link: "/" },
                    { label: "Giỏ hàng", link: "/gio-hang" },
                ]}
            />
            <div className="shopping-cart section">
                <div className="container">
                    <div className="cart-list-head">
                        <div className="cart-list-title">
                            <div className="row">
                                <div className="col-lg-2 col-md-2 col-12">
                                    <p>Ảnh sản phẩm</p>
                                </div>
                                <div className="col-lg-5 col-md-4 col-12">
                                    <p>Tên sản phẩm</p>
                                </div>
                                <div className="col-lg-2 col-md-3 col-12">
                                    <p className='text-center'>Số lượng</p>
                                </div>
                                <div className="col-lg-2 col-md-2 col-12">
                                    <p>Thành tiền</p>
                                </div>
                                <div className="col-lg-1 col-md-1 col-12">
                                    <p>Xóa</p>
                                </div>
                            </div>
                        </div>
                        {cartItems.map((item, index) => (
                            <div className="cart-single-list" key={index}>
                                <div className="row align-items-center">
                                    <div className="col-lg-2 col-md-2 col-12">
                                        <Link to={`/san-pham/${item?.productInfo?.id}`}>
                                            <img src={item?.productInfo?.image} alt={item?.productInfo?.name.length > 50
                                                ? item?.productInfo?.name.slice(0, 50) + '...'
                                                : item?.productInfo?.name} />
                                        </Link>
                                    </div>
                                    <div className="col-lg-5 col-md-4 col-12">
                                        <h5 className="product-name">
                                            <Link to={`/san-pham/${item?.productInfo?.id}`}>
                                                <p>
                                                    {item?.productInfo?.name.length > 50
                                                        ? item?.productInfo?.name.slice(0, 50) + '...'
                                                        : item?.productInfo?.name}
                                                </p>
                                                <p style={{ opacity: '65%' }}>
                                                    Còn lại : {item?.productInfo?.quantity}
                                                </p>
                                            </Link>
                                        </h5>
                                    </div>
                                    <div className="col-lg-2 col-md-3 col-12">
                                        <div className="count-input">
                                            <NumberInput
                                                value={item?.quantity}
                                                setValue={(newQuantity) => handleQuantityChange(item?.productInfo?.id, newQuantity)}
                                                name={`quantity-${index}`}
                                                max={item?.productInfo?.quantity}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-2 col-12">
                                        <p>{formatPrice(parseFloat(item?.totalPrice))}</p>
                                    </div>
                                    <div className="col-lg-1 col-md-1 col-12">
                                        <Link
                                            className="remove-item"
                                            to='#'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDeleteItem(item?.productInfo?.id);
                                            }}
                                        >
                                            <i className="lni lni-close"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="total-amount">
                                <div className="row">
                                    <div className="col-lg-8 col-md-6 col-12">
                                        {/* <div className="left">
                                            <div className="coupon">
                                                <form action="#" target="_blank">
                                                    <input name="Coupon" placeholder="Enter Your Coupon" />
                                                    <div className="button">
                                                        <button className="btn">Apply Coupon</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-12">
                                        <div className="right">
                                            <ul>
                                                {/* <li>Cart Subtotal<span>$2560.00</span></li> */}
                                                <li>Phí nền tảng<span>{fee ? formatPrice(parseFloat(fee)) : 'Free'}</span></li>
                                                {/* <li>You Save<span>$29.00</span></li> */}
                                                <li className="last">You Pay<span>{formatPrice(parseFloat(totalAmount) + parseFloat(fee))}</span></li>
                                            </ul>
                                            <div className="button">
                                                <Link to="/thanh-toan" className="btn">
                                                    Thanh Toán
                                                </Link>
                                                <Link to="/shop" className="btn btn-alt">Tiếp Tục Mua Sắm</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;