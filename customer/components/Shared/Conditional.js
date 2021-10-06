import React from "react";

function Conditional({ condition, elseComponent, children }) {
  const renderElseComponent = (comp) => comp || null;
  return condition ? children : renderElseComponent(elseComponent);
}

export default Conditional;
