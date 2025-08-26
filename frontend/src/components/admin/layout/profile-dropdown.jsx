import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";

export const ProfileDropdown = ({ user }) => {
    return (
        <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a className="nav-link dropdown-toggle hide-arrow p-0" href="javascript:void(0);" data-bs-toggle="dropdown">
                <div className="avatar avatar-online">
                    <Icon icon="bx:user-circle" className="icon-base icon-md" />
                </div>
            </a>
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
    );
}

export default ProfileDropdown;