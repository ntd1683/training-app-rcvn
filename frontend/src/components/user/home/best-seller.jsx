import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { selectProductsBestSeller, selectIsLoading, selectErrorBestSeller } from '~/redux/selectors/products-selector';
import { loadProductsBestSeller } from '~/redux/slices/products-slice';
import Item from "../ui/item-product";
import LoadingComponent from "../ui/loading-component";
import ErrorComponent from "../ui/error-component";

const BestSellerProducts = () => {
    const dispatch = useDispatch();
    const bestSellerProducts = useSelector(selectProductsBestSeller);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectErrorBestSeller);

    useEffect(() => {
        dispatch(loadProductsBestSeller({ limit: 8 }));
    }, [dispatch]);

    if (isLoading) return <LoadingComponent message="Đang tải sản phẩm bán chạy..." />;
    if (error) return <ErrorComponent message={error} />;

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
