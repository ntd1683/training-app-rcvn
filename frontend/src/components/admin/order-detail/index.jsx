import React from 'react';
import { Link } from 'react-router-dom';
import Progress from '~/components/user/order-detail/progress';
import Header from '~/components/user/order-detail/header';
import ProductsInfo from '~/components/user/order-detail/products-info';
import Summary from '~/components/user/order-detail/summary';
import Timeline from '~/components/user/order-detail/timeline';
import RecipientInfo from '~/components/user/order-detail/recipient-info';
import EditModal from './edit-modal';
import { useAdminOrderDetail } from '~/hooks/user/use-admin-order-detail';

const OrderDetail = () => {
    const {
        currentOrder,
        isLoading,
        handleEditOrder,
        error,
        errorUpdate,
        showModal,
        setShowModal,
        formEdit,
        setFormEdit,
        dataProvinces,
        dataWards,
    } = useAdminOrderDetail();

    return (
        <>
            <div className="card" style={{ margin: '0.5rem' }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Đơn hàng chi tiết</h5>
                </div>
                <div className="card-body">
                    <Header orderData={currentOrder} isAdmin={true} />

                    {/* Order Progress */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="row">
                                        <Progress status={currentOrder.status} />
                                    </div>
                                    <div className="mt-4 p-3 rounded row d-flex justify-content-end">
                                        <button
                                            className="btn btn-primary me-md-3 col-md-3 mb-3 mb-md-0"
                                            onClick={() => setShowModal(true)}
                                        >Chỉnh sửa thông tin đơn hàng</button>
                                        <Link
                                            to={`tel:${currentOrder.recipient.phone}`}
                                            className='btn btn-outline-primary col-md-3'
                                        >Liên Hệ Khách Hàng</Link>
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
                                    <RecipientInfo recipient={currentOrder.recipient} />
                                    <Timeline timeline={currentOrder.order_timeline} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h5 className="mb-4">Ghi Chú Đơn Hàng</h5>
                                    <p>{currentOrder?.recipient?.note}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ProductsInfo products={currentOrder.products} />
                    <Summary orderData={currentOrder} className="card p-3" />
                </div>
            </div>
            <EditModal
                orderCode={currentOrder.order_code}
                showEditModal={showModal}
                setShowEditModal={setShowModal}
                isEditing={isLoading}
                handleEdit={handleEditOrder}
                error={error}
                errorUpdate={errorUpdate}
                formEdit={formEdit}
                setFormEdit={setFormEdit}
                dataProvinces={dataProvinces}
                dataWards={dataWards}
            />
        </>
    );
}

export default OrderDetail;