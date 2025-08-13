import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../ui/breadcrumbs';
import Progress from './progress';
import Header from './header';
import Timeline from './timeline';
import RecipientInfo from './recipient-info';
import ProductsInfo from './products-info';
import Summary from './summary';

const OrderDetailPage = () => {
    // Fake data
    const orderData = {
        id: '2507253GUR1H8U',
        orderCode: '88b39791-452b-43f8-8da1-a1cbd9e7abbc',
        totalAmount: 10000,
        status: 3,
        postCode: 1244523454,
        recipient: {
            name: 'Nguyễn Tấn Dũng',
            phone: '(+84) 329817809',
            address: '204/12, Quốc Lộ 13, Phường 26',
            ward: 'Quận Bình Thạnh',
            province: 'Thành Phố Hồ Chí Minh',
            postCode: 12456,
            note: 'Ghi chú cho người nhận'
        },
        timeline: [
            { time: '15:36 25-07-2025', type: 'pending', note: 'Lên Đơn'},
            { time: '13:57 26-07-2025', type: 'processing', note: 'Đang xử lý đơn' },
            { time: '11:44 27-07-2025', type: 'paid', note: 'Thanh Toán' },
            { time: '00:23 28-07-2025', type: 'completed', note: 'Hoàn Thành Đơn'},
            { time: '00:23 28-07-2025', type: 'failed', note: 'Thanh toán thất bại'},
        ],
        products: [
            {
                id: 1,
                name: 'Túi Đựng Rác Tiện Dụng Size Nhỏ, Trung, Đại, Cực Đại, Loại Dài Dủ Kg, - Chắc Chắn, Tiện Lợi Cho Mọi Không Gian',
                category: 'Trung',
                order_quantity: 1,
                order_price: 36000,
                image: '/api/placeholder/80/80'
            },
            {
                id: 2,
                name: 'Túi Đựng Rác Tiện Dụng Size Nhỏ, Trung, Đại, Cực Đại, Loại Dài Dủ Kg, - Chắc Chắn, Tiện Lợi Cho Mọi Không Gian',
                category: 'Đại',
                order_quantity: 1,
                order_price: 36000,
                image: '/api/placeholder/80/80'
            }
        ],
        fee: 0,
        payment_type: 'paypal'
    };

    return (
        <>
            <Breadcrumbs
                title="<i class='lni lni-package me-2'></i> Chi tiết Đơn hàng"
                items={[
                    { icon: 'lni lni-home', label: "Trang chủ", link: "/" },
                    { label: "Đơn hàng", link: "/quan-ly-don-hang" },
                    { label: "Chi tiết Đơn hàng", link: "/quan-ly-don-hang" }
                ]}
            />
            <div className="container-fluid order-detail bg-light min-vh-100 py-3">
                <div className="container">
                    <Header orderData={orderData} />

                    {/* Order Progress */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="row">
                                        <Progress status={orderData.status} />
                                    </div>

                                    <div className="mt-4 p-3 bg-light rounded row d-flex justify-content-end">
                                        { orderData.status === 3 && (
                                            <button className="btn btn-danger me-3 col-md-3 mb-3 mb-md-0">Thanh Toán Lại</button>
                                        )}
                                        <Link
                                            to="tel:+1234567890"
                                            className='btn btn-outline-primary col-md-3'
                                        >Liên Hệ Người Bán</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h5 className="mb-4">Địa Chỉ Nhận Hàng</h5>
                                    <RecipientInfo recipient={orderData.recipient} postCode={orderData.postCode} />
                                    <Timeline timeline={orderData.timeline} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <ProductsInfo products={orderData.products} />
                    <Summary orderData={orderData} />
                </div>
            </div>
        </>
    );
};

export default OrderDetailPage;