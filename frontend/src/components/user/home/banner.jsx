import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    loadSlideBanners,
    loadStaticBanners,
    loadTextBanners,
} from '~/redux/slices/banners-slice';
import {
    selectBannersSlide,
    selectBannersStatic,
    selectBannersText,
    selectIsLoadingSlide
} from '~/redux/selectors/banners-selector';
import 'tiny-slider/dist/tiny-slider.css';
import { tns } from 'tiny-slider/src/tiny-slider';
import { formatPrice } from '~/utils/common';

const Banner = () => {
    const isMounted = useRef(false);

    const dispatch = useDispatch();
    const sliders = useSelector(selectBannersSlide);
    const staticItem = useSelector(selectBannersStatic);
    const textItem = useSelector(selectBannersText);
    const isLoadingSlide = useSelector(selectIsLoadingSlide);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            dispatch(loadSlideBanners({ limit: 3 }));
            dispatch(loadStaticBanners());
            dispatch(loadTextBanners());
        }
    }, [dispatch]);

    useEffect(() => {
        if (sliders.length > 0 && !isLoadingSlide) {
            const slider = tns({
                container: '.hero-slider',
                slideBy: 'page',
                autoplay: true,
                autoplayButtonOutput: false,
                mouseDrag: true,
                gutter: 0,
                items: 1,
                nav: false,
                controls: true,
                controlsText: ['<i class="lni lni-chevron-left"></i>', '<i class="lni lni-chevron-right"></i>'],
            });
            return () => {
                slider.destroy();
            };
        }
    }, [sliders, isLoadingSlide]);

    return (
        <section className="hero-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-12 custom-padding-right">
                        <div className="slider-head">
                            <div className="hero-slider">
                                {sliders.map((item) => (
                                    <div className="single-slider" key={item.id}
                                        style={{ backgroundImage: `url(${item.image_url})` }}>
                                        <div className="content">
                                            <h2><span>{item.header}</span>
                                                {item.title}
                                            </h2>
                                            <p>{item.subtitle}</p>
                                            {item.price && (<h3><span>{item.title_price}</span> {formatPrice(parseFloat(item.price))}</h3>)}
                                            {item.button_text && (
                                                <div className="button">
                                                    <Link to={item.button_url ? item.button_url : `/san-pham/${item?.product_id}`} className="btn">{item.button_text}</Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-12">
                        <div className="row">
                            <div className="col-lg-12 col-md-6 col-12 md-custom-padding">
                                {staticItem && (
                                    <div className="hero-small-banner"
                                        style={{ backgroundImage: `url(${staticItem.image_url})` }}>
                                        <div className="content">
                                            <h2>
                                                <span>{staticItem.header}</span>
                                                {staticItem.title}
                                            </h2>
                                            <h3>{formatPrice(parseFloat(staticItem.price))}</h3>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col-lg-12 col-md-6 col-12">
                                {textItem && (
                                    <div className="hero-small-banner style2"
                                        style={{ backgroundImage: `url(${textItem.image_url})` }}
                                    >
                                        <div className="content">
                                            <h2>{textItem.title}</h2>
                                            {textItem.subtitle && <p>{textItem.subtitle}</p>}
                                            {textItem.button_text && (
                                                <div className="button">
                                                    <a href={textItem.button_url} className="btn">{textItem.button_text}</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner;