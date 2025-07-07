import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from "@iconify/react";
import '~/assets/css/page-auth.css';
import { useLogin } from '~/hooks/use-login';

const Login = () => {
  const {
    showPassword,
    togglePassword,
    errorEmail,
    errorPassword,
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
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
                        src="logo192.png"
                        alt="logo"
                        className="img-fluid"
                      />
                    </span>
                  </span>
                </Link>
              </div>
              <h4 className="mb-1">Chào mừng bạn đến với Training - Website! 👋</h4>
              <p className="mb-5">Vui lòng đăng nhập để bắt đầu</p>

              <form id="formAuthentication" className="mb-5" action="index.html">
                <div className="mb-5">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="text"
                    className={`form-control ${errorEmail ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    placeholder="Vui lòng nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus />
                  {errorEmail && <p className='text-danger error-email mb-0 mt-1'>{errorEmail}</p>}
                </div>
                <div className="mb-5 form-password-toggle">
                  <label className="form-label" htmlFor="password">Mật Khẩu</label>
                  <div className="input-group input-group-merge">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className={`form-control ${errorPassword ? 'is-invalid' : ''}`}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                      aria-describedby="password" />
                    <span className="input-group-text cursor-pointer" onClick={togglePassword} style={{ zIndex: 10 }}>
                      <Icon icon={showPassword ? 'bx:show' : 'bx:hide'} className='icon-base' />
                    </span>
                  </div>
                  {errorPassword && <p className='text-danger error-password mb-0 mt-1'>{errorPassword}</p>}
                </div>
                <div className="mb-8">
                  <div className="d-flex justify-content-between">
                    <div className="form-check mb-0">
                      <input className="form-check-input"
                        type="checkbox"
                        id="remember-me"
                        value={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="remember-me"> Ghi nhớ đăng nhập </label>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <button className="btn btn-primary d-grid w-100" type="submit" onClick={handleSubmit}>Đăng Nhập</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;