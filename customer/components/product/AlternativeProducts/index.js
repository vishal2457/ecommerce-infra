import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import { ResourceApiUrl } from "../../../utility/commonUtility";
import Image from "../../image/image";
import dynamic from "next/dynamic";
const ProductData = dynamic(() => import("../../Shared/productData"));
const Overlay = dynamic(() => import("../../Shared/Overlay"));
const ProductCarousel = dynamic(() => import("../../Shared/ProductCarousel"));

export const Alternativeproducts = ({ arr, getProductsLocal }) => {
  const [mainArr, setmainArr] = useState();
  const [previousSkipped, setpreviousSkipped] = useState(0);

  useEffect(() => {
    if (arr.length > 4) {
      setmainArr(arr.slice(previousSkipped, previousSkipped + 4));
    } else {
      setmainArr(arr);
    }
    return () => {};
  }, [previousSkipped, arr]);

  const handleChange = (direction) => {
    if (direction == "next" && previousSkipped + 4 < arr.length) {
      setpreviousSkipped(previousSkipped + 1);
    }
    if (direction == "prev" && previousSkipped > 0) {
      setpreviousSkipped(previousSkipped - 1);
    }
  };

  return (
    <Fragment>
      <div className="text-center w-100 my-5">
        <h3>Alternative Produkte</h3>
      </div>

      {arr && arr.length <= 4 ? (
        <div className="row">
          {mainArr &&
            mainArr.map((obj) => {
              return (
                <div className="col-md-3">
                  <div
                    class="card pointer"
                    onClick={() => getProductsLocal(obj?.ID)}
                  >
                    <Image
                      className="card-img-top bdr-transparent"
                      src={`${ResourceApiUrl}${obj?.Product_Images[0]?.Image}`}
                      alt="Card image cap"
                    />
                    <div class="card-body">
                      <h5 class="card-title">
                        {obj?.ProductName}&nbsp;
                        <Overlay
                          heading={obj?.ProductName}
                          component={<ProductData data={obj} />}
                        />
                      </h5>
                      <p class="card-text">{obj?.Supplier?.SupplierName}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <ProductCarousel
          handleChange={handleChange}
          mainArr={mainArr}
          getProductsLocal={getProductsLocal}
        />
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Alternativeproducts);
