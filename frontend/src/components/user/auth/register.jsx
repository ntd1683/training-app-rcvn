import React from "react";
import { Link } from "react-router-dom";
import InputPassword from '../ui/input-password'
import InputText from "../ui/input-text";
import { useRegister } from "~/hooks/user/use-register";
import Breadcrumbs from "../ui/breadcrumbs"

const Register = () => {
    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit
    } = useRegister();
    return (
        <>
            <Breadcrumbs
                title="Đăng Ký"
                items={[
                    { icon: 'lni lni-home',label: "Trang chủ", link: "/" },
                    { label: "Đăng Ký", link: "/dang-ky" }
                ]}
            />
            <div className="account-login section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-12">
                            <form className="card login-form" onSubmit={(e) => handleSubmit(e)}>
                                <div className="card-body">
                                    <div className="title">
                                        <h3>Đăng Ký</h3>
                                        <p style={{ opacity: "70%"}}>Đăng ký mất chưa đầy một phút nhưng cung cấp cho bạn toàn quyền kiểm soát các đơn đặt hàng của mình.</p>
                                    </div>
                                    <InputText
                                        label="Tên đầy đủ"
                                        name="fullName"
                                        placeholder="Nhập tên đầy đủ"
                                        isRequired={true}
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        disabled={isLoading}
                                        errors={errors.fullName}
                                    />
                                    <InputText
                                        label="Email"
                                        name="email"
                                        isRequired={true}
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={isLoading}
                                        errors={errors.email}
                                    />
                                    <InputPassword
                                        key={"password"}
                                        label="Mật khẩu"
                                        name="password"
                                        isRequired={true}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        disabled={isLoading}
                                        errors={errors.password}
                                    />
                                    <InputPassword
                                        key="rePassword"
                                        label="Nhập lại Mật khẩu"
                                        name="rePassword"
                                        isRequired={true}
                                        value={formData.rePassword}
                                        onChange={(e) => handleInputChange('rePassword', e.target.value)}
                                        disabled={isLoading}
                                        errors={errors.rePassword}
                                    />
                                    {errors && <p className={`text-danger error-all mb-3 mt-1 fw-bold`}>{errors.all}</p>}
                                    <div className="button">
                                        <button
                                            className="btn"
                                            type="button"
                                            onClick={(e) => handleSubmit(e)}
                                            disabled={isLoading}
                                        >Đăng Ký</button>
                                    </div>
                                    <p className="outer-link">Bạn đã có tài khoản? <Link to="/dang-nhap">Đăng nhập tại đây</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;