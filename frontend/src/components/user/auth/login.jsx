import React from "react";
import { Link } from "react-router-dom";
import InputPassword from '../ui/input-password'
import InputText from "../ui/input-text";
import { useLogin } from "~/hooks/user/use-login";
import Breadcrumbs from "../ui/breadcrumbs"

const Login = () => {
    const {
        formData,
        errors,
        isLoginLoading,
        handleInputChange,
        handleSubmit
    } = useLogin();
    return (
        <>
            <Breadcrumbs
                title="Đăng Nhập"
                items={[
                    { icon: 'lni lni-home',label: "Trang chủ", link: "/" },
                    { label: "Đăng Nhập", link: "/dang-nhap" }
                ]}
            />
            <div className="account-login section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-12">
                            <form className="card login-form" onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="title">
                                        <h3>Đăng Nhập</h3>
                                        <p style={{ opacity: "70%"}}>Bạn có thể đăng nhập bằng tài khoản mạng xã hội hoặc địa chỉ email của mình.</p>
                                    </div>
                                    <div className="social-login">
                                        <div className="d-flex justify-content-center">
                                            <div className="col-md-6 col-12">
                                                <Link className="btn google-btn" to="#">
                                                    <i className="lni lni-google"></i> Google
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="alt-option">
                                        <span>Or</span>
                                    </div>
                                    <InputText
                                        label="Email"
                                        name="email"
                                        isRequired={true}
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={isLoginLoading}
                                        errors={errors.email}
                                    />
                                    <InputPassword
                                        label="Mật khẩu"
                                        name="password"
                                        isRequired={true}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        disabled={isLoginLoading}
                                        errors={errors.password}
                                    />
                                    <div className="d-flex flex-wrap justify-content-between bottom-content">
                                        <div className="mb-3">
                                            <div className="form-check mb-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="remember-me"
                                                    checked={formData.rememberMe}
                                                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                                                    disabled={isLoginLoading}
                                                />
                                                <label className="form-check-label" htmlFor="remember-me">
                                                    Ghi nhớ đăng nhập
                                                </label>
                                            </div>
                                        </div>
                                        <Link to="/quen-mat-khau" className="lost-pass">Quên mật khẩu?</Link>
                                    </div>
                                    <div className="button">
                                        <button
                                            className="btn"
                                            type="button"
                                            onClick={(e) => handleSubmit(e)}
                                            disabled={isLoginLoading}
                                        >Đăng Nhập</button>
                                    </div>
                                    <p className="outer-link">
                                        Bạn chưa có tài khoản? <Link to="/dang-ky">Đăng ký tại đây</Link>
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

export default Login;