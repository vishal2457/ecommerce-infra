import { Fragment, useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import Header from "../layout/Header";
import ShopHeader from "../components/shop/Header";
import api from "../Redux/api";
import { useRouter } from "next/router";

import {
  setInitialFilters,
  setFilters,
  removeFilters,
  getProducts,
  gsmFilter,
  onChange,
  onUpdate,
  toggleFilters,
  queryString,
  getCustomerGroups,
  emptyProducts,
  getFilteredProducts,
  toggleShopType,
  onSizeChange,
  getSearchedProducts,
} from "../Redux/Shop/actions";
import {
  FILTER_KEY,
  getLocalStorage,
  PRICE_EXCULSIVE_MESSAGE,
  SHOP_TYPE,
} from "../utility/commonUtility";
import { useFirstRender } from "../utility/useFirstRender";
import dynamic from "next/dynamic";
import { AuthContext } from "../contexts/auth/auth.context";
import { toast } from "react-toastify";
const Footer = dynamic(() => import("../layout/Footer"));
const Dropdown = dynamic(() =>
  import("../components/UI").then((mod) => mod.DropdownCustom)
);
const GridView = dynamic(() =>
  import("../components/shop/GridView").then((mod) => mod.GridView)
);
const ListView = dynamic(() =>
  import("../components/shop/ListView").then((mod) => mod.ListView)
);
const Filters = dynamic(() =>
  import("../components/shop/Filters").then((mod) => mod.Filters)
);
const limit = 9;

//MAIN FUNCTION
function Shop(props) {
  const router = useRouter();

  // const { authState, authDispatch } = useContext(AuthContext);
  const firstRender = useFirstRender();
  const [state, setState] = useState({
    view: "Grid",
    obj: null,
    products: [],
    filterState: true,
    globalQuantity: null,
    supplierSearch: false,
    clearAllQty: false,
    page: 1,
  });
  const [isLoading, setisLoading] = useState(true);
  const [filtersLoading, setfiltersLoading] = useState(true);
  const [loadMoreLoading, setloadMoreLoading] = useState(false);
  const { authState } = useContext(AuthContext);
  const [filterDiv, setfilterDiv] = useState(false);
  const [groupArr, setgroupArr] = useState([]);
  const [suppliers, setsuppliers] = useState([]);
  const [dropDownValues, setdropDownValues] = useState({
    ProductGroup: [],
    ProductSubgroup: [],
    PaperClass: [],
    PaperQuality: [],
    PaperPrintibility: [],
    PaperColor: [],
    MeasurementUnit: [],
    PaperGrain: [],
    MeasurementUnit: [],
  });
  const [intialFilterValues, setintialFilterValues] = useState({});

  useEffect(() => {
    // console.log(props);
    const { getProducts, emptyProducts } = props;
    (async () => {
      emptyProducts(); //empty product on initial render
      let obj = dropDownValues;
      for (let property of Object.keys(dropDownValues)) {
        await api.get(`/master/getAll${property}/${property}`).then((res) => {
          obj[property] = res.data.data;
        });
      }

      if (authState.isAuthenticated) {
        /**
         * @Get_Customer_Groups
         */
        await api
          .get("/CustomerGroups/getAllGroupsForCustomer")
          .then((res) => {
            setgroupArr(res.data.data);
          })
          .catch((err) => {
            console.log(err, "get customer error");
            setgroupArr([]);
          });
      }

      await api
        .post(`/supplier/getSupplier`, { limit: 10, page: 1 })
        .then((res) => {
          setsuppliers(res.data.data.rows);
        });

      // when shop not come from search-suggestion
      if(!router.query.type){
        await getProducts({
          filter: getLocalStorage(FILTER_KEY),
          value: props.Shop.values,
          size: props.Shop.size,
          limit,
          page: 1,
        });
      } 
      setdropDownValues(obj);
      setintialFilterValues(obj);
      setisLoading(false);
      setfiltersLoading(false);
      // setState({obj:localStorage.getItem("filters") ? localStorage.getItem("filters") : localStorage.setItem("filters", JSON.stringify({})) })
    })();
    return () => {};
  }, []);

  //run when search-suggestion clicked
  useEffect(() => {
    const { type, keyword } = router.query;
    if (type == 'search' && keyword) {
      (async () => {
        await props.getSearchedProducts({ keyword });
        setisLoading(false);
      })();
    }

    return () => {};
  }, [router]);


  //run when filter is changed
  useEffect(() => {
    const { setInitialFilters, getFilteredProducts } = props;
    setInitialFilters();
    if (!firstRender) {
      (async () => {
        await getFilteredProducts({
          filter: getLocalStorage(FILTER_KEY),
          value: props.Shop.values,
          size: props.Shop.size,
          limit,
          page: 1,
        });
        setisLoading(false);
      })();
    }

    return () => {};
  //}, [state.filterState, router, props.Shop.size]);
  }, [state.filterState, props.Shop.size]);

  // const toggleForm = () =>
  // setState({ view: state.view == "Grid" ? "List" : "Grid" });
  const selectFilter = (e, filterKey, name) => {
    props.emptyProducts();
    setisLoading(true);
    setState({ ...state, filterState: !state.filterState, page: 1 });
    if (e.target.checked) {
      props.setFilters({ [filterKey]: name, ID: e.target.name });
    } else {
      props.removeFilters({ [filterKey]: name, ID: e.target.name });
    }
  };

  const removeFilterChip = (filterObj) => {
    setState({ ...state, filterState: !state.filterState });
    props.removeFilters(filterObj);
  };

  //onpage change
  const onPageChange = (page) => {
    const pageCount = page.selected + 1;
    setpage({ number: pageCount });
    scrollTo(0, 500);
    // props.getProducts({
    //   filter: getLocalStorage(FILTER_KEY),
    //   value: props.Shop.values,
    //   size: props.Shop.size,
    //   limit,
    //   page: pageCount,
    // });
  };

  //filter search
  const onSearch = async ({ target }) => {
    queryString(target.name, target.value);
    const Fuse = (await import("fuse.js")).default;
    for (let filterKey of Object.keys(dropDownValues)) {
      if (filterKey == target.name) {
        var fuse = new Fuse(dropDownValues[filterKey], {
          keys: [filterKey],
          includeScore: true,
        });
      }
    }
    const results = fuse.search(target.value);
    if (!target.value) {
      setdropDownValues({
        ...dropDownValues,
        [target.name]: intialFilterValues[target.name],
      });
    } else {
      setdropDownValues({
        ...dropDownValues,
        [target.name]: results.map((character) => character.item),
      });
    }
  };



  /**
   * @Load_More_Products
   */
  const loadMore = async () => {
    setloadMoreLoading(true);
    setState({ ...state, page: state.page + 1 });
    await props.getProducts({
      filter: getLocalStorage(FILTER_KEY),
      value: props.Shop.values,
      size: props.Shop.size,
      limit,
      page: state.page + 1,
    });

    setloadMoreLoading(false);
  };

  const { domain, values, reversed, update, type } = props.Shop;

  const showFilterDiv = () => {
    setfilterDiv(true);
  };
  const hideFilterDiv = () => {
    setfilterDiv(false);
  };

  return (
    <Fragment>
      <Header />
      <ShopHeader />
      <div className="container shop">
        {/* <div className="row shop-list"> */}
        <Filters
          supplierSearch={state.supplierSearch}
          toggleSupplierSearch={() =>
            setState({ ...state, supplierSearch: !state.supplierSearch })
          }
          filters={dropDownValues}
          suppliers={suppliers}
          slider={{ domain, values, reversed, update }}
          onChangeSlider={(values) => {
            props.onChange(values);
            setState({ ...state, filterState: !state.filterState });
          }}
          onUpdateSlider={props.onUpdate}
          filtersLoading={filtersLoading}
          onFilter={selectFilter}
          toggleFilters={props.toggleFilters}
          filterSearch={props.Shop.filterSearch}
          handleGlobalQuantity={(e) => {
            setState({
              ...state,
              globalQuantity: e.target.value,
              clearAllQty: true,
            });
          }}
          globalQuantity={state?.globalQuantity}
          clearGlobalInput={() => setState({ ...state, globalQuantity: null })}
          onSearch={onSearch}
          onToggleSearch={(filterKey) =>
            setdropDownValues({
              ...dropDownValues,
              [filterKey]: intialFilterValues[filterKey],
            })
          }
          size={props.Shop.size}
          onChangeSize={props.onSizeChange}
        />
        <div className="shop_product_list featured">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <p className="px-2 pointer d-none d-sm-block">
                <i
                  className={`fa fa-th active-box fa-2x ${type == SHOP_TYPE.GRID ? 'text-danger' : ''}`}
                  onClick={() => props.toggleShopType(SHOP_TYPE.GRID)}
                ></i>
              </p>
              <p className="px-2 pointer d-none d-sm-block">
                <i
                  className={`fa fa-th-list active-box fa-2x ${type == SHOP_TYPE.LIST ? 'text-danger' : ''}`}
                  onClick={() => props.toggleShopType(SHOP_TYPE.LIST)}
                ></i>
              </p>
              {/* <div className="d-none d-sm-block">
                <Dropdown />
              </div> */}
              <div className="d-none d-sm-block">
                {state.clearAllQty ? null : (
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => setState({ ...state, clearAllQty: true })}
                  >
                    Clear All Quantity
                  </button>
                )}
              </div>
            </div>
            <div className="button_container">
              <div className="p-0">
                <Dropdown />
              </div>
              <div>
                {state.clearAllQty ? null : (
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => setState({ ...state, clearAllQty: true })}
                  >
                    Clear All Quantity
                  </button>
                )}
              </div>
            </div>
            <h4 className="">
              Showing &nbsp;
              {props.Shop.products.count > 10
                ? `1-${limit}`
                : `1-${
                    props.Shop.products.count
                      ? Math.ceil(JSON.parse(props.Shop.products.count))
                      : 0
                  }`}
              &nbsp;of&nbsp;
              {props.Shop.products.count
                ? Math.ceil(JSON.parse(props.Shop.products.count))
                : 0}{" "}
              &nbsp;results
              <br />
              <small className="text-danger ">{PRICE_EXCULSIVE_MESSAGE}</small>
            </h4>

            <i class="fa fa-filter shop_filter" onClick={showFilterDiv}></i>
            {filterDiv ? (
              <div className="shop_filter_div">
                <div className="shop_filter_close">
                  <i class="fa fa-times" onClick={hideFilterDiv}></i>
                </div>

                <Filters
                  supplierSearch={state.supplierSearch}
                  toggleSupplierSearch={() =>
                    setState({
                      ...state,
                      supplierSearch: !state.supplierSearch,
                    })
                  }
                  filters={dropDownValues}
                  suppliers={suppliers}
                  slider={{ domain, values, reversed, update }}
                  onChangeSlider={(values) => {
                    props.onChange(values);
                    setState({ ...state, filterState: !state.filterState });
                  }}
                  onUpdateSlider={props.onUpdate}
                  isLoading={isLoading}
                  onFilter={selectFilter}
                  toggleFilters={props.toggleFilters}
                  filterSearch={props.Shop.filterSearch}
                  handleGlobalQuantity={(e) => {
                    setState({
                      ...state,
                      globalQuantity: e.target.value,
                      clearAllQty: true,
                    });
                  }}
                  globalQuantity={state?.globalQuantity}
                  clearGlobalInput={() =>
                    setState({ ...state, globalQuantity: null })
                  }
                  onSearch={onSearch}
                  onToggleSearch={(filterKey) =>
                    setdropDownValues({
                      ...dropDownValues,
                      [filterKey]: intialFilterValues[filterKey],
                    })
                  }
                  size={props.Shop.size}
                  onChangeSize={props.onSizeChange}
                />
              </div>
            ) : (
              ""
            )}
          </div>
          {type == SHOP_TYPE.GRID ? (
            <GridView
              products={props.Shop.products}
              // totalCount={props.Shop.products.count}
              limit={limit}
              isLoading={isLoading}
              removeFilter={removeFilterChip}
              filterArr={props.Shop.filters}
              authentication={false}
              globalQuantity={state.globalQuantity}
              onPageChange={onPageChange}
              clearAllQty={state.clearAllQty}
              resetClearQty={() => setState({ ...state, clearAllQty: false })}
              groupArr={groupArr}
              page={state.page}
              loadMore={loadMore}
              loadMoreLoading={loadMoreLoading}
              count={props.Shop.count}
            />
          ) : (
          <ListView
          products={props.Shop.products}
          // totalCount={props.Shop.products.count}
          limit={limit}
          isLoading={isLoading}
          removeFilter={removeFilterChip}
          filterArr={props.Shop.filters}
          authentication={false}
          globalQuantity={state.globalQuantity}
          onPageChange={onPageChange}
          clearAllQty={state.clearAllQty}
          resetClearQty={() => setState({ ...state, clearAllQty: false })}
          groupArr={groupArr}
          page={state.page}
          loadMore={loadMore}
          loadMoreLoading={loadMoreLoading}
          count={props.Shop.count}          
          />
          )}
        </div>
      </div>
      {/* </div> */}
      <Footer />
    </Fragment>
  );
}
const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = {
  setInitialFilters,
  setFilters,
  removeFilters,
  getProducts,
  gsmFilter,
  onUpdate,
  onChange,
  toggleFilters,
  queryString,
  getCustomerGroups,
  emptyProducts,
  getFilteredProducts,
  toggleShopType,
  onSizeChange,
  getSearchedProducts,
};
export default connect(mapStateToProps, mapDispatchToProps)(Shop);
