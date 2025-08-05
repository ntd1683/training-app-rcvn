import React from "react";
import InputPassword from '../ui/input-password'
import InputText from "../ui/input-text";
import { useChangeResetPassword } from "~/hooks/user/use-change-reset-password";
import Breadcrumbs from "../ui/breadcrumbs"

const ChangeResetPassword = () => {
    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
    } = useChangeResetPassword();
    return (
        <>
            <Breadcrumbs
                title="Khôi phục mật khẩu"
                items={[
                    { icon: 'lni lni-home',label: "Trang chủ", link: "/" },
                    { label: "Khôi phục mật khẩu", link: "/khoi-phuc-mat-khau" }
                ]}
            />
            <div className="account-login section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-12">
                            <form className="card login-form" onSubmit={(e) => handleSubmit(e)}>
                                <div className="card-body">
                                    <div className="title">
                                        <h3>Khôi phục mật khẩu</h3>
                                        <p style={{ opacity: "70%"}}>Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu.</p>
                                    </div>
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
                                        >Khôi phục mật khẩu</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangeResetPassword;