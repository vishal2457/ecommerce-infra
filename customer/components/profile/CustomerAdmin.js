import React, { useEffect, useState } from "react";
import { getUser } from "../../utility/commonUtility";

const CustomerAdmin = (WrappedComponents) => ({...props}) => {
let user = getUser()

  if (user?.isAdmin) {
    return <WrappedComponents />;
  } else {
    return <p>You are unauthorized to access this page !</p>;
  }
}

export default CustomerAdmin;
