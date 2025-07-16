import Modal from '~/components/ui/modal';

export const DeleteRoleModal = ({ showDeleteModal, setShowDeleteModal, isDeleting, errorDelete, handleDelete }) => {
    return (
        <Modal
            isOpen={showDeleteModal}
            onClose={() => (false)}
            title="Xoá Vai Trò"
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
                        onClick={() => handleDelete()}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Đang Xoá Vai Trò
                            </>
                        ) : (
                            "Xoá Vai Trò"
                        )}
                    </button>
                </div>
            }
        >
            <div className="p-4">
                <p>Bạn có chắc chắn muốn xoá vai trò này không?</p>
                <p>Hành động này sẽ không thể hoàn tác.</p>
                <p className='text-danger'>Bạn chỉ được phép xoá khi không có người dùng nào sử dụng vai trò này!!!</p>
                {errorDelete && (
                    <div className="alert alert-danger mt-3" style={{ whiteSpace: 'pre-wrap' }}>
                        {errorDelete}
                    </div>
                )}
            </div>
        </Modal>
    )
}