import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./navbar";
import Footer from "./footer";
import { useUserInfo } from '~/hooks/user/use-auth';
import { CartLayout } from './cart-layout';
import { SearchDesktop } from '~/components/user/algolia/search-desktop';
import SearchMobile from '../algolia/search-mobile';

const Layout = React.memo(({ children }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { customer } = useUserInfo();
    const memoizedUser = useMemo(() => customer, [customer]);

    const toggleProfileDropdown = useCallback(() => {
        setIsProfileOpen(prev => !prev);
    }, []);

    const toggleMobileSearch = useCallback(() => {
        setIsMobileSearchOpen(prev => !prev);
    }, []);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.scrollY;
                    setIsScrolled(scrollTop > 100);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const profileDropdownContent = useMemo(() => {
        if (!isProfileOpen) return null;

        return (
            <div className="profile-dropdown" style={{ minWidth: '150px' }}>
                <div className="dropdown-arrow">^</div>
                <ul className="profile-list">
                    {memoizedUser ? (
                        <>
                            <li>
                                <span className="profile-item">{memoizedUser.name}</span>
                            </li>
                            <li>
                                <Link to="/trang-ca-nhan" onClick={() => setIsProfileOpen(false)} className="profile-item">
                                    Quản lý trang cá nhân
                                </Link>
                                <Link to="/don-hang" onClick={() => setIsProfileOpen(false)} className="profile-item">
                                    Quản lý Đơn Hàng
                                </Link>
                            </li>
                            <hr className="divider" />
                            <li>
                                <Link to="/dang-xuat" className="profile-item">
                                    Đăng Xuất
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/dang-nhap" className="profile-item">
                                Đăng Nhập
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        );
    }, [isProfileOpen, memoizedUser]);

    return (
        <>
            <header className={`user header navbar-area sticky-navbar ${isScrolled ? 'scrolled' : ''}`} style={{ zIndex: '110' }}>
                <div className="header-middle">
                    <div className="container">
                        <div className="row align-items-center mx-0 custom-width">
                            <div className="col-lg-2 col-md-2 col-sm-7 col-3">
                                <Link to="/" className="navbar-brand" style={{ width: 'fit-content' }}>
                                    <img src="/logo192.png" alt="Logo" style={{ width: 'auto', height: '45px' }} />
                                </Link>
                            </div>
                            <SearchDesktop />

                            <div className="col-lg-5 col-md-3 col-sm-5 col-9 pe-0">
                                <div className="middle-right-area">
                                    {/* Mobile Search Button */}
                                    <div className="mobile-search-btn d-md-none">
                                        <button
                                            className="main-btn"
                                            onClick={toggleMobileSearch}
                                            aria-label="Toggle search"
                                        >
                                            <i className="lni lni-search-alt"></i>
                                        </button>
                                    </div>

                                    {/* Hotline - ẩn trên mobile để tiết kiệm không gian */}
                                    <a className="nav-hotline d-none d-lg-block" href="tel:+1001234567890">
                                        <i className="lni lni-phone"></i>
                                        <h3>Hotline:
                                            <span>(+100) 123 456 7890</span>
                                        </h3>
                                    </a>

                                    <div className="navbar-cart">
                                        <div className="wishlist">
                                            <a href="#">
                                                <i className="lni lni-heart"></i>
                                                <span className="total-items">0</span>
                                            </a>
                                        </div>
                                        <CartLayout />
                                        {/* Profile */}
                                        <div className="profile">
                                            <button
                                                className="main-btn"
                                                onClick={toggleProfileDropdown}
                                                aria-expanded={isProfileOpen}
                                                aria-label="Profile menu"
                                            >
                                                <i className="lni lni-user"></i>
                                            </button>
                                            {profileDropdownContent}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isMobileSearchOpen && (
                    <SearchMobile toggleMobileSearch={toggleMobileSearch} />
                )}

                <div className="container social-links">
                    <div className="row align-items-center custom-width" style={{ padding: '10px 0' }}>
                        <div className="col-lg-8 col-md-6 col-12">
                            <div className="nav-inner">
                                <Navbar />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-12">
                            <div className="nav-social">
                                <h5 className="title ">Follow Us: </h5>
                                <ul className="m-0">
                                    <li>
                                        <a href="#"><i className="lni lni-facebook-filled"></i></a>
                                    </li>
                                    <li>
                                        <a href="#"><i className="lni lni-twitter-original"></i></a>
                                    </li>
                                    <li>
                                        <a href="#"><i className="lni lni-instagram"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer để tránh content bị che bởi sticky navbar */}
            <div className="navbar-spacer"></div>

            {/* content */}
            {children}

            <Footer className="footer" />
        </>
    )
});

export default Layout;