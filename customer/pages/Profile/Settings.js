import React from "react";
import CommonProfile from "../../components/profile/CommonProfile";

import ChangePassword from "../../components/profile/settings/ChangePassword";

function Settings() {
  return (
    <CommonProfile active="settings">
      <ChangePassword />
      <p>Feedback</p>
      <p>Report a bug !</p>
    </CommonProfile>
  );
}

export default Settings;
