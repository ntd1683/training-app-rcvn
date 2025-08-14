import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const listNavbar = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Cửa Hàng', path: '/shop' },
    { name: 'Giỏ Hàng', path: '/gio-hang' },
    { name: 'Quản Lý Đơn Hàng', path: '/don-hang' },
]

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const location = useLocation();
    const isActive = (path) => location.pathname === path ? "active" : "";
    return (
        <nav className="navbar navbar-expand-lg">
            <button
                className={`navbar-toggler mobile-menu-btn ${isMenuOpen ? 'active' : 'collapsed'}`}
                type="button"
                onClick={toggleMenu}
                aria-controls="navbarSupportedContent"
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation"
            >
                <span className="toggler-icon"></span>
                <span className="toggler-icon"></span>
                <span className="toggler-icon"></span>
            </button>
            <div
                className={`navbar-collapse sub-menu-bar ${isMenuOpen ? 'show' : 'collapse'}`}
                id="navbarSupportedContent"
            >
                <ul id="nav" className="navbar-nav ms-auto">
                    {listNavbar.map((item, index) => (
                        <li className="nav-item" key={index}>
                            <Link
                                className={isActive(item.path)}
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Toggle navigation"
                                to={item.path}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;