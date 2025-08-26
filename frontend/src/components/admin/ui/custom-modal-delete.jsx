import React from 'react';
import Modal from '~/components/admin/ui/modal';
import { capitalizeEachWord } from '~/utils/common';

const CustomModalDelete = ({title, showDeleteModal, setShowDeleteModal, isDeleting, errorDelete, handleDelete, children }) => {
    const titleLower = title.toLowerCase();
    const titleCapitalized = capitalizeEachWord(title);
    return (
        <Modal
            isOpen={showDeleteModal}
            onClose={() => (false)}
            title={`Xoá ${titleCapitalized}`}
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
                                Đang Xoá {titleCapitalized}
                            </>
                        ) : (
                            "Xoá " + titleCapitalized
                        )}
                    </button>
                </div>
            }
        >
            <div className="p-4">
                <p>{`Bạn có chắc chắn muốn xoá ${titleLower} này không?`}</p>
                <p>Hành động này sẽ không thể hoàn tác.</p>
                { children }
                {errorDelete && (
                    <div className="alert alert-danger mt-3" style={{ whiteSpace: 'pre-wrap' }}>
                        {errorDelete}
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default CustomModalDelete;