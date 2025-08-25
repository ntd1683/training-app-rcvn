import React from "react";
import { Shipping } from "./shipping"

export const Information = ({ user, shippingInfo, handleShippingInfoChange, dataProvinces, dataWards, errors, children }) => {
    return (
        <section className="checkout-steps-form-content collapse show" id="collapseThree"
            aria-labelledby="headingThree" data-bs-parent="#accordionExample">
            <div className="row">
                <div className="col-md-12">
                    <div className="single-form form-default">
                        <label>Tên đầy đủ</label>
                        <div className="row">
                            <div className="form-input form">
                                <input type="text" placeholder="Họ và tên" value={user?.name || ''} disabled />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="single-form form-default">
                        <label>Địa chỉ email</label>
                        <div className="form-input form">
                            <input type="text" placeholder="Địa chỉ email" value={user?.email || ''} disabled />
                        </div>
                    </div>
                </div>
                
                {children}
            </div>
            <Shipping
                shippingInfo={shippingInfo}
                handleShippingInfoChange={handleShippingInfoChange}
                dataProvinces={dataProvinces}
                dataWards={dataWards}
                errors={errors}
            />
        </section>
    )
}