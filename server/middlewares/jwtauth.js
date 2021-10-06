const jwt = require("jsonwebtoken");
const config = require("config");
const { User, Customer } = require("../models");

// module.exports = async (req, res, next) => {
//   // Get token from header
//   const token = req.header("Authorization");
//   // console.log(token, "this is token");
//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

//   try {
//     const decoded = jwt.verify(token, config.get("jwtSecret"));
//     req.user = decoded.user;
//     // await User.findOne({where :{ID: req.user.id}}).then(data => {
//     //  // console.log(req.user.code, "this is token code");
//     // //  console.log(data.user_code, "this is db code");
//     //   if(req.user.code != data.user_code) return res.status(401).json({msg: 'Looged in from different browser'})
//     // })

//     next();

//   } catch (err) {
//     console.log(err, "this is error");
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// };

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization");

  //console.log(token, "this is token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    //console.log("req.user ==== ", req.user);
    // if (req.user.role_id == 3) {
    //   await Customer.findOne({ where: { ID: req.user.reference_id } }).then(
    //     (data) => {
    //       // console.log(req.user.user_code, "this is token code");
    //       //  console.log(data, "this is db code");
    //       if (req.user.user_code != data.UserCode)
    //         return res
    //           .status(401)
    //           .json({ msg: "Logged in from different browser" });
    //     }
    //   );
    // }

    next();
  } catch (err) {
    console.log(err, "this is error");

    // checking user is customer ,  making UserCode = NULL When Token expire automatic OR runnign catch block
    // hasmukh (16/12/2020)

    // if (req.user.role_id == 3) {
    //   await Customer.update(
    //     { UserCode: null },
    //     { where: { ID: req.user.reference_id } }
    //   ).then((data) => {
    //     console.log("UserCode field upadated with NULL in Customer Table");
    //   });
    // }

    res.status(401).json({ msg: "Token is not valid" });
  }
};
