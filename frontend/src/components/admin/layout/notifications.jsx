import React, {useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

export const Notifications = () => {
    const containerRef = useRef(null);
    const psRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            psRef.current = new PerfectScrollbar(containerRef.current);
        }
        return () => {
            if (psRef.current) {
                psRef.current.destroy();
                psRef.current = null;
            }
        };
    }, []);

    return (
        <ul className="dropdown-menu dropdown-menu-end p-0">
            <li className="dropdown-menu-header border-bottom">
                <div className="dropdown-header d-flex align-items-center py-3">
                    <h6 className="mb-0 me-auto">Notification</h6>
                    <div className="d-flex align-items-center h6 mb-0">
                        <span className="badge bg-label-primary me-2">8 New</span>
                        <a href="javascript:void(0)" className="dropdown-notifications-all p-2" data-bs-toggle="tooltip"
                            data-bs-placement="top" title="Mark all as read">
                            <Icon icon="bx:bx-envelope-open" className="icon-base" />
                        </a>
                    </div>
                </div>
            </li>
            <li className="dropdown-notifications-list scrollable-container" ref={containerRef}>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item list-group-item-action dropdown-notifications-item">
                        <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar">
                                    <img src="../../assets/img/avatars/1.png" alt="" className="rounded-circle" />
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="small mb-0">Congratulation Lettie 🎉</h6>
                                <small className="mb-1 d-block text-body">Won the monthly best seller gold badge</small>
                                <small className="text-body-secondary">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span
                                    className="badge badge-dot"></span></a>
                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span
                                    className="icon-base bx bx-x"></span></a>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar">
                                    <img src="../../assets/img/avatars/2.png" alt="" className="rounded-circle" />
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="small mb-0">New Message ✉️</h6>
                                <small className="mb-1 d-block text-body">You have new message from Natalie</small>
                                <small className="text-body-secondary">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span
                                    className="badge badge-dot"></span></a>
                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span
                                    className="icon-base bx bx-x"></span></a>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar">
                                    <img src="../../assets/img/avatars/2.png" alt="" className="rounded-circle" />
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="small mb-0">New Message ✉️</h6>
                                <small className="mb-1 d-block text-body">You have new message from Natalie</small>
                                <small className="text-body-secondary">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span
                                    className="badge badge-dot"></span></a>
                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span
                                    className="icon-base bx bx-x"></span></a>
                            </div>
                        </div>
                    </li><li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar">
                                    <img src="../../assets/img/avatars/2.png" alt="" className="rounded-circle" />
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="small mb-0">New Message ✉️</h6>
                                <small className="mb-1 d-block text-body">You have new message from Natalie</small>
                                <small className="text-body-secondary">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span
                                    className="badge badge-dot"></span></a>
                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span
                                    className="icon-base bx bx-x"></span></a>
                            </div>
                        </div>
                    </li><li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar">
                                    <img src="../../assets/img/avatars/2.png" alt="" className="rounded-circle" />
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="small mb-0">New Message ✉️</h6>
                                <small className="mb-1 d-block text-body">You have new message from Natalie</small>
                                <small className="text-body-secondary">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span
                                    className="badge badge-dot"></span></a>
                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span
                                    className="icon-base bx bx-x"></span></a>
                            </div>
                        </div>
                    </li><li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar">
                                    <img src="../../assets/img/avatars/2.png" alt="" className="rounded-circle" />
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="small mb-0">New Message ✉️</h6>
                                <small className="mb-1 d-block text-body">You have new message from Natalie</small>
                                <small className="text-body-secondary">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span
                                    className="badge badge-dot"></span></a>
                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span
                                    className="icon-base bx bx-x"></span></a>
                            </div>
                        </div>
                    </li><li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar">
                                    <img src="../../assets/img/avatars/2.png" alt="" className="rounded-circle" />
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="small mb-0">New Message ✉️</h6>
                                <small className="mb-1 d-block text-body">You have new message from Natalie</small>
                                <small className="text-body-secondary">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span
                                    className="badge badge-dot"></span></a>
                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span
                                    className="icon-base bx bx-x"></span></a>
                            </div>
                        </div>
                    </li><li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar">
                                    <img src="../../assets/img/avatars/2.png" alt="" className="rounded-circle" />
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="small mb-0">New Message ✉️</h6>
                                <small className="mb-1 d-block text-body">You have new message from Natalie</small>
                                <small className="text-body-secondary">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span
                                    className="badge badge-dot"></span></a>
                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span
                                    className="icon-base bx bx-x"></span></a>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
            <li className="border-top">
                <div className="d-grid p-4">
                    <a className="btn btn-primary btn-sm d-flex" href="javascript:void(0);">
                        <small className="align-middle">Xem tất cả thông báo</small>
                    </a>
                </div>
            </li>
        </ul>
    );
}

export default Notifications;