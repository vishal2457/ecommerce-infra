const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.code = decoded.code;
    next();
  } catch (err) {
    console.log(err, "this is error");
    res.status(401).json({ status: 401, success: 0, msg: "Token is not valid" });
  }
};
