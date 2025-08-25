import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { Icon } from "@iconify/react/dist/iconify.js";
import { checkRoleAndPermission } from '~/utils/common.jsx';
import { useUserInfo } from '~/hooks/admin/use-auth.jsx';

const Layout = ({children}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active" : "";
  const user = useUserInfo().user;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(true);
      if (currentScrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const layoutClasses = [
    'layout-wrapper',
    'layout-content-navbar',
    isMenuOpen ? 'layout-menu-expanded' : '',
    'layout-menu-100vh'
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses}>
      <div className="layout-container">
        <aside 
          id="layout-menu" 
          className={`layout-menu menu-vertical menu bg-menu-theme d-sm-none position-relative ${isMenuOpen ? 'menu-open' : ''}`}
          style={{
            top: 0,
            height: '100vh',
          }}
        >
          <div className="app-brand demo">
            <Link to="/admin" className="app-brand-link">
              <img src="/logo192.png" alt="logo" className="img-fluid" />
              <p className="mb-0 ms-3 fw-bold fs-3">Website</p>
            </Link>
            <button className="layout-menu-toggle menu-link text-large ms-auto position-absolute end-0" onClick={() => setIsMenuOpen(false)}>
              <Icon icon="bx:bx-chevron-left-circle" className="d-block align-middle rounded-circle bg-white" />
            </button>
          </div>
          <div className="menu-divider mt-0"></div>
          <div className="menu-inner-shadow"></div>
          <ul className="menu-inner py-1">
            {listNav.map((navItem) => (
              checkRoleAndPermission(navItem.permission, user) && (
                <li key={navItem.path} className={`menu-item ${isActive(navItem.path)}`}>
                  <Link to={navItem.path} className="menu-link" onClick={() => setIsMenuOpen(false)}>
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
            className={`layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme ${isScrolled ? 'navbar-scrolled' : ''}`}
            id="layout-navbar"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1040,
              transition: 'all 0.1s ease-in-out',
              backdropFilter: isScrolled ? 'blur(10px)' : 'none',
              backgroundColor: isScrolled ? 'rgba(255,255,255,0.95)' : 'var(--bs-navbar-bg, #fff)'
            }}
          >
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-sm-none">
              <button className="nav-item nav-link px-0 me-xl-6" onClick={() => setIsMenuOpen(true)}>
                <Icon icon="bx:menu" className="icon-base bx icon-md" />
              </button>
            </div>
            <div className="navbar-nav-right d-flex align-items-center justify-content-end" id="navbar-collapse">
              <ul className="navbar-nav d-none d-sm-flex flex-sm-row justify-content-evenly w-100">
                {listNav.map((navItem) => (
                  checkRoleAndPermission(navItem.permission, user) && (
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
                  <Link to="/admin/test" className="nav-link dropdown-toggle hide-arrow p-0" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="avatar avatar-online">
                      <Icon icon="bx:user-circle" className="w-px-40 h-auto" />
                    </div>
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link to="#" className="dropdown-item">
                        <div className="d-flex text-center w-100">
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
                      <Link to="/admin/logout" className="dropdown-item d-flex justify-content-center">
                        <Icon icon="bx:power-off" className="icon-base bx icon-md me-3"></Icon><span>Log Out</span>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>

          <div className="content-wrapper" style={{ marginTop: '70px' }}>
            <div className="container-xxl flex-grow-1 container-p-y">
              {children}
            </div>
            <div className="content-backdrop fade"></div>
          </div>
        </div>
      </div>
      <div className={`layout-overlay ${isMenuOpen ? "visible-unset" : ""}`} onClick={() => setIsMenuOpen(false)}></div>
    </div>
  );
};

const listNav = [
  {
    permission: 'users.index',
    path: '/admin/users',
    icon: 'bx:user-voice',
    label: 'Users'
  },
  {
    permission: 'customers.index',
    path: '/admin/customers',
    icon: 'bx:user',
    label: 'Customers'
  },
  {
    permission: 'roles.index',
    path: '/admin/roles',
    icon: 'bx:lock-open',
    label: 'Quản lý Vai Trò'
  },
  {
    permission: 'permissions.index',
    path: '/admin/permissions',
    icon: 'bx:book-reader',
    label: 'Quản lý Quyền'
  },
  {
    permission: 'products.index',
    path: '/admin/products',
    icon: 'bx:cart-alt',
    label: 'Sản Phẩm'
  }
];

export default Layout;