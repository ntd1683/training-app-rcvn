import React from 'react';
import Breadcrumbs from '../ui/breadcrumbs';
import MagnifyingGallery from './magnifying-gallery';
import { formatPrice, stripHtmlAndTruncate, sanitizeContent } from '~/utils/common';
import { NumberInput } from '../ui/number-input';
import { useProductDetail } from '~/hooks/user/use-product-detail';
import ProductStatus from '~/constants/product-status';

const ProductDetail = () => {
    const {
        id,
        currentProduct,
        isLoading,
        error,
        quantity,
        setQuantity,
        handleAddToCart,
        isAddedToCart,
        errorAdd,
        handleToggleWishlist,
        isAddedToWishlist,
        errorWishlist,
        addingToWishlist,
    } = useProductDetail();

    return (
        <>
            <Breadcrumbs
                title={currentProduct?.name || "Chi tiết sản phẩm"}
                items={[
                    { icon: 'lni lni-home', label: "Trang chủ", link: "/" },
                    { label: "Cửa hàng", link: "/shop" },
                    { label: currentProduct?.name, link: `/san-pham/${id}` }
                ]}
            />
            <section className="item-details section">
                <div className="container">
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div>Đang tải thông tin sản phẩm...</div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-5">
                            <div className="alert alert-danger">Lỗi: {error}</div>
                        </div>
                    ) : !currentProduct ? (
                        <div className="text-center py-5">
                            <div>Không tìm thấy sản phẩm</div>
                        </div>
                    ) : (
                        <>
                            <div className="top-area">
                                <div className="row align-items-center">
                                    <div className="col-lg-6 col-md-12 col-12">
                                        <div className="product-images">
                                            <MagnifyingGallery
                                                image_url={currentProduct?.image_url}
                                                images={[]}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12 col-12">
                                        <div className="product-info">
                                            <h2 className="title">{currentProduct?.name}</h2>
                                            <p className="category">
                                                <i className="lni lni-shopping-basket"></i> Số lượng:
                                                <a href="#">{currentProduct?.quantity}</a>
                                            </p>
                                            <h3 className="price">{formatPrice(currentProduct?.price)}<span>{formatPrice(currentProduct?.old_price)}</span></h3>
                                            <p className="info-text">{stripHtmlAndTruncate(currentProduct?.description, 50)}</p>
                                            <div className="form-group quantity">
                                                <div className="row">
                                                    {(currentProduct?.quantity > 0 && currentProduct.status === ProductStatus.SELLING) ? (
                                                        <>
                                                            <div className="col-lg-4 col-md-4 col-12">
                                                                <NumberInput value={quantity} setValue={setQuantity} className="h-100" />
                                                            </div>
                                                            <div className="col-lg-4 col-md-4 col-12 mt-3 mt-md-0">
                                                                <div className="button cart-button h-100 px-1">
                                                                    <button
                                                                        className={`btn w-100 h-100 ${isAddedToCart ? 'btn-success' : ''}`}
                                                                        onClick={handleAddToCart}
                                                                        disabled={currentProduct?.quantity === 0 || isAddedToCart}>
                                                                        <i className={`lni ${isAddedToCart ? 'lni-checkmark' : 'lni-cart'}`}></i> 
                                                                        {isAddedToCart ? 'Đã thêm vào giỏ hàng' : 'Thêm vào giỏ hàng'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-4 col-12">
                                                                <div className="wish-button px-1">
                                                                    <button
                                                                        className={`btn w-100 h-100 ${addingToWishlist ? 'btn-success' : ''}`}
                                                                        onClick={handleToggleWishlist}
                                                                        disabled={addingToWishlist}
                                                                        style={{ height: "fit-content" }}
                                                                    >
                                                                        <i className={`lni ${isAddedToWishlist ? 'lni-heart-filled' : 'lni-heart'}`}></i> 
                                                                        {isAddedToWishlist ? 'Xoá yêu thích' : 'Thêm vào yêu thích'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="col-lg-5 col-md-5 col-12">
                                                                <div className="h-100 px-1 fw-bold d-flex align-items-center justify-content-center fs-6">
                                                                    HẾT HÀNG
                                                                </div>
                                                            </div><div className="col-lg-7 col-md-7 col-12">
                                                                <div className="wish-button px-1">
                                                                    <button
                                                                        className={`btn w-100 h-100 ${addingToWishlist ? 'btn-success' : ''}`}
                                                                        onClick={handleToggleWishlist}
                                                                        disabled={addingToWishlist}
                                                                        style={{ height: "fit-content" }}
                                                                    >
                                                                        <i className={`lni ${isAddedToWishlist ? 'lni-heart-filled' : 'lni-heart'}`}></i> 
                                                                        {isAddedToWishlist ? 'Xoá yêu thích' : 'Thêm vào yêu thích'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-danger mt-3 fs-6 fw-bold">
                                                {errorAdd}
                                                {errorWishlist}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="product-details-info">
                                <div className="single-block">
                                    <div className="row">
                                        <div className="info-body custom-responsive-margin">
                                            <h4>Details</h4>
                                            {currentProduct.description && (
                                                <div style={{ overflowWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: sanitizeContent(currentProduct.description) }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    )
}

export default ProductDetail;