const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.isAuth = (req, res, next) => {
  const bearerHeaders = req.headers["authorization"];
  if (typeof bearerHeaders !== "undefined") {
    let token = bearerHeaders.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          err: "Invalid token : Login in ",
        });
      }

      let tempUser = await User.findOne({ email: decoded.email });

      if (!tempUser) {
        return res.status(400).json({
          err: "Invalid User",
        });
      }
      req.user = tempUser;
      next();
    });
  } else {
    return res.status(500).json({
      err: "Not logged in",
    });
  }
};
