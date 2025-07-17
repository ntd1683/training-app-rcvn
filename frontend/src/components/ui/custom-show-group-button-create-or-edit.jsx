import { checkRoleAndPermission } from '~/utils/common';

const CustomShowGroupButtonCreateOrEdit = ({ isEdit, isLoading, handleSubmit, title,titleModel, page, setShowModal }) => {
    const canEdit = isEdit && checkRoleAndPermission(page + '.update');
    return (
        <>
            {!isEdit ? (
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                    onClick={handleSubmit}
                >{title} {titleModel}</button>
            ) : canEdit && (
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                    onClick={handleSubmit}
                >{title} {titleModel}</button>
            )}
            {isEdit && checkRoleAndPermission('products.delete') && (
                <button
                    type="button"
                    className="btn btn-danger ms-2"
                    disabled={isLoading}
                    onClick={() => setShowModal(true)}
                >Xoá {titleModel}</button>
            )}
        </>
    )
}

export default CustomShowGroupButtonCreateOrEdit;