import React from 'react';
import Breadcrumbs from '../ui/breadcrumbs';
import { Filter, Sort } from './filter';
import Item from '../ui/item-product';
import { CustomPagination } from '~/components/user/ui/custom-pagination';
import { useShop } from '~/hooks/user/use-shop';

const Products = () => {
    const {
        data,
        pagination,
        sorting,
        inputSearch,
        setInputSearch,
        inputPriceFrom,
        setInputPriceFrom,
        inputPriceTo,
        setInputPriceTo,
        isLoading,
        error,
        handlePageChange,
        handleRowsPerPageChange,
        handleSort,
        defaultPriceRange,
        handleSearch,
        handleReset,
    } = useShop();
    return (
        <>
            <Breadcrumbs
                title="Cửa hàng"
                items={[
                    { icon: 'lni lni-home', label: "Trang chủ", link: "/" },
                    { label: "Cửa hàng", link: "/shop" }
                ]}
            />
            <section className="product-grids section pt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-12">
                            <Filter
                                inputSearch={inputSearch}
                                setInputSearch={setInputSearch}
                                priceFrom={inputPriceFrom}
                                priceTo={inputPriceTo}
                                setPriceFrom={setInputPriceFrom}
                                setPriceTo={setInputPriceTo}
                                priceMin={defaultPriceRange.min}
                                priceMax={defaultPriceRange.max}
                                handleSearch={handleSearch}
                                handleReset={handleReset}
                            />
                        </div>
                        <div className="col-lg-9 col-12">
                            <div className="product-grids-head">
                                <div className="product-grid-topbar">
                                    <div className="row align-items-center">
                                        <div className="col-lg-7 col-md-8 col-12">
                                            <Sort
                                                sorting={sorting}
                                                setSorting={handleSort}
                                            />
                                        </div>
                                        <div className="col-lg-5 col-md-4 col-12">
                                            <h3 className="total-show-product">Hiển Thị: <span>{`${pagination.from} - ${pagination.to}`} sản phẩm</span></h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-content" id="nav-tabContent">
                                    <div className="tab-pane active" id="nav-grid" role="tabpanel" aria-labelledby="nav-grid-tab">
                                        {isLoading ? (
                                            <div>Đang tải sản phẩm...</div>
                                        ) : error ? (
                                            <div>Lỗi: {error}</div>
                                        ) : (
                                            <div className="row">
                                                {data && data.length > 0 ? (
                                                    data.map((product) => (
                                                        <div key={product.id} className="col-lg-4 col-md-6 col-6">
                                                            <Item product={product} />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>Không có sản phẩm nào.</div>
                                                )}
                                            </div>
                                        )}
                                        <div className="row">
                                            <CustomPagination
                                                rowsPerPage={pagination.per_page}
                                                rowCount={pagination.total}
                                                currentPage={pagination.current_page}
                                                onChangePage={handlePageChange}
                                                onChangeRowsPerPage={handleRowsPerPageChange}
                                                showRowsPerPage={true}
                                                rowsPerPageOptions={[5, 10, 15, 20]}
                                                maxPagesToShow={5}
                                                showInfo={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Products;