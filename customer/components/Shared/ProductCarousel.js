import React from 'react';
import { Carousel } from "react-bootstrap";
import { ResourceApiUrl } from '../../utility/commonUtility';
import Image from '../image/image';
import dynamic from 'next/dynamic';
const Overlay = dynamic(() => import('./Overlay'));
const ProductData = dynamic(() => import('./productData'));


function ProductCarousel({getProductsLocal,handleChange, mainArr, }) {

    const directionButtons = (direction) => {
        return (
          <span
            aria-hidden="true"
            className={`carousel-control-${direction}-icon`}
          
            onClick={() => handleChange(direction)}
          />
        );
      };

    return (
        <Carousel
          nextIcon={directionButtons("next")}
          prevIcon={directionButtons("prev")}
        >
          <Carousel.Item>
            <div className="row">
              {mainArr &&
                mainArr.map((obj) => {
                  return (
                    <div className="col-md-3">
                      <div
                        className="card pointer m-auto"
                        style={{width: '67%'}}
                        onClick={() => getProductsLocal(obj?.ID)}
                      >
                      <Image
                      className="card-img-top bdr-transparent"
                     src={`${ResourceApiUrl}${obj?.Product_Images[0]?.Image}`}
                      alt="Card image cap"
                    />
                        <div className="card-body">
                          <h5 className="card-title">
                            {obj?.ProductName} &nbsp;
                            <Overlay
                              heading={obj?.ProductName}
                              component={<ProductData data={obj} />}
                            />
                          </h5>
                          <p className="card-text">{obj?.ProductDescription}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Carousel.Item>
        </Carousel>
    )
}

export default ProductCarousel
