import React from 'react';
import { useLogin } from '~/hooks/admin/use-login';
import { Link } from 'react-router-dom';
import { Icon } from "@iconify/react";
import '~/assets/css/page-auth.css';

const Login = () => {
  const {
    formData,
    errors,
    isLoginLoading,
    handleInputChange,
    togglePassword,
    handleSubmit
  } = useLogin();

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y" style={{ height: '100vh' }}>
        <div className="authentication-inner">
          <div className="card px-sm-6 px-0 custom-card">
            <div className="card-body">
              <div className="app-brand justify-content-center">
                <Link to="/" className="app-brand-link gap-2">
                  <span className="app-brand-logo demo">
                    <span className="text-primary">
                      <img
                        src="/logo192.png"
                        alt="logo"
                        className="img-fluid"
                      />
                    </span>
                  </span>
                </Link>
              </div>
              <h4 className="mb-1">Chào mừng bạn đến với Training - Website! 👋</h4>
              <p className="mb-5">Vui lòng đăng nhập để bắt đầu</p>

              <form id="formAuthentication" className="mb-5" onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="text"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    placeholder="Vui lòng nhập email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={isLoginLoading}
                    autoFocus
                  />
                  {errors.email && <p className='text-danger error-email mb-0 mt-1'>{errors.email}</p>}
                </div>

                <div className="mb-5 form-password-toggle">
                  <label className="form-label" htmlFor="password">Mật Khẩu</label>
                  <div className="input-group input-group-merge">
                    <input
                      type={formData.showPassword ? 'text' : 'password'}
                      id="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                      disabled={isLoginLoading}
                    />
                    <span
                      className={`input-group-text cursor-pointer ${errors.password ? 'is-invalid' : ''}`}
                      onClick={togglePassword}
                      style={{ zIndex: 10 }}
                    >
                      <Icon icon={formData.showPassword ? 'bx:show' : 'bx:hide'} className='icon-base' />
                    </span>
                  </div>
                  {errors.password && <p className='text-danger error-password mb-0 mt-1'>{errors.password}</p>}
                </div>

                <div className="mb-8">
                  <div className="d-flex justify-content-between">
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
                </div>

                <div className="mb-5">
                  <button
                    className="btn btn-primary d-grid w-100"
                    type="submit"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;