import React from 'react';
import credit from '~/assets/images/credit-cards-footer.png'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-middle">
                <div className="container">
                    <div className="bottom-inner">
                        <div className="row">
                            <div className="col-md-4 col-12 align-content-center">
                                <div className="text-center text-md-start">
                                    <img src="/logo192.png" alt="logo công ty" style={{width: "50%"}}/>
                                </div>
                                <div className="single-footer f-contact" style={{marginTop: "20px"}}>
                                    <p className="text-white">Công ty TNHH Abcxyz Việt Nam</p>
                                    <p className="text-white">Địa chỉ: <a href="https://maps.app.goo.gl/eafQmCdPczYyahdF6">123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</a></p>
                                    <p className="text-white">Mã số thuế: 123456789</p>
                                </div>
                            </div>
                            <div className="col-md-5 col-12 d-flex justify-content-center">
                                <div className="single-footer f-contact">
                                    <h3>Về công ty</h3>
                                    <p className="phone link">
                                        Phone: <a href="tel:+841234567890">+84 123 456 7890</a>
                                    </p>
                                    <ul className="ps-0">
                                        <li><span>Monday-Friday: </span> 9.00 am - 8.00 pm</li>
                                        <li><span>Saturday: </span> 10.00 am - 6.00 pm</li>
                                    </ul>
                                    <p className="mail link">
                                        Email: <a href="mailto:nguyen.tan.dung@rivercrane.com.vn">nguyen.tan.dung@rivercrane.com.vn</a>
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-3 col-12">
                                <div className="single-footer f-link">
                                    <h3> </h3>
                                    <ul className="ps-0">
                                        <li><a href="#">Trang chủ</a></li>
                                        <li><a href="#">Danh sách sản phẩm</a></li>
                                        <li><a href="#">Giỏ Hàng</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <div className="inner-content">
                        <div className="row align-items-center">
                            <div className="col-lg-4 col-12">
                                <div className="payment-gateway">
                                    <img src={credit} alt="#" />
                                </div>
                            </div>
                            <div className="col-lg-4 col-12">
                                <div className="copyright">
                                    <p><a href="/" rel="nofollow noopener noreferrer"
                                        target="_blank">© nguyen.tan.dung</a></p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-12">
                                <ul className="socila">
                                    <li>
                                        <span>Follow Us On:</span>
                                    </li>
                                    <li><a href="#"><i className="lni lni-facebook-filled"></i></a></li>
                                    <li><a href="#"><i className="lni lni-twitter-original"></i></a></li>
                                    <li><a href="#"><i className="lni lni-instagram"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;