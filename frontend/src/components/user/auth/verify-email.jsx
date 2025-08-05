import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../ui/breadcrumbs";

import { useVerifyEmail } from "~/hooks/user/use-verify-email";

const VerifyEmail = () => {
  const { isLoading, errors, verifyEmail, isVerifiedEmail } = useVerifyEmail();

  const renderLoadingState = () => (
    <div className="text-center">
      <div
        className="spinner-border spinner-border-lg text-primary"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <div>
        <span className="text-muted">Đang xác thực email...</span>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <>
      <i className="lni lni-envelope" />
      <h2>Xác Thực Email Thành Công</h2>
      <p>
        Cảm ơn bạn đã xác thực email. Bạn có thể đăng nhập ngay bây giờ.
      </p>
      <div className="button">
        <Link to="/dang-nhap" className="btn btn-primary">
          Đăng Nhập
        </Link>
      </div>
    </>
  );

  const renderFailureState = () => (
    <>
      <i className="lni lni-envelope" />
      <h2>Xác Thực Email Thất Bại</h2>
      <p className="text-danger fw-bold fs-5">{errors}</p>
      <div className="button">
        <Link to="/" className="btn btn-primary">
          Trang Chủ
        </Link>
      </div>
    </>
  );

  const renderInitialState = () => (
    <>
      <h2>Xác Thực Email</h2>
      <p>Bạn vui lòng bấm xác thực email để hoàn tất đăng ký tài khoản.</p>
      <div className="button">
        <button
          type="button"
          className="btn btn-primary"
          onClick={verifyEmail}
        >
          Xác thực email
        </button>
      </div>
    </>
  );

  const renderContent = () => {
    if (isLoading) return renderLoadingState();
    if (isVerifiedEmail) return errors ? renderFailureState() : renderSuccessState();
    return renderInitialState();
  };

  return (
    <div className="verify-email">
      <Breadcrumbs
        title="Xác Thực Email"
        items={[
          { icon: "lni lni-home", label: "Trang chủ", link: "/" },
          { label: "Xác Thực Email", link: "/xac-thuc-email" },
        ]}
      />
      <div className="maill-success h-100 my-5">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container">
              <div className="success-content">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;