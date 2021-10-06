import React from "react";
import { ReactSelectDropdown } from "../../UI";
import { SliderRail, Handle, Track, TooltipRail } from "../../slider";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";
import ContentLoader from "react-content-loader";

function Filters({
  dropDownValues,
  handleDropdownChange,
  onChangeSlider,
  onUpdateSlider,
  state,
  onInputChange,
  clearFilter,
  slider,
  filterLoading,
}) {
  const { domain, values, reversed } = slider;

  const filtersApplied = () => {
    const { filterArr, Width, Length, GSM0, GSM1 } = state;
    //! use slider then  uncomment
    // if (
    //   filterArr.length ||
    //   Width ||
    //   Length ||
    //   values[0] != 0 ||
    //   values[1] != 1000
    // )
    //   return true;

    //! use slider then comment

    if (
      filterArr.length ||
      Width ||
      Length ||
      GSM0 != 0 ||
      GSM1 != 1000
    )
      return true;


  };

  return (
    <React.Fragment>
      {filterLoading ? (
        [1, 2].map((item, index) => {
          return (
            <>
              <div className="row mt-4">
                <div className="col-12" key={index}>
                  <ContentLoader viewBox="0 0 480 50">
                    <circle cx="20" cy="20" r="20" />
                    <rect x="80" y="5" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="30" rx="3" ry="3" width="250" height="10" />
                  </ContentLoader>
                </div>
              </div>
            </>
          );
        })
      ) : (
        <>
          <div className="row mt-4">
            {[
              { name: "Group", field: "ProductGroup", type: "dropdown" },
              {
                name: "Sub-Group",
                field: "ProductSubgroup",
                type: "dropdown",
              },
              { name: "Class", field: "PaperClass", type: "dropdown" },
              {
                name: "Quality",
                field: "PaperQuality",
                type: "dropdown",
              },
              { name: "Color", field: "PaperColor", type: "dropdown" },
              {
                name: "Printability",
                field: "PaperPrintibility",
                type: "dropdown",
              },
              { name: "Grain", field: "PaperGrain", type: "dropdown" },
              { name: "Uom", field: "MeasurementUnit", type: "dropdown" },
              // { name: "Gsm", field: "PaperGsm", type: "text", size: "2" },
              { name: "Width", field: "Width", type: "number", size: "2" },
              {
                name: "Length",
                field: "Length",
                type: "number",
                size: "2",
              },
              
            ].map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {item.type == "number" ? (
                    <div className={`col-md-${item?.size ? item?.size : "2"}`}>
                      <div className="form-group">
                        <label>{item.name}</label>
                        <input
                          type={item.type}
                          className="form-control form-control-sm rounded-border"
                          placeholder={item.name}
                          name={item.field}
                          value={state?.[item.field] || ""}
                          onChange={onInputChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>{item.name}</label>
                        <ReactSelectDropdown
                          arr={dropDownValues[item.field]}
                          bindName={item.field}
                          bindValue="ID"
                          name={item.field}
                          value={state.filterArr.filter(
                            (option) => Object.keys(option)[0] == item.field
                          )}
                          isMulti
                          onChange={handleDropdownChange}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* <div className="col-md-4">
              <label className="mb-3">
                GSM{" "}
                <span className="text-dark">{`${values[0]} - ${values[1]}`}</span>{" "}
              </label>
              <Slider
                mode={2}
                step={1}
                domain={domain}
                reversed={reversed}
                onUpdate={onUpdateSlider}
                onChange={onChangeSlider}
                rootStyle={{
                  position: "relative",
                  width: "100%",
                }}
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
            </div> */}

            <div className="col-md-4">
              <div className="row pt-4">
                <div className="col-md-2 pt-1">
                  <label className="mb-3">GSM</label>
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control form-control-sm rounded-border"
                    placeholder="FROM"
                    name="GSM0"
                    value={state?.GSM0}
                    onChange={onInputChange}
                  />
                </div>{"-"}
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control form-control-sm rounded-border"
                    placeholder="TO"
                    name="GSM1"
                    value={state?.GSM1}
                    onChange={onInputChange}
                  />
                </div>
              </div>
            </div>

            {filtersApplied() ? (
              <div className="text-right col-md-4">
                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={clearFilter}
                >
                  {"Clear Filter"}
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </React.Fragment>
  );
}

export default Filters;
