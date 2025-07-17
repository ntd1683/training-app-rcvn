import { Link } from 'react-router-dom';
import { checkRoleAndPermission } from '~/utils/common';

const CustomShowGroupButtonCreateOrEdit = ({ isEdit, isLoading, handleSubmit, title, titleModel, page, setShowModal }) => {
    const canEdit = isEdit && checkRoleAndPermission(page + '.update');
    const canDelete = isEdit && checkRoleAndPermission(page + '.delete');
    return (
        <div className="ms-0 mb-6 w-100 d-flex row justify-content-center">
            <Link to={`/${page}`} className="btn btn-secondary mb-2 mb-sm-0 me-0 me-sm-3 col-12 col-sm-3">Quay Lại</Link>
            {!isEdit ? (
                <button
                    type="submit"
                    className="btn btn-primary mb-2 mb-sm-0 col-12 col-sm-3 me-0 me-sm-3"
                    disabled={isLoading}
                    onClick={handleSubmit}
                >{title} {titleModel}</button>
            ) : canEdit && (
                <button
                    type="submit"
                    className="btn btn-primary mb-2 mb-sm-0 col-12 col-sm-3 me-0 me-sm-3"
                    disabled={isLoading}
                    onClick={handleSubmit}
                >{title} {titleModel}</button>
            )}
            {isEdit && canDelete && (
                <button
                    type="button"
                    className="btn btn-danger mb-2 mb-sm-0 col-12 col-sm-3"
                    disabled={isLoading}
                    onClick={() => setShowModal(true)}
                >Xoá {titleModel}</button>
            )}
        </div>
    )
}

export default CustomShowGroupButtonCreateOrEdit;