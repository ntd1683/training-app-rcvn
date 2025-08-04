import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import 'tiny-slider/dist/tiny-slider.css';
import { tns } from 'tiny-slider/src/tiny-slider';
import { formatPrice } from "../../../utils/common";

import product1 from "../../../assets/images/products/product-1.jpg";
import product2 from "../../../assets/images/products/product-2.jpg";
import product3 from "../../../assets/images/products/product-3.jpg";
import product4 from "../../../assets/images/products/product-4.jpg";
import product5 from "../../../assets/images/products/product-5.jpg";
import product6 from "../../../assets/images/products/product-6.jpg";
import product7 from "../../../assets/images/products/product-7.jpg";
import product8 from "../../../assets/images/products/product-8.jpg";

const products = [
    {
        id: 1,
        image: product1,
        title: "Xiaomi Mi Band 5",
        price: "$199.00",
        count: 10,
        created_at: '2025-07-28 08:25:17'
    },
    {
        id: 2,
        image: product2,
        title: "Big Power Sound Speaker",
        price: "$275.00",
        discountPrice: "$300.00",
        count: 5,
        created_at: "2025-07-20 08:25:17"
    },
    {
        id: 3,
        image: product3,
        title: "WiFi Security Camera",
        price: "$399.00",
        count: 8,
        created_at: "2025-07-23 08:25:17"
    },
    {
        id: 4,
        image: product4,
        title: "iphone 6x plus",
        price: "$400.00",
        count: 12,
        created_at: "2025-07-18 08:25:17"
    },
    {
        id: 5,
        image: product5,
        title: "Wireless Headphones",
        price: "$350.00",
        count: 15,
        created_at: "2025-07-12 08:25:17"
    },
    {
        id: 6,
        image: product6,
        title: "Mini Bluetooth Speaker",
        price: "$70.00",
        count: 20,
        created_at: "2025-07-15 08:25:17"
    },
    {
        id: 7,
        image: product7,
        title: "PX7 Wireless Headphones",
        price: "$100.00",
        discountPrice: "$200.00",
        count: 7,
        created_at: "2025-07-19 08:25:17"
    },
    {
        id: 8,
        image: product8,
        title: "Apple MacBook Air",
        price: "$899.00",
        count: 3,
        created_at: "2025-07-20 08:25:17"
    },
];

const NewestProduct = () => {
    const newestProducts = products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    useEffect(() => {
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
                    items: 3,
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
    }, []);
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
                <div className="product-slider row">
                    {newestProducts.map((product) => (
                        <div key={product.id} className="col-lg-3 col-md-6 col-12">
                            <div className="single-product single-slider">
                                <div className="product-image">
                                    <img src={product.image} alt="#" />
                                    <div className="button">
                                        <Link to={`/products/${product.id}`} className="btn">
                                            <i className="lni lni-cart"></i> Thêm vào giỏ hàng
                                        </Link>
                                    </div>
                                </div>
                                <div className="product-info">
                                    {/* <span className="category">Watches</span> */}
                                    <h4 className="title">
                                        <Link to={`/products/${product.id}`}>{product.title}</Link>
                                    </h4>
                                    {/* <ul className="review">
                                    <li><i className="lni lni-star-filled"></i></li>
                                    <li><i className="lni lni-star-filled"></i></li>
                                    <li><i className="lni lni-star-filled"></i></li>
                                    <li><i className="lni lni-star-filled"></i></li>
                                    <li><i className="lni lni-star"></i></li>
                                    <li><span>4.0 Review(s)</span></li>
                                </ul> */}
                                    <div className="d-flex justify-content-between">
                                        <div className="price mt-0">
                                            <span>{formatPrice(product.price)}</span>
                                            {product.discountPrice && (
                                                <span className="discount-price">{formatPrice(product.discountPrice)}</span>
                                            )}
                                        </div>
                                        <span className="ms-3" style={{ opacity: "80%" }}>{product.count} đã bán</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default NewestProduct;