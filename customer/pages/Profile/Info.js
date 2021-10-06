import React, { useState, useEffect } from "react";
import Account from "../../components/profile/account/Account";
import CommonProfile from "../../components/profile/CommonProfile";
import api from "../../Redux/api";

function Info() {
  const [userDataArr, setuserDataArr] = useState({});
  const [AddressArr, setAddressArr] = useState([]);
  const [isEdit, setisEdit] = useState(false);

  const getAllAdddress = () => {
    api.get("/address/getAll").then((res) => {
      if (res?.data?.status) {
        setAddressArr(res?.data?.data);
      }
    }).catch(err => console.log(err))
  }

  useEffect(() => {
    var user_data = JSON.parse(localStorage.getItem("USER_DATA"));
    var reqBody = {
      email: user_data.email,
      id: user_data.id,
      name: user_data.name,
      reference_id: user_data.reference_id,
      role_id: user_data.role_id,
    };

    api.post("/profile/getUserProfile", reqBody).then((res) => {
      if (res?.data?.status) {
        setuserDataArr(res?.data?.data);
        console.log(res.data.data);
      }
    });

    getAllAdddress()

    return () => {};
  }, []);

  function editProfile() {
    setisEdit(true);
  
  }

  function updateProfile() {
    setisEdit(false);
  }
  return (
    <CommonProfile active="info" inProfileInfo={true} ButtonAction={isEdit ? updateProfile : editProfile} isEdit={isEdit}>
      <Account
        isEdit={isEdit}
        userDataArr={userDataArr}
        AddressArr={AddressArr}
        getAllAdddress ={getAllAdddress}
      />
    </CommonProfile>
  );
}

export default Info;
