import { useState } from "react";
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Icon } from "@iconify/react/dist/iconify.js";
import "~/assets/css/layout.css";
import { checkRoleAndPermission } from '~/utils/common.jsx';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => location.pathname === path ? "active" : "";
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <aside id="layout-menu" className={`layout-menu menu-vertical menu bg-menu-theme d-sm-none ${isMenuOpen ? "menu-open" : ""}`}>
          <div className="app-brand demo">
            <a href="index.html" className="app-brand-link">
              <img src="/logo192.png" alt="logo" className="img-fluid" />
            </a>
            <button className="layout-menu-toggle menu-link text-large ms-auto" onClick={toggleMenu}>
              <Icon icon="bx:bx-chevron-left-circle" className="d-block align-middle" />
            </button>
          </div>
          <div className="menu-divider mt-0"></div>
          <div className="menu-inner-shadow"></div>
          <ul className="menu-inner py-1">
            {listNav.map((navItem) => (
              checkRoleAndPermission(navItem.permission) && (
                <li key={navItem.path} className={`menu-item ${isActive(navItem.path)}`}>
                  <Link to={navItem.path} className="menu-link">
                    <Icon icon={navItem.icon} className="menu-icon bx" />
                    <div className="text-truncate">
                      {navItem.label}
                    </div>
                  </Link>
                </li>
              )
            ))}
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
              <ul className="navbar-nav d-none d-sm-flex flex-sm-row justify-content-evenly w-100">
                {listNav.map((navItem) => (
                  checkRoleAndPermission(navItem.permission) && (
                    <li key={navItem.path} className={`nav-item ${isActive(navItem.path)}`}>
                      <Link to={navItem.path} className="nav-link d-flex align-items-center">
                        <Icon icon={navItem.icon} className="me-2" style={{ fontSize: '1.5rem' }} />
                        <span>{navItem.label}</span>
                      </Link>
                    </li>
                  )
                ))}
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
                      <Link to="" className="dropdown-item">
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <h6 className="mb-0">{user.name}</h6>
                            <small className="text-body-secondary">{user.group_role}</small>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <div className="dropdown-divider my-1"></div>
                    </li>
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

const listNav = [
  {
    permission: 'users.index',
    path: '/users',
    icon: 'bx:user-voice',
    label: 'Users'
  },
  {
    permission: 'roles.index',
    path: '/roles',
    icon: 'bx:lock-open',
    label: 'Quản lý Vai Trò'
  },
  {
    permission: 'permissions.index',
    path: '/permissions',
    icon: 'bx:book-reader',
    label: 'Quản lý Quyền'
  },
  {
    permission: 'products.index',
    path: '/products',
    icon: 'bx:cart-alt',
    label: 'Sản Phẩm'
  }
];

export default Layout;