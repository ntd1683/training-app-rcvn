import React from 'react';
import { Icon } from '@iconify/react';
import { useCreateOrEditProduct } from '~/hooks/use-create-or-edit-product';
import { DeleteProductModal } from './delete-product-modal';
import ProductStatus from '~/constants/product-status';
import CustomInputImage from '~/components/ui/custom-input-image';
import CustomTextEditor from '~/components/ui/custom-text-editor';
import { Link } from 'react-router-dom';

const CreateOrEditProduct = () => {
    const {
        product,
        setProduct,
        isEdit,
        title,
        isLoading,
        image,
        setImage,
        errorName,
        errorDescription,
        errorPrice,
        errorCurrency,
        errorStatus,
        errorImage,
        setErrorImage,
        handleSubmit,
        showDeleteModal,
        setShowDeleteModal,
        isDeleting,
        handleDelete,
        errorDelete,
    } = useCreateOrEditProduct();
    
    return (
        <div className="card" style={{ margin: '0.5rem' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{`${title} sản phẩm`}</h5>
            </div>
            <div className="card-body">
                <form>
                    <div className="mb-6">
                        <label className="form-label" htmlFor="basic-icon-default-name">*Tên sản phẩm</label>
                        <div className="input-group input-group-merge">
                            <span id="basic-icon-default-name2" className={`input-group-text ${errorName ? 'is-invalid' : ''}`}>
                                <Icon icon="bx:user" className='icon-base bx' />
                            </span>
                            <input
                                type="text"
                                className={`form-control ${errorName ? 'is-invalid' : ''}`}
                                id="basic-icon-default-name"
                                placeholder="Bút bi"
                                aria-label="Bút bi"
                                aria-describedby="basic-icon-default-name2"
                                value={product.name}
                                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                            />
                        </div>
                        <div className="text-danger">{errorName}</div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="form-label">*Mô tả sản phẩm</label>
                        <CustomTextEditor value={product.description}
                            onChange={(content) => setProduct({ ...product, description: content })}
                            placeholder="Nhập mô tả sản phẩm..."
                            error={errorDescription}
                            maxLength={2000}
                            id="description"
                            height="250px"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="form-label" htmlFor="basic-icon-default-price">*Giá sản phẩm</label>
                        <div className="input-group input-group-merge">
                            <span id="basic-icon-default-price2" className={`input-group-text ${errorPrice ? 'is-invalid' : ''}`}>
                                <Icon icon="bx:money" className='icon-base bx' />
                            </span>
                            <input
                                type="number"
                                className={`form-control ${errorPrice ? 'is-invalid' : ''}`}
                                id="basic-icon-default-price"
                                placeholder="100000"
                                aria-label="100000"
                                aria-describedby="basic-icon-default-price2"
                                value={product.price}
                                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            />
                            <button
                                className={`btn btn-outline-secondary dropdown-toggle ${errorCurrency ? 'is-invalid' : ''}`}
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {product.currency || 'USD'}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <div className="dropdown-item cursor-pointer" onClick={() => setProduct({ ...product, currency: "USD" })}>USD</div>
                                    <div className="dropdown-item cursor-pointer" onClick={() => setProduct({ ...product, currency: "VND" })}>VND</div>
                                    <div className="dropdown-item cursor-pointer" onClick={() => setProduct({ ...product, currency: "JPY" })}>JPY</div>
                                </li>
                            </ul>
                        </div>
                        <div className="text-danger">{errorPrice || errorCurrency}</div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="status" className="form-label">*Tình trạng</label>
                        <select
                            className={`form-select ${errorStatus ? 'is-invalid' : ''}`}
                            id="status"
                            aria-label="Default select2"
                            value={product.status}
                            onChange={(e) => setProduct({ ...product, status: e.target.value })}
                        >
                            <option value="">Chọn Tình Trạng Sản Phẩm</option>
                            {ProductStatus.getAllStatuses().map(product => (
                                <option key={product.value} value={product.value}>
                                    {product.label}
                                </option>
                            ))}
                        </select>
                        <div className="text-danger">{errorStatus}</div>
                    </div>
                    <div className="mb-6">
                        <CustomInputImage
                            value={image}
                            setValue={setImage}
                            errorImage={errorImage}
                            setErrorImage={setErrorImage}
                            previewImage={product.image}
                            setPreviewImage={(preview) => setProduct({ ...product, image: preview })}
                        />
                    </div>
                    <div className="mb-6 w-100 d-flex justify-content-center">
                        <Link to="/products" className="btn btn-secondary me-2">Quay Lại</Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                            onClick={handleSubmit}
                        >{`${title} sản phẩm`}</button>
                        {isEdit && (
                            <button
                                type="button"
                                className="btn btn-danger ms-2"
                                disabled={isLoading}
                                onClick={() => setShowDeleteModal(true)}
                            >Xoá sản Phẩm</button>
                        )}
                    </div>
                </form>
            </div>
            <DeleteProductModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                isDeleting={isDeleting}
                errorDelete={errorDelete}
                handleDelete={handleDelete}
            />
        </div>
    );
}

export default CreateOrEditProduct;