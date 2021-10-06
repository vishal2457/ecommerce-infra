import React from "react";
import { Fragment } from "react";
import { CgSearch } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { connect } from "react-redux";
import { FILTER_KEY, getLocalStorage } from "../../utility/commonUtility";

export const Supplier = ({
  supplierSearch,
  suppliers,
  toggleSupplierSearch,
  onFilter,
}) => {
  const [sup, setsup] = React.useState("");
  React.useEffect(() => {
    setsup(suppliers)
    return () => {};
  }, [supplierSearch]);


//search supplier with fuse
 async function onSearch({ currentTarget }) {
    const Fuse = (await import('fuse.js')).default
    const fuse = new Fuse(suppliers, {
      keys: ["SupplierName"],
      includeScore: true,
    });

    const results = fuse.search(currentTarget.value);
    if(!currentTarget.value) {
      setsup(suppliers)
    }else{
      setsup(results.map((character) => character.item))
    }
  }

  return (
    <Fragment>
      <div className="my-3">
        {supplierSearch ? (
          <div className="filter-search">
            <div className="form-group">
              <input
                className="form-control"
                name="search"
                placeholder="Search"
                onChange={onSearch}
                autoFocus
              />
            </div>
            <span
              className="filterSearchBox text-center pt-1 pointer"
              onClick={toggleSupplierSearch}
            >
              <FaTimes className="pointer" size={15} />{" "}
            </span>
          </div>
        ) : (
          <div className="filter-search">
            <p className="h5 ">
              {/* <CgMenuGridO size={15} /> */}
              <span className="ml-1 filter-heading">Supplier</span>
            </p>
            <div
              className="filterSearchBox text-center pt-1 pointer"
              onClick={toggleSupplierSearch}
            >
              <CgSearch size={15} />
            </div>
          </div>
        )}

        <ul className="filter-scroll">
          {sup &&
            sup.map((supplier, index) => {
              return (
                <li key={index}>
                  <div className="form-check ml-4">
                    <input
                      type="checkbox"
                      checked={
                        getLocalStorage(FILTER_KEY).filter(function (e) {
                          return (
                            e[Object.keys(e)[0]] == supplier.SupplierName &&
                            e.ID == supplier.ID
                          );
                        }).length > 0
                      }
                      className="form-check-input pointer"
                      name={supplier.ID}
                      onChange={(e) =>
                        onFilter(e, "SupplierName", supplier.SupplierName)
                      }
                      id={supplier.ID}
                    />
                    <label
                      className="form-check-label capitalize pointer"
                      htmlFor={supplier.ID}
                    >
                      {supplier.SupplierName}
                    </label>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Supplier);
