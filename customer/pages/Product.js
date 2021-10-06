import React, { Fragment, useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import {
  getProducts,
  overwriteProduct,
  resetStateOnUnmount,
} from "../Redux/Products/actions";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import api from "../Redux/api";
import dynamic from "next/dynamic";
import { AuthContext } from "../contexts/auth/auth.context";
import { TopInfo } from "../components/product/TopInfo";

const InfoTabs = dynamic(() =>
  import("../components/product/InfoTabs").then((mod) => mod.InfoTabs)
);
const Alternativeproducts = dynamic(() =>
  import("../components/product/AlternativeProducts/index").then(
    (mod) => mod.Alternativeproducts
  )
);
const Header = dynamic(() => import("../layout/Header"));
const Footer = dynamic(() => import("../layout/Footer"));

const Products = ({
  getProducts,
  product,
  overwriteProduct,
  productID,
  loading,
  tempProduct,
  noProduct,
  resetStateOnUnmount,
  relatedProducts,
  CustomersPricing,
}) => {
  const router = useRouter();

  const [customerGroups, setcustomerGroups] = useState([]);
  const [routerData, setrouterData] = useState(null);
  const { authState } = useContext(AuthContext);

  const [dropDownValues, setdropDownValues] = useState({
    PaperClass: [],
    PaperQuality: [],
    PaperPrintibility: [],
    PaperColor: [],
    MeasurementUnit: [],
    PaperGrain: [],
    PaperGsm: [],
  });

  const fetchData = async () => {
    let obj = dropDownValues;
    for (let property of Object.keys(dropDownValues)) {
      await api.get(`/master/getAll${property}/${property}`).then((res) => {
        obj[property] = res.data.data;
      });
    }
    await getProductsLocal(router.query.id);
    setdropDownValues(obj);
  };

  useEffect(() => {
    fetchData();
    const { data } = router.query;

    if (data) setrouterData(JSON.parse(data)); //set query Data 

    return () => {
      resetStateOnUnmount();
    };
  }, [router.query.id]);

  //get products
  const getProductsLocal = async (id) => {
    if (authState.isAuthenticated) {
      api
        .get("/CustomerGroups/getAllGroupsForCustomer")
        .then((res) => {
          setcustomerGroups(res?.data?.data);
        })
        .catch((err) => console.log(err));
    }
    getProducts(id, authState.isAuthenticated);
    // checkHost(document.location.host);
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  //ondropdown change
  const onPropertyChange = async (value, action, key) => {
    overwriteProduct({ value, key, product: tempProduct });
  };

  return (
    <Fragment>
      <Header />
      <div className="container products">
        <TopInfo
          product={product}
          dropDownValues={dropDownValues}
          onPropertyChange={onPropertyChange}
          loading={loading}
          tempProduct={tempProduct}
          noProduct={noProduct}
          CustomersPricing={CustomersPricing}
          routerData={routerData}
        />
        <InfoTabs product={product}/>
        {relatedProducts?.length ? (
          <Alternativeproducts
            arr={relatedProducts}
            getProductsLocal={getProductsLocal}
          />
        ) : (
          <div className="text-center">
            {" "}
            <p>No similar products</p>{" "}
          </div>
        )}
      </div>

      <Footer />
    </Fragment>
  );
};

Products.propTypes = {
  getProducts: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  product: state.Products.product,
  productID: state.Products.productID,
  loading: state.Products.loading,
  tempProduct: state.Products.tempProduct,
  noProduct: state.Products.noProduct,
  relatedProducts: state.Products.relatedProducts,
  CustomersPricing: state.Products.CustomersPricing,
});
export default connect(mapStateToProps, {
  getProducts,
  overwriteProduct,
  resetStateOnUnmount,
})(Products);
