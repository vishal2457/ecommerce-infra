import React, {Fragment} from 'react';
import Carousel from 'react-bootstrap/Carousel';
import styles from './Slider.module.scss';
var home_image1 = "/img/slider/slider1.jpg";
var home_image2 = "/img/slider/slider2.jpg";
function Slider() {
    return (
        <Fragment>
            <Carousel className="slider_area">
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={home_image1}
                    alt="First slide"
                    />
                    <Carousel.Caption>
                    <div className={styles.slider_content}>
                        <p>exclusive offer -10% off this week</p>
                        <h1>jewelry arrivals</h1>
                        <p className="slider_price">starting at <span>$2.199.oo</span></p>
                        <a className="button" href="shop.html">shopping now</a>
                    </div>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={home_image2}
                    alt="Third slide"
                    />

                    <Carousel.Caption>
                    <div className={styles.slider_content}>
                        <p>exclusive offer -10% off this week</p>
                        <h1>jewelry arrivals</h1>
                        <p className="slider_price">starting at <span>$2.199.oo</span></p>
                        <a className="button" href="shop.html">shopping now</a>
                    </div>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={home_image2}
                    alt="Third slide"
                    />

                    <Carousel.Caption>
                    <div className={styles.slider_content}>
                        <p>exclusive offer -10% off this week</p>
                        <h1>jewelry arrivals</h1>
                        <p className="slider_price">starting at <span>$2.199.oo</span></p>
                        <a className="button" href="shop.html">shopping now</a>
                    </div>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            {/* <div className="container-fluid">
                    <div className="row">
                        <div id="carouselExampleCaptions" className="carousel slide" data-ride="carousel">
                            <ol className="carousel-indicators">
                                <li data-target="#carouselExampleCaptions" data-slide-to="0" className="active"></li>
                                <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
                            </ol>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img src={home_image1} className="d-block w-100" alt="image1" />
                                    <div className="carousel-caption d-none d-md-block">
                                        <div className="slider_content">
                                            <p>exclusive offer -10% off this week</p>
                                            <h1>jewelry arrivals</h1>
                                            <p className="slider_price">starting at <span>$2.199.oo</span></p>
                                            <a className="button" href="shop.html">shopping now</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <img src={home_image2} className="d-block w-100" alt="image2" />
                                    <div className="carousel-caption d-none d-md-block">
                                        <div className="slider_content">
                                            <p>exclusive offer -10% off this week</p>
                                            <h1>jewelry arrivals</h1>
                                            <p className="slider_price">starting at <span>$2.199.oo</span></p>
                                            <a className="button" href="shop.html">shopping now</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a className="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
                </div> */}

            {/* <div className="slider_area owl-carousel">
                    <div className="single_slider" data-bgimg="assets/img/slider/slider1.jpg">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-12">
                                    <div className="slider_content">
                                        <p>exclusive offer -10% off this week</p>
                                        <h1>jewelry arrivals</h1>
                                        <p className="slider_price">starting at <span>$2.199.oo</span></p>
                                        <a className="button" href="shop.html">shopping now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="single_slider" data-bgimg="assets/img/slider/slider2.jpg">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-12">
                                    <div className="slider_content">
                                        <p>exclusive offer -10% off this week</p>
                                        <h1>engagement ring</h1>
                                        <p className="slider_price">starting at <span>$2.199.oo</span></p>
                                        <a className="button" href="shop.html">shopping now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            
        </Fragment>
    );
}

export default Slider;
