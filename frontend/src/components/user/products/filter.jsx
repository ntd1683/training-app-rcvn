import DualRangeSlider from '../ui/dual-range-slider';
import { CustomBtn } from '../ui/custom-btn';

export const Filter = ({
    inputSearch,
    setInputSearch,
    priceFrom,
    priceTo,
    setPriceFrom,
    setPriceTo,
    handleSearch,
    handleReset,
    priceMin = 0,
    priceMax = 50000
}) => {
    const handlePriceChange = (range) => {
        setPriceFrom(range.min);
        setPriceTo(range.max);
    };

    const isSearch = inputSearch.trim() !== ''
        || (priceFrom !== '' && priceFrom !== priceMin)
        || (priceTo !== '' && priceTo !== priceMax);

    return (
        <div className="product-sidebar">
            <div className="single-widget search">
                <h3>Tìm kiếm sản phẩm</h3>
                <form action="#" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        value={inputSearch}
                        onChange={(e) => setInputSearch(e.target.value)}
                        placeholder="Nhập tên sản phẩm hoặc từ khóa..."
                    />
                    <button type="button">
                        <i className="lni lni-search-alt"></i>
                    </button>
                </form>
            </div>
            <div className="single-widget range">
                <h3>Price Range</h3>
                <DualRangeSlider
                    min={priceMin}
                    max={priceMax}
                    initialMin={priceFrom || priceMin}
                    initialMax={priceTo || priceMax}
                    step={1}
                    handlePriceChange={handlePriceChange}
                />
            </div>
            {isSearch && (
                <>
                    <CustomBtn classNameBtn="w-100" onClick={handleSearch}>Tìm Kiếm</CustomBtn>
                    <CustomBtn
                        className="mt-3"
                        classNameBtn="w-100 bg-secondary"
                        onClick={handleReset}
                    >Xoá Tìm Kiếm</CustomBtn>
                </>
            )}
            {/* <div class="single-widget condition">
                <h3>Tình trạng sản phẩm</h3>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault11" />
                    <label class="form-check-label" for="flexCheckDefault11">
                        
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault22" />
                    <label class="form-check-label" for="flexCheckDefault22">
                        Bosh (39)
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault33" />
                    <label class="form-check-label" for="flexCheckDefault33">
                        Canon Inc. (128)
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault44" />
                    <label class="form-check-label" for="flexCheckDefault44">
                        Dell (310)
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault55" />
                    <label class="form-check-label" for="flexCheckDefault55">
                        Hewlett-Packard (42)
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault66" />
                    <label class="form-check-label" for="flexCheckDefault66">
                        Hitachi (217)
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault77" />
                    <label class="form-check-label" for="flexCheckDefault77">
                        LG Electronics (310)
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault88" />
                    <label class="form-check-label" for="flexCheckDefault88">
                        Panasonic (74)
                    </label>
                </div>
            </div> */}
        </div>
    )
}

export const Sort = ({ sorting, setSorting }) => {
    const handleChange = (e) => {
        switch (e.target.value) {
            case 'popular':
                setSorting({
                    sortName: 'popular',
                    sortBy: 'popular',
                    sortOrder: 'desc'
                });
                break;
            case 'price_asc':
                setSorting({
                    sortName: 'price_asc',
                    sortBy: 'price',
                    sortOrder: 'asc'
                });
                break;
            case 'price_desc':
                setSorting({
                    sortName: 'price_desc',
                    sortBy: 'price',
                    sortOrder: 'desc'
                });
                break;
            case 'name_asc':
                setSorting({
                    sortName: 'name_asc',
                    sortBy: 'name',
                    sortOrder: 'asc'
                });
                break;
            case 'name_desc':
                setSorting({
                    sortName: 'name_desc',
                    sortBy: 'name',
                    sortOrder: 'desc'
                });
                break;
            case 'created_at':
                setSorting({
                    sortName: 'created_at',
                    sortBy: 'created_at',
                    sortOrder: 'desc'
                });
                break;
            default:
                setSorting({
                    sortName: 'popular',
                    sortBy: 'popular',
                    sortOrder: 'desc'
                });
        }
    };
    return (
        <div className="product-sorting">
            <label htmlFor="sorting">Sắp xếp theo:</label>
            <select className="form-control" id="sorting" value={sorting.sortName} onChange={handleChange}>
                <option value="popular">Phổ Biến</option>
                <option value="created_at">Mới Nhất</option>
                <option value="price_asc">Giá Thấp - Cao</option>
                <option value="price_desc">Giá Cao - Thấp</option>
                <option value="name_asc">A - Z</option>
                <option value="name_desc">Z - A</option>
            </select>
        </div>
    )
}
