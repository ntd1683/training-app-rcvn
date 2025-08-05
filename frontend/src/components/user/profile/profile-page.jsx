/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Breadcrumbs from "../ui/breadcrumbs"
import { formatPrice } from '../../../utils/common';
import { useProfile } from '../../../hooks/user/use-profile';
import Modal from '../ui/modal';

const ProfilePage = () => {
  const {
    formData,
    errors,
    showPasswords,
    isChangingPassword,
    handleChangingPassword,
    togglePasswordVisibility,
    userStats,
    isLoading,
    handleInputChange,
    handleSubmit,
    showModal,
    setShowModal,
    isVerifyingEmail,
    handleVerifyEmail
  } = useProfile();

  return (
    <>
      <Breadcrumbs
        title="Trang Cá Nhân"
        items={[
          { icon: 'lni lni-home', label: "Trang chủ", link: "/" },
          { label: "Trang cá nhân", link: "/trang-ca-nhan" }
        ]}
      />
      <div className="container section">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="card shadow-sm mb-4">
              <div className="card-body text-center py-4">
                <div className="mb-3">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: '80px', height: '80px' }}>
                    <Icon icon="mdi:user" className="text-white" width={40} />
                  </div>
                </div>
                <h2 className="card-title mb-1">{formData.name}</h2>
                <p className="text-muted">{formData.email}</p>
              </div>
            </div>

            {/* Thống kê */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                      <Icon icon="mdi:shopping" className="text-success" width={24} />
                    </div>
                    <div>
                      <h3 className="mb-0 fw-bold">{userStats.totalOrders || 0}</h3>
                      <p className="text-muted mb-0 small">Đơn hàng đã mua</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 rounded p-3 me-3">
                      <Icon icon="mdi:currency-usd" className="text-info" width={24} />
                    </div>
                    <div>
                      <h3 className="mb-0 fw-bold">{formatPrice(userStats.totalSpent)}</h3>
                      <p className="text-muted mb-0 small">Tổng chi tiêu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form thông tin cá nhân */}
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 d-flex align-items-center">
                  <Icon icon="mdi:account" className="me-2" />
                  Thông tin cá nhân
                </h5>
              </div>
              <div className="card-body">
                <div onSubmit={handleSubmit}>
                  {/* Tên */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Họ và tên <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên"
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  {/* Email (disabled) */}
                  <div className="mb-4">
                    <div className='d-flex align-items-center justify-content-between'>
                      <label htmlFor="email" className="form-label fw-semibold"
                      >Email <span className="text-muted small ms-1">{formData.isVerify ? '' : '(Chưa xác minh)'}</span>
                      </label>
                      {!formData.isVerify && (
                        <a
                          className="anchor text-primary cursor-pointer"
                          style={{ fontSize: '0.875rem' }}
                          onClick={() => setShowModal(true)}
                        >Xác minh email</a>
                      )}
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      disabled
                    />
                    <div className="form-text">Email không thể thay đổi</div>
                  </div>

                  {/* Đổi mật khẩu */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="mb-0 d-flex align-items-center">
                        <Icon icon="mdi:lock" className="me-2" />
                        Mật khẩu
                      </h6>
                      <button
                        type="button"
                        className={`btn btn-sm ${isChangingPassword ? 'btn-secondary' : 'btn-outline-primary'}`}
                        onClick={(e) => handleChangingPassword(e)}
                      >
                        {isChangingPassword ? 'Hủy đổi mật khẩu' : 'Đổi mật khẩu'}
                      </button>
                    </div>

                    {isChangingPassword && (
                      <div className="border rounded p-3 bg-light">
                        {/* Mật khẩu hiện tại */}
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            Mật khẩu hiện tại <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              type={showPasswords.current ? "text" : "password"}
                              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => togglePasswordVisibility('current')}
                            >
                              {showPasswords.current ? <Icon icon="mdi:eye-off" /> : <Icon icon="mdi:eye" />}
                            </button>
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                          </div>
                        </div>

                        {/* Mật khẩu mới */}
                        <div className="mb-3">
                          <label htmlFor="newPassword" className="form-label">
                            Mật khẩu mới <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                              id="newPassword"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              placeholder="Nhập mật khẩu mới"
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => togglePasswordVisibility('new')}
                            >
                              {showPasswords.new ? <Icon icon="mdi:eye-off" /> : <Icon icon="mdi:eye" />}
                            </button>
                            {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                          </div>
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div className="mb-0">
                          <label htmlFor="confirmPassword" className="form-label">
                            Xác nhận mật khẩu mới <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
                              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="Nhập lại mật khẩu mới"
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => togglePasswordVisibility('confirm')}
                            >
                              {showPasswords.confirm ? <Icon icon="mdi:eye-off" /> : <Icon icon="mdi:eye" />}
                            </button>
                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nút submit */}
                  <div className="d-grid">
                    <button
                      type="button"
                      className={`btn btn-primary ${isLoading ? 'disabled' : ''}`}
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      Cập nhật thông tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => (false)}
        title={`Xác minh email của bạn`}
        showCloseButton={true}
        backdrop={true}
        keyboard={true}
        footer={
          <div className='mt-3'>
            <button
              className="btn btn-secondary me-2"
              onClick={() => setShowModal(false)}
              disabled={isVerifyingEmail}
            >
              Hủy bỏ
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleVerifyEmail()}
              disabled={isVerifyingEmail}
            >
              {isVerifyingEmail ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Đang xác minh email
                </>
              ) : (
                "Xác minh email"
              )}
            </button>
          </div>
        }
      >
        <p className='mb-0'>
          Bạn có chắc chắn muốn gửi email xác minh đến địa chỉ email của bạn? Vui lòng kiểm tra hộp thư đến của bạn sau khi gửi.
        </p>
      </Modal>
    </>
  );
};

export default ProfilePage;