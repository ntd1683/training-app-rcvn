import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { selectProductsBestSeller, selectIsLoading, selectError } from '~/redux/selectors/products-selector';
import { loadProductsBestSeller } from '~/redux/slices/products-slice';
import Item from "../ui/item-product";

const BestSellerProducts = () => {
    const dispatch = useDispatch();
    const bestSellerProducts = useSelector(selectProductsBestSeller);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        dispatch(loadProductsBestSeller({ limit: 8 }));
    }, [dispatch]);

    if (isLoading) return <div>Đang tải sản phẩm bán chạy...</div>;
    if (error) return <div>Lỗi: {error}</div>;

    return (
        <section className="trending-product section">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title">
                            <h2>Sản phẩm bán chạy nhất</h2>
                            <p>Những sản phẩm được bán chạy nhất trong tháng này.</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {bestSellerProducts && bestSellerProducts.length > 0 ? (
                        bestSellerProducts.map((product) => (
                            <div key={product.id} className="col-lg-3 col-md-6 col-12">
                                <Item product={product} />
                            </div>
                        ))
                    ) : (
                        <div>Không có sản phẩm bán chạy.</div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default BestSellerProducts;
