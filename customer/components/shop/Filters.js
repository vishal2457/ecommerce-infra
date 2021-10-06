import React, { useState } from "react";
import { connect } from "react-redux";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";
import { SliderRail, Handle, Track } from "../slider";
import ContentLoader from "react-content-loader";
import { CgSearch } from "react-icons/cg";
import { Fragment } from "react";
import { FILTER_KEY, getLocalStorage } from "../../utility/commonUtility";

import { Input } from "../UI";

import dynamic from "next/dynamic";
const Supplier = dynamic(() =>
  import("./Supplier").then((mod) => mod.Supplier)
);

const sliderStyle = {
  position: "relative",
  width: "100%",
};

export const Filters = ({
  filters,
  filtersLoading,
  onFilter,
  handleGlobalQuantity,
  slider,
  onChangeSlider,
  onUpdateSlider,
  suppliers,
  supplierSearch,
  toggleSupplierSearch,
  filterSearch,
  toggleFilters,
  onSearch,
  onToggleSearch,
  globalQuantity,
  clearGlobalInput,
  size,
  onChangeSize,
}) => {
  const [filterDiv, setfilterDiv] = useState({});

  const checkDivfunc = () => {
    if (!Object.keys(filterDiv).length) {
      return false;
    }
    let res = false;
    for (const iterator of Object.keys(filterDiv)) {
      if (filterDiv[iterator]) {
        res = true;
      }
    }
    return res;
  };

  const checkDivOpen = React.useMemo(() => {
    return checkDivfunc();
  });

  const { domain, values, reversed } = slider;

  //console.log("SIZE == ", size);

  const formatCategoryName = (name) => {
    // console.log(name);
    switch (name) {
      case "ProductGroup":
        return "Group";
      case "ProductSubgroup":
        return "Sub Group";
      case "PaperClass":
        return "Class";
      case "PaperQuality":
        return "Quality";
      case "PaperPrintibility":
        return "Printability";
      case "PaperColor":
        return "Color";
      case "MeasurementUnit":
        return "Unit";
      case "PaperGrain":
        return "Grain";
      case "PaperColor":
        return "Color";
      default:
        return "Name";
    }
  };

  const showFilterDiv = (filterKey) => {
    setfilterDiv({ [filterKey]: true });
  };
  const hideFilterDiv = (filterKey) => {
    setfilterDiv({ [filterKey]: false });
  };

  const changeSlider = (e) => {
    console.log(e.target.name, e.target.value);
  };

  return (
    <div className={`side_bar kategorien ${checkDivOpen ? "" : "scrolled"}`}>
      <div className="sidefilter">
        <div className="category">
          <h3 className="pb-3">FILTER GRAMATUREN</h3>
          <div className="category_list">
            <Slider
              mode={2}
              step={1}
              domain={domain}
              reversed={reversed}
              rootStyle={sliderStyle}
              onUpdate={onUpdateSlider}
              onChange={onChangeSlider}
              values={values}
            >
              <Rail>
                {({ getRailProps }) => (
                  <SliderRail getRailProps={getRailProps} />
                )}
              </Rail>
              <Handles>
                {({ handles, getHandleProps }) => (
                  <div className="slider-handles">
                    {handles.map((handle, index) => (
                      <Handle
                        index={index}
                        key={handle.id}
                        handle={handle}
                        domain={domain}
                        getHandleProps={getHandleProps}
                      />
                    ))}
                  </div>
                )}
              </Handles>
              <Tracks left={false} right={false}>
                {({ tracks, getTrackProps }) => (
                  <div className="slider-tracks">
                    {tracks.map(({ id, source, target }) => (
                      <Track
                        key={id}
                        source={source}
                        target={target}
                        getTrackProps={getTrackProps}
                      />
                    ))}
                  </div>
                )}
              </Tracks>
            </Slider>
            <h3 className="pb-3 pt-4">
              {/* g/m2 :
              <span>
                {values[0]} - {values[1]}
              </span> */}
              <div className="row">
                <div className="col-md-2">g/m2</div>
                <div className="col-md-4">
                  <Input
                    type="number"
                    name={0}
                    value={values[0]}
                    onChange={(e) =>
                      onUpdateSlider([e.target.value, values[1]])
                    }
                    className=""
                  />
                </div>
                <div className="col-md-4">
                  <Input
                    type="number"
                    name={1}
                    value={values[1]}
                    onChange={(e) =>
                      onUpdateSlider([values[0], e.target.value])
                    }
                    className=""
                  />
                </div>
              </div>
            </h3>
            <h3 className="pb-3 pt-4">
              SIZE FILTERS <small>(in mm)</small>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">
                      <small>Range</small>
                    </th>
                    <th scope="col">
                      <small>START</small>
                    </th>
                    <th scope="col">
                      <small>END</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <small>Length</small>
                    </th>
                    <th scope="row">
                      <Input
                        type="number"
                        name="length"
                        value={size.length[0]}
                        onChange={(e) =>
                          onChangeSize({
                            ...size,
                            length: [e.target.value, size.length[1]],
                          })
                        }
                        className=""
                      />
                    </th>
                    <td>
                      <Input
                        type="number"
                        name="length"
                        value={size.length[1]}
                        onChange={(e) =>
                          onChangeSize({
                            ...size,
                            length: [size.length[0], e.target.value],
                          })
                        }
                        className=""
                      />
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <small>Width</small>
                    </th>
                    <th scope="row">
                      <Input
                        type="number"
                        name="width"
                        value={size.width[0]}
                        onChange={(e) =>
                          onChangeSize({
                            ...size,
                            width: [e.target.value, size.width[1]],
                          })
                        }
                        className=""
                      />
                    </th>
                    <td>
                      <Input
                        type="number"
                        name="width"
                        value={size.width[1]}
                        onChange={(e) =>
                          onChangeSize({
                            ...size,
                            width: [size.width[0], e.target.value],
                          })
                        }
                        className=""
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </h3>
          </div>
        </div>
        <div className="category">
          <div className="category_list">
            {filtersLoading ? (
              <Fragment>
                {filters &&
                  Object.keys(filters).map((filterKey, headIndex) => {
                    return (
                      <div key={headIndex} className="my-3">
                        <ContentLoader
                          width={320}
                          height={30}
                          viewBox="180 0 1500 200"
                          backgroundColor="#f5f5f5"
                          foregroundColor="#dbdbdb"
                        >
                          <rect
                            x="114"
                            y="52"
                            rx="6"
                            ry="6"
                            width="800"
                            height="70"
                          />
                          <rect
                            x="1"
                            y="35"
                            rx="0"
                            ry="0"
                            width="100"
                            height="100"
                          />
                        </ContentLoader>
                      </div>
                    );
                  })}
              </Fragment>
            ) : (
              <Fragment>
                {filters &&
                  Object.keys(filters).map((filterKey, headIndex) => {
                    return (
                      <div
                        key={headIndex}
                        className="my-3"
                        style={{ position: "relative" }}
                      >
                        {filterSearch[filterKey]?.active ? (
                          <div className="filter-search">
                            <div className="form-group">
                              <input
                                className="form-control"
                                name={filterKey}
                                placeholder="Search"
                                onChange={onSearch}
                                autoFocus
                              />
                            </div>
                            <span
                              className="filterSearchBox text-center pt-1 pointer"
                              onClick={() => {
                                toggleFilters(filterKey);
                                onToggleSearch(filterKey);
                              }}
                            >
                              <i className="fa fa-times" />
                            </span>
                          </div>
                        ) : (
                          <div className="filter-search">
                            <p className="h5">
                              {/* <CgMenuGridO size={15} /> */}
                              <span className="ml-1 filter-heading">
                                {" "}
                                {formatCategoryName(filterKey)}
                              </span>
                            </p>
                            {filters[filterKey]?.length > 5 ?    <div
                              className="filterSearchBox text-center pt-1 pointer"
                              onClick={() => {
                                toggleFilters(filterKey);
                              }}
                            >
                              <CgSearch size={15} />
                            </div> : null }
                         
                          </div>
                        )}
                        <ul className="filter-scroll">
                          {filters[filterKey] &&
                            filters[filterKey].map((childKey, index) => {
                              return (
                                <li key={index}>
                                  <div className="form-check ml-4">
                                    <input
                                      type="checkbox"
                                      checked={
                                        getLocalStorage(FILTER_KEY).filter(
                                          function (e) {
                                            return (
                                              e[Object.keys(e)[0]] ==
                                              childKey[filterKey]
                                            );
                                          }
                                        ).length > 0
                                      }
                                      className="form-check-input pointer"
                                      name={childKey.ID}
                                      onChange={(e) =>
                                        onFilter(
                                          e,
                                          filterKey,
                                          childKey[filterKey]
                                        )
                                      }
                                      id={childKey[filterKey]}
                                    />
                                    <label
                                      className="form-check-label capitalize pointer"
                                      htmlFor={childKey[filterKey]}
                                    >
                                      {childKey[filterKey]}
                                    </label>
                                  </div>
                                </li>
                              );
                            })}
                        </ul>

                        {filters[filterKey]?.length > 5 ? (
                          <div
                            className="filter_view_more"
                            onClick={() => showFilterDiv(filterKey)}
                          >
                            <i className="fa fa-plus" />{" "}
                            {filters[filterKey]?.length - 5} more
                          </div>
                        ) : null}

                        {filterDiv[filterKey] ? (
                          <div className="filter_view_more_div">
                            <div className="filter-search">
                              <div className="row">
                                <div className="col-md-8">
                                  <p className="h5">
                                    <span className="ml-1 filter-heading">
                                      {" "}
                                      {formatCategoryName(filterKey)}
                                    </span>
                                  </p>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <input
                                      className="form-control"
                                      name={filterKey}
                                      placeholder="Search"
                                      onChange={onSearch}
                                    />
                                  </div>
                                  <span
                                    className="filterSearchBox text-center pt-1 pointer"
                                    onClick={() => hideFilterDiv(filterKey)}
                                  >
                                    <i className="fa fa-times" />
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* {
                                filterSearch[filterKey]?.active ? (
                                  <div className="filter-search">
                                    <div className="form-group">
                                      <input
                                        className="form-control"
                                        name={filterKey}
                                        placeholder="Search"
                                        onChange={onSearch}
                                        autoFocus
                                      />
                                    </div>
                                    <span
                                      className="filterSearchBox text-center pt-1 pointer"
                                      onClick={() => {
                                        toggleFilters(filterKey);
                                        onToggleSearch(filterKey);
                                      }}
                                    >
                                      <i className="fa fa-times" />
                                    </span>
                                  </div>
                                ) : (
                                  <div className="filter-search">
                                    <p className="h5">
                                      <span className="ml-1 filter-heading">
                                        {" "}
                                        {formatCategoryName(filterKey)}
                                      </span>
                                    </p>
                                    <div
                                      className="filterSearchBox text-center pt-1 pointer"
                                      onClick={() => {
                                        toggleFilters(filterKey);
                                      }}
                                    >
                                      <CgSearch size={15} />
                                    </div>
                                  </div>
                                )
                              } */}

                            <ul className="shop_more_filters">
                              {filters[filterKey] &&
                                filters[filterKey].map((childKey, index) => {
                                  return (
                                    <li key={index}>
                                      <div className="form-check ml-4">
                                        <input
                                          type="checkbox"
                                          checked={
                                            getLocalStorage(FILTER_KEY).filter(
                                              function (e) {
                                                return (
                                                  e[Object.keys(e)[0]] ==
                                                  childKey[filterKey]
                                                );
                                              }
                                            ).length > 0
                                          }
                                          className="form-check-input pointer"
                                          name={childKey.ID}
                                          onChange={(e) =>
                                            onFilter(
                                              e,
                                              filterKey,
                                              childKey[filterKey]
                                            )
                                          }
                                          id={childKey[filterKey]}
                                        />
                                        <label
                                          className="form-check-label capitalize pointer"
                                          htmlFor={childKey[filterKey]}
                                        >
                                          {childKey[filterKey]}
                                        </label>
                                      </div>
                                    </li>
                                  );
                                })}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
              </Fragment>
            )}
          </div>
        </div>
        <div className="category">
          <h3>QUANTITY</h3>
          <div className="filter-search">
            <div className="form-group">
              <input
                type="number"
                className="form-control"
                placeholder="Quantity"
                value={globalQuantity ? globalQuantity : ""}
                onChange={handleGlobalQuantity}
              />
            </div>
            {globalQuantity ? (
              <span
                className="filterSearchBox text-center pt-1 pointer"
                onClick={clearGlobalInput}
              >
                <i className="fa fa-times" />
              </span>
            ) : null}
          </div>
          {/* <div className="dropdown mt-3 ">
            <input
              type="number"
              className="form-control"
              placeholder="Quantity"
              onChange={handleGlobalQuantity}
            />
          </div> */}
        </div>
        <div className="category">
          {/* <h3 className="pb-3">KATEGORIEN</h3> */}
          <div className="category_list">
            {filtersLoading ? (
              <Fragment>
                {filters &&
                  Object.keys(filters).map((filterKey, headIndex) => {
                    return (
                      <div key={headIndex} className="my-3">
                        <ContentLoader
                          width={320}
                          height={30}
                          viewBox="180 0 1500 200"
                          backgroundColor="#f5f5f5"
                          foregroundColor="#dbdbdb"
                        >
                          <rect
                            x="114"
                            y="52"
                            rx="6"
                            ry="6"
                            width="800"
                            height="70"
                          />
                          <rect
                            x="1"
                            y="35"
                            rx="0"
                            ry="0"
                            width="100"
                            height="100"
                          />
                        </ContentLoader>
                        <ul></ul>
                      </div>
                    );
                  })}
              </Fragment>
            ) : (
              <Supplier
                suppliers={suppliers}
                supplierSearch={supplierSearch}
                toggleSupplierSearch={toggleSupplierSearch}
                onFilter={onFilter}
              />
            )}
          </div>
        </div>
        {/* <div className="category">
          <h3 className="pb-3">GRAFISCHE PAPIERE</h3>
          <div className="category_list">
            <button className="btn active">
              <i class="fa fa-long-arrow-right"></i> All
            </button>
            <button className="btn">
              <i class="fa fa-long-arrow-right"></i> Gestrichene Papiere
            </button>
            <button className="btn">
              <i class="fa fa-long-arrow-right"></i> Natur-Papiere
            </button>
            <button className="btn">
              <i class="fa fa-long-arrow-right"></i> Recycling Papiere
            </button>
            <button className="btn">
              <i class="fa fa-long-arrow-right"></i> Geschäftsausstattungen
            </button>
            <button className="btn">
              <i class="fa fa-long-arrow-right"></i> Image-Papier Feinkarton
            </button>
            <button className="btn">
              <i class="fa fa-long-arrow-right"></i> Werkdruck-Papiere
            </button>
            <button className="btn">
              <i class="fa fa-long-arrow-right"></i> Etikettenpapiere
            </button>
          </div>
        </div> */}
        {/* <div className="category">
          <h3 className="pb-3">PAPIERFINDER</h3>
          <div className="dropdown mt-3 ">
            <DropdownButton
              className="w-100"
              id="dropdown-item-button"
              title="grafische Papiere"
            >
              <Dropdown.ItemText>Dropdown item text</Dropdown.ItemText>
              <Dropdown.Item as="button">Action</Dropdown.Item>
              <Dropdown.Item as="button">Another action</Dropdown.Item>
              <Dropdown.Item as="button">Something else</Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
        <div className="category">
          <h3 className="pb-3 pt-4">AUSWAHL PRODUKT</h3>
          <div className="row">
            {buttons.map((btn) => {
              return (
                <div className="button_group">
                  <button className="btn btn-white small_btn ">
                    {btn.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="category">
          <h3 className="pb-3 pt-4">AUSWAHL TECHNOLOGIE</h3>
          <div className="row">
            {buttons.map((btn) => {
              return (
                <div className="button_group">
                  <button className="btn btn-white small_btn">
                    {btn.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="category">
          <h3 className="pb-3 pt-4">AUSWAHL HERSTELLER</h3>
          <div className="row">
            <div className="button_group">
              <button className="btn btn-red">Mondi</button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
