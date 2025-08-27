import { Icon } from "@iconify/react";
import React from "react";

export const CardAnalytics = ({ analytics }) => {
    <div className="card mb-6">
        <div className="card-widget-separator-wrapper">
            <div className="card-body card-widget-separator">
                <div className="row gy-4 gy-sm-1">
                    <div className="col-sm-6 col-lg-3">
                        <div className="d-flex justify-content-between align-items-center card-widget-1 border-end pb-4 pb-sm-0">
                            <div>
                                <h4 className="mb-0">{analytics?.total_pending || 0}</h4>
                                <p className="mb-0">Đang Chờ</p>
                            </div>
                            <span className="avatar p-2 me-2">
                                <span className="avatar-initial bg-white">
                                    <Icon
                                        icon="mdi:file-document-outline"
                                        className='icon-base icon-lg text-heading'
                                    />
                                </span>
                            </span>
                        </div>
                        <hr className="d-none d-sm-block d-lg-none me-6" />
                    </div>
                    <div className="col-sm-6 col-lg-3">
                        <div className="d-flex justify-content-between align-items-center card-widget-2 border-end pb-4 pb-sm-0">
                            <div>
                                <h4 className="mb-0">{analytics?.total_processing || 0}</h4>
                                <p className="mb-0">Đang Xử Lý</p>
                            </div>
                            <span className="avatar p-2 me-2">
                                <span className="avatar-initial bg-white">
                                    <Icon
                                        icon="mdi:truck-delivery"
                                        className='icon-base icon-lg text-heading'
                                    />
                                </span>
                            </span>
                        </div>
                        <hr className="d-none d-sm-block d-lg-none" />
                    </div>
                    <div className="col-sm-6 col-lg-3">
                        <div className="d-flex justify-content-between align-items-center border-end pb-4 pb-sm-0 card-widget-3">
                            <div>
                                <h4 className="mb-0">{analytics?.total_completed || 0}</h4>
                                <p className="mb-0">Đã Hoàn Thành</p>
                            </div>
                            <span className="avatar p-2 me-2">
                                <span className="avatar-initial bg-white">
                                    <Icon
                                        icon="mdi:check-circle"
                                        className='icon-base icon-lg text-heading'
                                    />
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-3">
                        <div className="d-flex justify-content-between align-items-center border-end">
                            <div>
                                <h4 className="mb-0">{analytics?.total_failed || 0}</h4>
                                <p className="mb-0">Đã Thất Bại</p>
                            </div>
                            <span className="avatar p-2 me-2">
                                <span className="avatar-initial bg-white">
                                    <Icon
                                        icon="iconoir:web-window-close"
                                        className='icon-base icon-lg text-heading'
                                    />
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default CardAnalytics;