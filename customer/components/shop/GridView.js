import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
  useContext,
} from "react";
import { connect } from "react-redux";
import { ResourceApiUrl } from "../../utility/commonUtility";
import ContentLoader from "react-content-loader";
import * as animationData from "./loading.json";
import { useCart } from "../../contexts/cart/user-cart";
import dynamic from "next/dynamic";
import { ProductCard } from "./ProductCard";
import { Button } from "../UI";
import Conditional from "../Shared/Conditional";
import { useInquiry } from "../../contexts/Inquiry/user-inquiry";
import { AuthContext } from "../../contexts/auth/auth.context";
import { useRouter } from "next/router";

const Lottie = dynamic(() => import("../Shared/Lottie"));

export const GridView = ({
  products,
  isLoading,
  removeFilter,
  filterArr,
  authentication,
  globalQuantity,
  loadMoreLoading,
  loadMore,
  clearAllQty,
  resetClearQty,
  groupArr,
  count,
}) => {


  const { authState } = useContext(AuthContext);
  const router = useRouter();


  const [myProduct, setmyProduct] = useState([]);
  const [addProductLoader, setaddProductLoader] = useState(false);

  useEffect(() => {
    setmyProduct(products);
  }, [products]);

  // console.log("groupArr gridview.....", groupArr);

  const { addItem, getItem } = useCart();
  const inquiryMethods = useInquiry();

  const notify = React.useCallback(({ type, message, image, ID, Toast }) => {
    Toast({ type, message, image, ID });
  }, []);

  //ADD TO CART
  /**
   * @param {} e THIS IS THE EVENT FOR ADD CLICK
   * @param {*} obj OBJ { Product, DefaultPrice(default price set by the supplier), Quantity (Quantity added by customer), BuyIn (buyin UOM)}
   * GET RELEVANT PRICING ACCORDING TO CUSTOMER GROUP
   */
  const handleAddClick = async (e, obj) => {
    //CHECK LOGIN OR NOT
    if (!authState?.isAuthenticated) {
      return router.push({
        pathname: "/Auth",
        query: { type: "Login" },
      });
    }

    
    if (obj?.Quantity <= 0) return;
    setaddProductLoader(true);
    e.stopPropagation();
    let { product } = obj;
    const Toast = (await import("../../components/Toast")).default;
    notify({
      type: "cart",
      message: `${product?.ProductName}, 
      Added to cart`,
      image: `${ResourceApiUrl}${product?.Product_Images[0]?.Image}`,
      ID: product.ID,
      Toast,
    });
    await addItem({
      ...obj,
    });
    setaddProductLoader(false);
  };

  const handleAddInquiry = async (e, product, inputs) => {
    //console.log(inputs);
    //if (obj?.Quantity <= 0) return;
    setaddProductLoader(true);
    e.stopPropagation();

    const Toast = (await import("../../components/Toast")).default;
    notify({
      type: "cart",
      message: `${product?.ProductName}, 
      Added to inquiry`,
      image: `${ResourceApiUrl}${product?.Product_Images[0]?.Image}`,
      ID: product.ID,
      Toast,
    });
    // call inquiry addItem() method
    await inquiryMethods?.addItem(product, inputs);
    setaddProductLoader(false);
  };

  return (
    <div>
      <div className="filter-row">
        {filterArr
          ? filterArr.map((item, index) => {
              return (
                <div
                  className="filter-chip"
                  key={index}
                  onClick={() => removeFilter(item)}
                >
                  <span className="mr-2">{item[Object.keys(item)[0]]}</span>
                  <i class="fa fa-times-circle"></i>
                  {/* <FaRegTimesCircle className="pointer" size={15} />{" "} */}
                </div>
              );
            })
          : null}
      </div>
      <div className="row">
        {isLoading ? (
          <Fragment>
            {[1, 2, 3].map((item, index) => {
              return (
                <div className="col-md-4" key={index}>
                  <ContentLoader
                    width={450}
                    height={400}
                    viewBox="0 0 450 400"
                    backgroundColor="#f0f0f0"
                    foregroundColor="#dedede"
                  >
                    <rect x="43" y="304" rx="4" ry="4" width="200" height="9" />
                    <rect x="44" y="323" rx="3" ry="3" width="90" height="6" />
                    <rect
                      x="42"
                      y="77"
                      rx="10"
                      ry="10"
                      width="200"
                      height="217"
                    />
                  </ContentLoader>
                </div>
              );
            })}
          </Fragment>
        ) : (
          <Fragment>
            {myProduct && myProduct.length ? (
              <Fragment>
                {myProduct.map((obj, index) => {
                  return (
                    <ProductCard
                      product={obj}
                      key={index}
                      authentication={authentication}
                      globalQuantity={globalQuantity}
                      handleAddClick={handleAddClick}
                      clearAllQty={clearAllQty}
                      resetClearQty={resetClearQty}
                      groupArr={groupArr}
                      addProductLoader={addProductLoader}
                      handleAddInquiry={handleAddInquiry}
                      getItem={getItem}
                    />
                  );
                })}
              </Fragment>
            ) : (
              <div className="text-center w-100">
                <Lottie data={animationData.default} height={400} width={400} />
                <p>No products found!</p>
              </div>
            )}
          </Fragment>
        )}
      </div>
      <div className="text-center mt-5">
        <Conditional condition={myProduct?.length}>
          <Conditional
            condition={products.length < count}
            elseComponent={<p>All products loaded !</p>}
          >
            <Button
              variant="primary"
              onClick={loadMore}
              loading={loadMoreLoading}
            >
              Load More
            </Button>
          </Conditional>
        </Conditional>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GridView);
