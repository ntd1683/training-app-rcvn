import React from "react";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useUserInfo } from '~/hooks/admin/use-auth.jsx';
import Notifications from "./notifications";
import ProfileDropdown from "./profile-dropdown";
import Menu from "./menu";

const Layout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);
  const [isHovering, setIsHovering] = useState(false);

  const user = useUserInfo().user;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1200;
      setIsDesktop(desktop);

      // Close mobile menu when switching to desktop
      if (desktop) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle desktop menu collapse
  const toggleDesktopMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking overlay
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle touch gestures for mobile menu
  useEffect(() => {
    if (!isDesktop) {
      let startX = 0;
      let currentX = 0;
      let isDragging = false;

      const handleTouchStart = (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      };

      const handleTouchMove = (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;

        // Only trigger if swipe starts from left edge
        if (startX < 50 && currentX - startX > 100) {
          setIsMobileMenuOpen(true);
          isDragging = false;
        }
      };

      const handleTouchEnd = () => {
        isDragging = false;
      };

      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDesktop]);

  // Determine menu classes
  const getMenuClasses = () => {
    let classes = "layout-menu menu-vertical menu";

    if (isDesktop) {
      if (isMenuCollapsed) {
        classes += " menu-collapsed";
        if (isHovering) {
          classes += " menu-hover-expanded";
        }
      }
    } else {
      classes += " menu-mobile";
      if (isMobileMenuOpen) {
        classes += " menu-mobile-open";
      }
    }

    return classes;
  };

  // Get layout container classes
  const getLayoutContainerClasses = () => {
    let classes = "layout-container";

    if (isDesktop && isMenuCollapsed) {
      classes += " menu-collapsed";
      if (isHovering) {
        classes += " layout-menu-hover-expanded";
      }
    }

    if (!isDesktop && isMobileMenuOpen) {
      classes += " mobile-menu-open";
    }

    return classes;
  };

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className={getLayoutContainerClasses()}>
        <aside
          id="layout-menu"
          className={getMenuClasses()}
          onMouseEnter={() => isDesktop && isMenuCollapsed && setIsHovering(true)}
          onMouseLeave={() => isDesktop && isMenuCollapsed && setIsHovering(false)}
        >
          <div className="app-brand demo">
            <Link to="/admin" className="app-brand-link">
              <img src="/logo192.png" alt="logo" className="img-fluid" width="25" height="38" />
              <p className="mb-0 ms-3 fw-bold fs-3 brand-text">Website</p>
            </Link>

            {isDesktop && (
              <button
                className="layout-menu-toggle menu-link text-large ms-auto btn btn-link p-0"
                onClick={toggleDesktopMenu}
                aria-label="Toggle menu"
              >
                <Icon
                  icon={isMenuCollapsed ? "bx:bx-chevron-right" : "bx:bx-chevron-left"}
                  className="toggle-icon"
                />
              </button>
            )}
          </div>
          <div className="menu-inner-shadow"></div>
          <Menu userInfo={user} isCollapsed={isDesktop && isMenuCollapsed && !isHovering} />
        </aside>

        <div className="layout-page">
          <nav
            className={`layout-navbar container-fluid navbar-detached navbar navbar-expand-xl align-items-center
            bg-navbar-theme ${isScrolled ? 'navbar-scrolled' : ''}`}
            id="layout-navbar">

            {!isDesktop && (
              <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
                <button
                  className="nav-item nav-link px-0 me-xl-6 btn btn-link"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle mobile menu"
                >
                  <Icon icon="bx:bx-menu" className="icon-base icon-md"></Icon>
                </button>
              </div>
            )}

            <div className="navbar-nav-right d-flex align-items-center justify-content-end" id="navbar-collapse">
              <div className="navbar-nav align-items-center">
                <div className="nav-item navbar-search-wrapper mb-0">
                  <a className="nav-item nav-link search-toggler px-0" href="javascript:void(0);">
                    <span className="d-inline-block text-body-secondary fw-normal" id="autocomplete"></span>
                  </a>
                </div>
              </div>
              <ul className="navbar-nav flex-row align-items-center ms-md-auto">
                <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-2">
                  <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown"
                    data-bs-auto-close="outside" aria-expanded="false">
                    <span className="position-relative">
                      <Icon icon="bx:bx-bell" className="icon-base icon-md"></Icon>
                      <span className="badge rounded-pill bg-danger badge-dot badge-notifications border"></span>
                    </span>
                  </a>
                  <Notifications />
                </li>
                <ProfileDropdown user={user} />
              </ul>
            </div>
          </nav>

          <div className="content-wrapper">
            <div className="container-fluid flex-grow-1 container-p-y">
              {children}
            </div>
            <div className="content-backdrop fade"></div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`layout-overlay layout-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>
      <div className="drag-target"></div>
    </div>
  );
};

export default Layout;