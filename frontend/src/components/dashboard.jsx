import React from 'react';
import { useDashboard as useDashboardAnalytics } from '../hooks/use-dashboard';
import { Icon } from '@iconify/react';

const Dashboard = () => {
    const {
        totalUsers,
        totalProducts,
        userName
    } = useDashboardAnalytics();
    return (
        <div className="card px-6 py-5">
            <div className="col-12 col-lg-8 card-separator">
                <h5 className="mb-2">Chào mừng trở lại,<span className="h4"> {userName} 👋🏻</span></h5>
                <div className="col-12 col-lg-5">
                    <p>Tuần này bạn đã có nhiều tiến bộ. Hãy tiếp tục cố gắng để đạt thêm nhiều thành tích nhé!</p>
                </div>
                <div className="d-flex justify-content-between flex-wrap gap-4 me-12">
                    <div className="d-flex align-items-center gap-4 me-6 me-sm-0">
                        <div className="avatar avatar-lg">
                            <div className="avatar-initial bg-label-primary rounded">
                                <div className="text-primary">
                                    <Icon icon="bx:user-check" className="icon-base bx"/>
                                </div>
                            </div>
                        </div>
                        <div className="content-right">
                            <p className="mb-0 fw-medium">Tổng số thành viên</p>
                            <h4 className="text-primary mb-0">{totalUsers}</h4>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <div className="avatar avatar-lg">
                            <div className="avatar-initial bg-label-info rounded">
                                <div className="text-info">
                                    <Icon icon="bx:package" className="icon-base bx"/>
                                </div>
                            </div>
                        </div>
                        <div className="content-right">
                            <p className="mb-0 fw-medium">Tổng số sản phẩm</p>
                            <h4 className="text-info mb-0">{totalProducts}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;