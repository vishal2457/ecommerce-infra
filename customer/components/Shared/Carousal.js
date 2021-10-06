import React from "react";
import { Fragment } from "react";
import { Carousel } from "react-bootstrap";
import { ResourceApiUrl } from "../../utility/commonUtility";
import Image from "../image/image";

function Carousal({ arr, onDragStart, onDrop }) {
  return (
    <Fragment>
      {arr.length ? (
        <Carousel controls={false} pause="false" interval={2000} >
          {arr.map((image, index) => (
            <Carousel.Item key={index}>
              <Image
                className="card-img-top bdr-transparent"
                src={`${ResourceApiUrl}${image?.Image}`}
                alt="Card image cap"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <Image
          className="card-img-top bdr-transparent"
          src={`no-image`}
          alt="Card image cap"
        />
      )}
    </Fragment>
  );
}

export default Carousal;
