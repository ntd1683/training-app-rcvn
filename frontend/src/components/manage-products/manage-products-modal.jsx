import Modal from '~/components/ui/modal';

export const DeleteProductsModal = ({ selectedProduct, showDeleteModal, setShowDeleteModal, isDeleting, deleteError, handleDelete }) => {
    return (
        <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Xoá sản phẩm"
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
                        onClick={() => handleDelete(selectedProduct?.id)}
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
                <p>Bạn có chắc chắn muốn xoá sản phẩm này không?</p>
                <p>Hành động này sẽ không thể hoàn tác.</p>
                {deleteError && (
                    <div className="alert alert-danger mt-3">
                        {deleteError}
                    </div>
                )}
            </div>
        </Modal>
    )
}