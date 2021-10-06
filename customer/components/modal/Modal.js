import React, { useState, Fragment } from "react";

import banner_img1 from "../../assets/img/bg/banner1.jpg";
import banner_img2 from "../../assets/img/bg/banner2.jpg";
import banner_img3 from "../../assets/img/bg/banner3.jpg";

import { Row, Col, Button, Modal, Container, Carousel } from "react-bootstrap";

const ProductModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Fragment>
      <Button variant="primary" onClick={handleShow}>
        Product Details
      </Button>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Product Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <img src={banner_img1} />
                </div>
                <div className="col-md-6">
                  <h3>Donec Eu Furniture</h3>
                  <strike>1000 Rs.</strike>
                  <span>700 Rs.</span>
                  <br />
                  <a href="/">See All Features</a>
                  <input type="number" />
                  <button type="button" className="btn btn-dark">
                    ADD TO CART
                  </button>
                  <br />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Carousel>
                    <Carousel.Item className="w-50">
                      <img
                        className="d-block w-100"
                        src={banner_img1}
                        alt="First slide"
                      />
                    </Carousel.Item>
                    <Carousel.Item className="w-50">
                      <img
                        className="d-block w-100"
                        src={banner_img2}
                        alt="Second slide"
                      />
                    </Carousel.Item>
                    <Carousel.Item className="w-50">
                      <img
                        className="d-block w-100"
                        src={banner_img1}
                        alt="Third slide"
                      />
                    </Carousel.Item>
                  </Carousel>


                </div>
                <div className="col-md-6">
                  <h3>Share This Product</h3>
                  <div className="footer_contact">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ion-social-rss"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ion-social-googleplus"></i>
                        </a>
                      </li>

                      <li>
                        <a href="#">
                          <i className="ion-social-youtube"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default ProductModal;
