import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../ui/breadcrumbs';
import { useWishlist } from '~/hooks/user/use-wishlist';

const Wishlist = () => {
    const { wishlistItems, handleDeleteItem } = useWishlist();

    return (
        <>
            <Breadcrumbs
                title="Danh sách yêu thích"
                items={[
                    { icon: 'lni lni-home', label: "Trang chủ", link: "/" },
                    { label: "Danh sách yêu thích", link: "/danh-sach-yeu-thich" },
                ]}
            />
            <div className="shopping-cart section">
                <div className="container">
                    <div className="cart-list-head">
                        <div className="cart-list-title">
                            <div className="row align-items-center">
                                <div className="col-md-3 col-12">
                                    <p>Ảnh sản phẩm</p>
                                </div>
                                <div className="col-md-8 col-12">
                                    <p>Tên sản phẩm</p>
                                </div>
                                <div className="col-md-1 col-12">
                                    <p>Xóa</p>
                                </div>
                            </div>
                        </div>
                        {wishlistItems.map((item, index) => (
                            <div className="cart-single-list" key={index}>
                                <div className="row align-items-center">
                                    <div className="col-md-3 col-12">
                                        <Link to={`/san-pham/${item.id}`}>
                                            <img src={item.image_url} alt={item.name.length > 50
                                                ? item.name.slice(0, 50) + '...'
                                                : item.name} />
                                        </Link>
                                    </div>
                                    <div className="col-md-8 col-12">
                                        <h5 className="product-name">
                                            <Link to={`/san-pham/${item.id}`}>
                                                <p>{item.name.length > 65
                                                ? item.name.slice(0, 65) + '...'
                                                : item.name}</p>
                                                <p style={{ opacity: '65%' }}>{item.description.length > 200
                                                ? item.description.slice(0, 200) + '...'
                                                : item.description}</p>
                                            </Link>
                                        </h5>
                                    </div>
                                    <div className="col-md-1 col-12">
                                        <Link 
                                            className="remove-item" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDeleteItem(item.id);
                                            }}
                                        >
                                            <i className="lni lni-close"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Wishlist;