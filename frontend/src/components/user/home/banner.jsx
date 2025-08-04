import { useEffect } from 'react';
import 'tiny-slider/dist/tiny-slider.css';
import { tns } from 'tiny-slider/src/tiny-slider';

import slider_bg_1 from "../../../assets/images/hero/slider-bg1.jpg";
import slider_bg_2 from "../../../assets/images/hero/slider-bg2.jpg";
import slider_bnr from "../../../assets/images/hero/slider-bnr.jpg";

const fakeData = [
    {
        id: 1,
        title: "M75 Sport Watch",
        subtitile: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
        header: "No restocking fee ($35 savings)",
        price: "$320.99",
        title_price: "Now Only",
        button_text: "Shop Now",
        button_url: "product-grids.html",
        image: slider_bg_1,
        type: "slider",
        index: 1
    },
    {
        id: 2,
        title: "Get the Best Deal on CCTV Camera",
        subtitile: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
        header: "Big Sale Offer",
        price: "$590.00",
        title_price: "Combo Only:",
        button_text: "Shop Now",
        button_url: "product-grids.html",
        image: slider_bg_2,
        type: "slider",
        index: 2
    },
    {
        id: 3,
        title: "iPhone 12 Pro Max",
        subtitile: "",
        header: "New line required",
        price: "$259.99",
        image: slider_bnr,
        type: "static",
        index: 1
    },
    {
        id: 4,
        title: "Weekly Sale!",
        subtitile: "Saving up to 50% off all online store items this week.",
        button_text: "Shop Now",
        button_url: "product-grids.html",
        type: "text",
        index: 1
    }
]

const getStaticItemWithMinIndex = (type) => {
  return fakeData
    .filter(item => item.type === type)
    .reduce((minItem, currentItem) => 
      !minItem || currentItem.index < minItem.index ? currentItem : minItem, 
      null
    );
};

const Banner = () => {
    const sliders = fakeData.filter(item => item.type === "slider").sort((a, b) => a.index - b.index);
    const staticItem = getStaticItemWithMinIndex("static");
    const textItem = getStaticItemWithMinIndex("text");

    useEffect(() => {
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
    }, []);

    return (
        <section className="hero-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-12 custom-padding-right">
                        <div className="slider-head">
                            <div className="hero-slider">
                                {sliders.map((item) => (
                                    <div className="single-slider" key={item.id}
                                        style={{ backgroundImage: `url(${item.image})` }}>
                                        <div className="content">
                                            <h2><span>{item.header}</span>
                                                {item.title}
                                            </h2>
                                            <p>{item.subtitile}</p>
                                            <h3><span>{item.title_price}</span> {item.price}</h3>
                                            <div className="button">
                                                <a href={item.button_url} className="btn">{item.button_text}</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-12">
                        <div className="row">
                            <div className="col-lg-12 col-md-6 col-12 md-custom-padding">
                                <div className="hero-small-banner"
                                    style={{ backgroundImage: `url(${staticItem.image})` }}>
                                    <div className="content">
                                        <h2>
                                            <span>{staticItem.header}</span>
                                            {staticItem.title}
                                        </h2>
                                        <h3>{staticItem.price}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-6 col-12">
                                <div className="hero-small-banner style2">
                                    {textItem && (
                                        <div className="content">
                                            <h2>{textItem.title}</h2>
                                            {textItem.subtitile && <p>{textItem.subtitile}</p>}
                                            {textItem.button_text && (
                                                <div className="button">
                                                    <a href={textItem.button_url} className="btn">{textItem.button_text}</a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner;