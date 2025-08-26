import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import { listNav } from "~/data/listNav";

export const Menu = ({ navItems = listNav, userInfo = [], isCollapsed = false }) => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState(new Set());
    const userPermissions = userInfo?.permissions || [];

    const hasPermission = (permission) => {
        if (!permission || userPermissions.length === 0) return true;
        return userPermissions.includes(permission);
    };

    const filterChildren = (children) => {
        if (!children) return null;
        const filteredChildren = children.filter(child => hasPermission(child.permission));
        return filteredChildren.length > 0 ? filteredChildren : null;
    };

    let filteredNavItems = [];

    if (userInfo.group_role === 'SuperAdmin' || userInfo.group_role === 'Admin') {
        filteredNavItems = navItems;
    } else {
        filteredNavItems = navItems.filter(item => {
            const hasParentPermission = hasPermission(item.permission);
            if (item.children) {
                const filteredChildren = filterChildren(item.children);
                return hasParentPermission && filteredChildren && filteredChildren.length > 0;
            }
            return hasParentPermission;
        }).map(item => {
            if (item.children) {
                return {
                    ...item,
                    children: filterChildren(item.children)
                };
            }
            return item;
        });
    }

    const isActive = (item) => {
        if (location.pathname === item.path) return true;
        if (item.children) {
            return item.children.some(child => location.pathname === child.path);
        }
        return false;
    };

    const shouldBeOpen = (item) => {
        if (!item.children) return false;
        return item.children.some(child => location.pathname === child.path);
    };

    useEffect(() => {
        const initialOpenMenus = new Set();
        
        // In collapsed mode, don't auto-open any menus
        if (!isCollapsed) {
            filteredNavItems.forEach((item, index) => {
                if (shouldBeOpen(item)) {
                    initialOpenMenus.add(index);
                }
            });
        }
        
        setOpenMenus(initialOpenMenus);
        // eslint-disable-next-line
    }, [location.pathname, isCollapsed]);

    const toggleMenu = (index) => {
        // In collapsed mode, don't allow toggle
        if (isCollapsed) return;
        
        const newOpenMenus = new Set(openMenus);
        if (newOpenMenus.has(index)) {
            newOpenMenus.delete(index);
        } else {
            newOpenMenus.add(index);
        }
        setOpenMenus(newOpenMenus);
    };

    return (
        <ul className="menu-inner py-1 list-unstyled">
            {filteredNavItems.map((item, index) => (
                <li
                    key={item.permission || index}
                    className={`menu-item ${isActive(item) ? 'active' : ''} ${openMenus.has(index) ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
                    data-tooltip={isCollapsed ? item.label : ''}
                >
                    {item.children ? (
                        <>
                            <a
                                href="#"
                                className="menu-link menu-toggle d-flex align-items-center text-decoration-none p-3"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleMenu(index);
                                }}
                            >
                                <Icon 
                                    className="menu-icon me-3" 
                                    icon={item.icon} 
                                    style={{ fontSize: '20px', minWidth: '20px' }} 
                                />
                                <div className={`flex-grow-1 menu-text ${isCollapsed ? 'collapsed' : ''}`}>
                                    {item.label}
                                </div>
                                {item.badge && !isCollapsed && (
                                    <div className={`badge text-bg-${item.badge.variant} rounded-pill me-2`}>
                                        {item.badge.text}
                                    </div>
                                )}
                            </a>

                            {/* Submenu - hidden in collapsed mode */}
                            <div className={`collapse menu-sub ${openMenus.has(index) && !isCollapsed ? 'show' : ''}`}>
                                <ul className="list-unstyled ms-4">
                                    {item.children.map((child, childIndex) => (
                                        <li key={childIndex} className={`menu-item ${location.pathname === child.path ? 'active' : ''}`}>
                                            <Link
                                                to={child.path}
                                                className="menu-link d-flex align-items-center text-decoration-none py-2 px-3"
                                            >
                                                <div className="menu-bullet me-2" style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    backgroundColor: location.pathname === child.path ? '#696cff' : '#a7acb2',
                                                    borderRadius: '50%',
                                                    transition: 'background-color 0.2s ease'
                                                }}></div>
                                                <div>{child.label}</div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <Link
                            to={item.path}
                            className="menu-link d-flex align-items-center text-decoration-none p-3"
                        >
                            <Icon 
                                className="menu-icon me-3" 
                                icon={item.icon} 
                                style={{ fontSize: '20px', minWidth: '20px' }} 
                            />
                            <div className={`flex-grow-1 menu-text ${isCollapsed ? 'collapsed' : ''}`}>
                                {item.label}
                            </div>
                            {item.badge && !isCollapsed && (
                                <div className={`badge text-bg-${item.badge.variant} rounded-pill ms-auto`}>
                                    {item.badge.text}
                                </div>
                            )}
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default Menu;