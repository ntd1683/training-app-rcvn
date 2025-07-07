import { useState } from "react";
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Icon } from "@iconify/react/dist/iconify.js";
import "~/assets/css/layout.css";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <aside id="layout-menu" className={`layout-menu menu-vertical menu bg-menu-theme d-sm-none ${isMenuOpen ? "menu-open" : ""}`}>
          <div className="app-brand demo">
            <a href="index.html" className="app-brand-link">
              <img src="logo192.png" alt="logo" className="img-fluid" />
            </a>
            <button className="layout-menu-toggle menu-link text-large ms-auto" onClick={toggleMenu}>
              <Icon icon="bx:bx-chevron-left-circle" className="d-block align-middle" />
            </button>
          </div>
          <div className="menu-divider mt-0"></div>
          <div className="menu-inner-shadow"></div>
          <ul className="menu-inner py-1">
            <li className={`menu-item ${isActive('/users')}`}>
              <Link to="/users" className="menu-link">
                <Icon icon="bx:user-voice" className="menu-icon bx" />
                <div className="text-truncate">
                  Users
                </div>
              </Link>
            </li>
            <li className={`menu-item ${isActive('/role-and-permission')}`}>
              <Link to="/role-and-permission" className="menu-link">
                <Icon icon="bx:lock-open" className="menu-icon bx" />
                <div className="text-truncate">
                  Quản lý quyền và vai trò
                </div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/products" className={`menu-link ${isActive('/products')}`}>
                  <Icon icon="bx:cart-alt" className="menu-icon bx" />
                  <div className="text-truncate">
                    Sản Phẩm
                  </div>
              </Link>
            </li>
          </ul>
        </aside>

        <div className="layout-page">
          <nav
            className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme"
            id="layout-navbar"
          >
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-sm-none">
              <button className="nav-item nav-link px-0 me-xl-6" onClick={toggleMenu}>
                <Icon icon="bx:menu" className="icon-base bx icon-md" />
              </button>
            </div>
            <div className="navbar-nav-right d-flex align-items-center justify-content-end" id="navbar-collapse">
              <ul className="navbar-nav d-none d-sm-flex flex-sm-column flex-md-row justify-content-evenly w-100">
                <li className={`nav-item ${isActive('/users')}`}>
                  <Link to="/users" className="nav-link d-flex align-items-center">
                    <Icon icon="bx:user-voice" className="me-2" style={{ fontSize: '1.5rem' }}/>
                    <span>Users</span>
                  </Link>
                </li>
                <li className={`nav-item ${isActive('/role-and-permission')}`}>
                  <Link to="/role-and-permission" className="nav-link d-flex align-items-center">
                    <Icon icon="bx:lock-open" className="me-2" style={{ fontSize: '1.5rem' }}/>
                    <span>Quản lý quyền và vai trò</span>
                  </Link>
                </li>
                <li className={`nav-item ${isActive('/products')}`}>
                  <Link to="/products" className="nav-link d-flex align-items-center">
                    <Icon icon="bx:cart-alt" className="me-2" style={{ fontSize: '1.5rem' }}/>
                    <span>Sản Phẩm</span>
                  </Link>
                </li>
              </ul>

              <ul className="navbar-nav flex-row align-items-center ms-md-auto">
                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                    <Link to="/test" className="nav-link dropdown-toggle hide-arrow p-0" data-bs-toggle="dropdown" aria-expanded="false">
                        <div className="avatar avatar-online">
                        <Icon icon="bx:user-circle" className="w-px-40 h-auto" />
                        </div>
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link to="/profile" className="dropdown-item">
                        <Icon icon="bx:user" className="icon-base bx icon-md me-3"></Icon><span>My Profile</span>
                      </Link>
                    </li>
                    <li>
                      <div className="dropdown-divider my-1"></div>
                    </li>
                    <li>
                      <Link to="/logout" className="dropdown-item">
                        <Icon icon="bx:power-off" className="icon-base bx icon-md me-3"></Icon><span>Log Out</span>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>

          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <Outlet></Outlet>
            </div>
            <div className="content-backdrop fade"></div>
          </div>
        </div>
      </div>
      <div className="layout-overlay layout-menu-toggle" onClick={toggleMenu}></div>
    </div>
  );
};

export default Layout;