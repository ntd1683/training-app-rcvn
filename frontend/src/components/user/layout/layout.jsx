/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./navbar";
import Footer from "./footer";
import { useUserInfo } from '~/hooks/user/use-auth.jsx';

const Layout = React.memo(({ children }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user } = useUserInfo();
    const memoizedUser = useMemo(() => user, [user]);

    // Toggle profile dropdown
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
            <header className={`header navbar-area sticky-navbar ${isScrolled ? 'scrolled' : ''}`} style={{ zIndex: '100' }}>
                <div className="header-middle">
                    <div className="container">
                        <div className="row align-items-center mx-0 custom-width">
                            <div className="col-lg-2 col-md-2 col-sm-7 col-3">
                                <Link to="/" className="navbar-brand" style={{ width: 'fit-content' }}>
                                    <img src="/logo192.png" alt="Logo" style={{ width: 'auto', height: '45px' }} />
                                </Link>
                            </div>
                            {/* Desktop Search */}
                            <div className="col-lg-5 col-md-7 d-none d-md-block">
                                <div className="main-menu-search">
                                    <div className="navbar-search search-style-5">
                                        <div className="search-input">
                                            <input type="text" placeholder="Tìm Kiếm..." />
                                        </div>
                                        <div className="search-btn">
                                            <button><i className="lni lni-search-alt"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                    <div className="nav-hotline d-none d-lg-block">
                                        <i className="lni lni-phone"></i>
                                        <h3>Hotline:
                                            <span>(+100) 123 456 7890</span>
                                        </h3>
                                    </div>

                                    <div className="navbar-cart">
                                        <div className="wishlist">
                                            <a href="#">
                                                <i className="lni lni-heart"></i>
                                                <span className="total-items">0</span>
                                            </a>
                                        </div>
                                        <div className="cart-items">
                                            <a href="#" className="main-btn">
                                                <i className="lni lni-cart"></i>
                                                <span className="total-items">2</span>
                                            </a>
                                            <div className="shopping-item">
                                                <div className="dropdown-cart-header">
                                                    <span>2 Items</span>
                                                    <a href="cart.html">View Cart</a>
                                                </div>
                                                <ul className="shopping-list">
                                                    <li>
                                                        <a href="#" className="remove" title="Remove this item"><i
                                                            className="lni lni-close"></i></a>
                                                        <div className="cart-img-head">
                                                            <a className="cart-img" href="product-details.html">
                                                                <img src="assets/images/header/cart-items/item1.jpg" alt="#" />
                                                            </a>
                                                        </div>

                                                        <div className="content">
                                                            <h4><a href="product-details.html">
                                                                Apple Watch Series 6</a></h4>
                                                            <p className="quantity">1x - <span className="amount">$99.00</span></p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <a className="remove" title="Remove this item">
                                                            <i className="lni lni-close"></i>
                                                        </a>
                                                        <div className="cart-img-head">
                                                            <a className="cart-img" href="product-details.html">
                                                                <img src="assets/images/header/cart-items/item2.jpg" alt="#" />
                                                            </a>
                                                        </div>
                                                        <div className="content">
                                                            <h4><a href="product-details.html">Wi-Fi Smart Camera</a></h4>
                                                            <p className="quantity">1x - <span className="amount">$35.00</span></p>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <div className="bottom">
                                                    <div className="total">
                                                        <span>Total</span>
                                                        <span className="total-amount">$134.00</span>
                                                    </div>
                                                    <div className="button">
                                                        <a href="checkout.html" className="btn animate">Checkout</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

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
                    <div className="mobile-search-overlay d-md-none">
                        <div className="container">
                            <div className="mobile-search-content">
                                <div className="navbar-search search-style-5 d-flex">
                                    <div className="search-input">
                                        <input type="text" placeholder="Tìm kiếm..." autoFocus />
                                    </div>
                                    <div className="search-btn">
                                        <button className="main-btn"><i className="lni lni-search-alt"></i></button>
                                    </div>
                                    <button
                                        className="close-search"
                                        onClick={toggleMobileSearch}
                                        aria-label="Close search"
                                    >
                                        <i className="lni lni-close"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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