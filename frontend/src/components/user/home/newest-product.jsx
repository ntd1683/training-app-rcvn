import React, { useEffect } from "react";
import 'tiny-slider/dist/tiny-slider.css';
import { tns } from 'tiny-slider/src/tiny-slider';
import { useSelector, useDispatch } from 'react-redux';
import { selectProductsNewest, selectIsLoading, selectError } from '../../../redux/selectors/products-selector';
import { loadProductsNewest } from '../../../redux/slices/products-slice';
import Item from "../ui/item-product";

const NewestProduct = () => {
    const dispatch = useDispatch();
    const newestProducts = useSelector(selectProductsNewest);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        dispatch(loadProductsNewest({ limit: 8 }));
    }, [dispatch]);

    useEffect(() => {
        if (newestProducts && newestProducts.length > 0) {
            const slider = tns({
                container: '.product-slider',
                autoplay: true,
                autoplayButtonOutput: false,
                mouseDrag: true,
                gutter: 15,
                nav: false,
                controls: true,
                responsive: {
                    0: {
                        items: 1,
                    },
                    540: {
                        items: 2,
                    },
                    768: {
                        items: 3,
                    },
                    992: {
                        items: 4,
                    }
                },
                controlsText: ['<i class="lni lni-chevron-left"></i>', '<i class="lni lni-chevron-right"></i>'],
            });
            return () => {
                slider.destroy();
            };
        }
    }, [newestProducts]);

    if (isLoading) return <div>Đang tải sản phẩm mới nhất...</div>;
    if (error) return <div>Lỗi: {error}</div>;

    return (
        <section className="newest-product section">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title">
                            <h2>Sản phẩm mới nhất</h2>
                            <p>Những sản phẩm mới nhất được thêm vào cửa hàng.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="position-relative">
                <div className="container">
                    <div className="product-slider row">
                        {newestProducts && newestProducts.length > 0 ? (
                            newestProducts.map((product) => (
                                <div key={product.id} className="col-lg-3 col-md-6 col-12">
                                    <Item product={product} className="single-slider"/>
                                </div>
                            ))
                        ) : (
                            <div>Không có sản phẩm mới nhất.</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NewestProduct;