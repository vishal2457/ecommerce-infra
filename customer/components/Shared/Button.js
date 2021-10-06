import React from "react";
import { Spinner } from "react-bootstrap";

function Button({ className, loading, onClick, children, disabled, variant }) {
  return (
    <button className={className} onClick={onClick} disabled={disabled || loading} >
      {loading ? (
        <>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </>
      ) : (
        <>{children} </>
      )}
    </button>
  );
}

export default Button;
