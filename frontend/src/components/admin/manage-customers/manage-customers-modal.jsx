import Modal from '~/components/admin/ui/modal';

export const DeleteCustomerModal = ({
    selectedCustomer,
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    deleteError,
    handleDelete
}) => {
    return (
        <>
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xoá khách hàng"
                showCloseButton={true}
                backdrop={true}
                keyboard={true}
                footer={
                    <div>
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(selectedCustomer?.id)}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Đang xoá...
                                </>
                            ) : (
                                'Xác nhận xoá'
                            )}
                        </button>
                    </div>
                }
            >
                <div className="p-4">
                    <p>Bạn có chắc chắn muốn xoá khách hàng này không?</p>
                    <p>Hành động này sẽ không thể hoàn tác.</p>
                    {deleteError && (
                        <div className="alert alert-danger mt-3">
                            {deleteError}
                        </div>
                    )}
                </div>
            </Modal>
        </>
    )
}

export const LockCustomerModal = ({ selectedCustomer, showLockModal, setShowLockModal, isLocking, lockError, handleLock }) => {
    return (
        <>
            <Modal
                isOpen={showLockModal}
                onClose={() => setShowLockModal(false)}
                title='Mở khoá thành viên'
                showCloseButton={true}
                backdrop={true}
                keyboard={true}
                footer={
                    <div>
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => setShowLockModal(false)}
                            disabled={isLocking}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleLock(selectedCustomer?.id)}
                            disabled={isLocking}
                        >
                            {isLocking ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Đang mở Khoá...
                                </>
                            ) : (
                                <>Xác nhận mở khoá</>
                            )}
                        </button>
                    </div>
                }
            >
                <div className="p-4">
                    <p>Bạn có chắc chắn muốn mở khoá thành viên này không?</p>
                    <p>Hành động này sẽ không thể hoàn tác.</p>
                    {lockError && (
                        <div className="alert alert-danger mt-3">
                            {lockError}
                        </div>
                    )}
                </div>
            </Modal>
        </>
    )
}