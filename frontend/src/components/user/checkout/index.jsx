import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../ui/breadcrumbs";
import { useCheckout } from "~/hooks/user/use-checkout";
import { Information } from "./information";
import { Shipping } from "./shipping";
import { Payment } from "./payment";
import { PayPalButton } from "./paypal-button";
import { formatPrice } from "~/utils/common";

const Checkout = () => {
    const {
        fee,
        adsBanner,
        user,
        shippingInfo,
        handleShippingInfoChange,
        dataProvinces,
        dataWards,
        products,
        totalAmount,
        handleCreateOrder,
        handleApproveOrder,
        handleCancelOrder,
        handleErrorOrder,
        handleCheckout,
        checkout,
        errors,
    } = useCheckout();

    return (
        <>
            <Breadcrumbs
                title="Thanh Toán"
                items={[
                    { icon: 'lni lni-home', label: "Trang chủ", link: "/" },
                    { label: "Giỏ hàng", link: "/gio-hang" },
                    { label: "Thanh Toán", link: "/thanh-toan" },
                ]}
            />
            <section className="checkout-wrapper section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="checkout-steps-form-style-1">
                                <ul id="accordionExample">
                                    <li>
                                        <h6 className="title" data-bs-toggle="collapse" data-bs-target="#collapseThree"
                                            aria-controls="collapseThree">Thông Tin Cá Nhân</h6>
                                        <Information
                                            user={user}
                                            shippingInfo={shippingInfo}
                                            handleShippingInfoChange={handleShippingInfoChange}
                                            dataProvinces={dataProvinces}
                                            dataWards={dataWards}
                                            errors={errors}
                                        >
                                        </Information>
                                    </li>
                                    <li>
                                        {/* <h6 className="title collapsed" data-bs-toggle="collapse" data-bs-target="#collapsefive"
                                            aria-controls="collapsefive">Thông tin ví</h6> */}
                                        {/* <PayPalButton
                                                handleCreateOrder={handleCreateOrder}
                                                handleApproveOrder={handleApproveOrder}
                                                handleCancelOrder={handleCancelOrder}
                                                handleErrorOrder={handleErrorOrder}
                                            /> */}
                                        {/* <Payment /> */}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="checkout-sidebar">
                                <div className="checkout-sidebar-price-table">
                                    <h5 className="title">Tổng Tiền</h5>
                                    {products.map((product, index) => (
                                        <div className="sub-total-price" key={index}>
                                            <div className="total-price">
                                                <p className="value">{product.name.slice(0, 50)}...</p>
                                                <p className="price">{formatPrice(parseFloat(product.price))}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="sub-total-price">
                                            <div className="total-price">
                                                <p className="value">Phí nền tảng</p>
                                                <p className="price">{fee ? formatPrice(parseFloat(fee)) : 'Free'}</p>
                                            </div>
                                        </div>

                                    <div className="total-payable">
                                        {totalAmount && (
                                            <div className="payable-price">
                                                <p className="value">Tổng tiền</p>
                                                <p className="price">{formatPrice(parseFloat(totalAmount))}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="price-table-btn button">
                                        {!checkout ? (
                                            <button className="btn btn-alt w-100 mb-3" onClick={handleCheckout}>
                                                Thanh Toán
                                            </button>
                                        ) : (
                                            <PayPalButton
                                                handleCreateOrder={handleCreateOrder}
                                                handleApproveOrder={handleApproveOrder}
                                                handleCancelOrder={handleCancelOrder}
                                                handleErrorOrder={handleErrorOrder}
                                            />
                                        )}

                                    </div>
                                </div>
                                <div className="checkout-sidebar-banner mt-30">
                                    {adsBanner && (
                                        <Link to={adsBanner.button_url ? adsBanner.button_url : `/san-pham/${adsBanner?.product_id}`}>
                                            <img src={adsBanner.image_url} alt={adsBanner.title} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Checkout;