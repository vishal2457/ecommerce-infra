import React, { useEffect } from "react";
import CommonProfile from "../../components/profile/CommonProfile";
import Dashboard from "../../components/profile/dashboard/Dashboard";

import Chart from "chart.js";

function Profile() {
  
  return (
    <CommonProfile active="dashboard">
      <Dashboard />
    </CommonProfile>
  );
}

export default Profile;
