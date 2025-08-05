import React from "react";
import InputText from "../ui/input-text";
import { useForgotPassword } from "~/hooks/user/use-forgot-password";
import Breadcrumbs from "../ui/breadcrumbs"

const ForgotPassword = () => {
    const {
        email,
        setEmail,
        errors,
        loading,
        handleSubmit,
    } = useForgotPassword();
    return (
        <>
            <Breadcrumbs
                title="Quên Mật Khẩu"
                items={[
                    { icon: 'lni lni-home',label: "Trang chủ", link: "/" },
                    { label: "Quên Mật Khẩu", link: "/quen-mat-khau" }
                ]}
            />
            <div className="account-login section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-12">
                            <form className="card login-form" onSubmit={(e) => handleSubmit(e)}>
                                <div className="card-body">
                                    <div className="title">
                                        <h3>Quên Mật Khẩu</h3>
                                        <p style={{ opacity: "70%"}}>Nếu bạn quên mật khẩu, hãy nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu.</p>
                                    </div>
                                    <InputText
                                        label="Email"
                                        name="email"
                                        isRequired={true}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        errors={errors}
                                    />
                                    <div className="button">
                                        <button
                                            className="btn"
                                            type="button"
                                            onClick={(e) => handleSubmit(e)}
                                            disabled={loading}
                                        >Quên Mật Khẩu</button>
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

export default ForgotPassword;