import React, { Fragment } from "react";
import { Dropdown, DropdownButton, Spinner } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";

export const Button = (props) => {
  const { children, variant, onClick, type, className, disabled, loading } = props;
  return (
    <button  className={`btn btn-sm btn-${variant} ${className}`} onClick={onClick} disabled={disabled || loading} type={type} >
      {loading ? (
        <>
          <Spinner
            as="span"  
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          {/* Loading... */}
        </>
      ) : (
        <>{children} </>
      )}
    </button>
   
  );
};

const renderInput = (props) => {
  const {
    onChange,
    type,
    placeholder,
    name,
    className,
    value,
    disabled,
    arr,
    bindValue,
    bindName,
    multiple,
    id,
  } = props;
  switch (props.type) {
    case "textarea":
      return (
        <textarea
          className={`form-control form-control-sm rounded-border ${className}`}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        ></textarea>
      );
    case "dropdown":
      return (
        <Dropdown
          arr={arr}
          bindName={bindName}
          bindValue={bindValue}
          disabled={disabled}
          onChange={onChange}
          name={name}
          className={className}
        />
      );
    case "checkbox":
      return (
        <input
          className={`form-check-input ${className}`}
          type={type}
          placeholder={placeholder}
          name={name}
          checked={value}
          disabled={disabled}
          onChange={onChange}
           id={id}
        />
      );
    case "radio":
      return (
        <input
          className={`form-check-input form-control-sm ${className}`}
          type={type}
          placeholder={placeholder}
          name={name}
          checked={value}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "file":
      return (
        <input
          className={`form-control ${className}`}
          type={type}
          name={name}
          multiple={multiple}
          onChange={onChange}
        />
      );
    default:
      return (
        <input
          className={`form-control form-control-sm rounded-border ${className}`}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      );
  }
};

export const Input = (props) => {
  return <Fragment>{renderInput(props)}</Fragment>;
};

export const Label = (props) => {
  const { className, label, required, forLabel } = props;
  return (
    <label className={`main-label text-muted ${className}`} htmlFor={forLabel}>
      {label}
      {required ? <span style={{ color: "red" }}>*</span> : null}
    </label>
  );
};

export const Card = (props) => {
  const { children, className, onClick } = props;
  return <div onClick={onClick} className={`card ${className}`}>{children}</div>;
};

export const CardHeader = (props) => {
  const { children, className } = props;
  return (
    <div className="card-header">
      <div className={`card-title ${className}`}> {children} </div>
    </div>
  );
};

export const CardBody = ({ children, className }) => {
  return <div className={`card-body ${className}`}>{children}</div>;
};

export const DropdownCustom = (props) => {

  return (
    <DropdownButton
    className="shop-buttons pr-2"
    id="dropdown-item-button"
    title="Featured"
  >
    <Dropdown.ItemText>Dropdown item text</Dropdown.ItemText>
    <Dropdown.Item as="button">Action</Dropdown.Item>
    <Dropdown.Item as="button">Another action</Dropdown.Item>
    <Dropdown.Item as="button">Something else</Dropdown.Item>
  </DropdownButton>
  );
};

export const ReactSelectDropdown = (props) => {
  var {
    onChange,
    arr,
    bindValue,
    bindName,
    disabled,
    name,
    placeholder,
    isMulti,
    value,
    isClearable
  } = props;

  const animatedComponents = makeAnimated();
  const customStyles = {
   
    control: () => ({
      alignItems: "center",
      backgroundColor: "#ffffff",
      border: "solid 1px #cccccc",
      borderRadius: "0.5rem",
      justifyContent: "space-between",
      maxHeight: "32px",
      position: "relative",
      transition: "all 100ms",
      boxSizing: "border-box",
      outline: 0,
      display: "flex",
      boxSizing: "border-box",
    }),
   
  };
  return (
    <Fragment>
       {isMulti ? (
          <Select
            options={arr}
            getOptionLabel={(option) => `${option[bindName]}`}
            getOptionValue={(option) => `${option[bindValue]}`}
             value={value}
            components={animatedComponents}
            isDisabled={disabled}
            isSearchable={true}
            placeholder={placeholder}
            onChange={onChange}
            closeMenuOnSelect={!isMulti}
            name={name}
            isMulti={isMulti}
          />
        ) : (
          <Select
          options={arr}
          getOptionLabel={(option) => `${option[bindName]}`}
          getOptionValue={(option) => `${option[bindValue]}`}
          value={arr?.filter((option) => { return option[bindValue] == value})}
          instanceId="ID"
          components={animatedComponents}
          isDisabled={disabled}
          isSearchable={true}
          placeholder={placeholder}
          onChange={onChange}
          name={name}
          styles={customStyles}
          isClearable={isClearable || false}
        />
        )}
     
    </Fragment>
  );
};

export const actionButtonsFunc = (obj) => {
  let icons = {
    edit: { icon: "fa fa-pencil", name: "edit" },
    delete: { icon: "fa fa-trash", name: "delete" },
    view: { icon: "fa fa-eye", name: "view" },
  };
  let arr = [];
  for (let i of Object.keys(obj)) {
    if (obj[i]) arr.push(icons[i]);
  }
  return arr;
};

export const actionButtons = [
  { icon: "fa fa-pencil", name: "edit" },
  { icon: "fa fa-trash", name: "delete" },
  { icon: "fa fa-eye", name: "view" },
];
