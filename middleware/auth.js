const jwt = require("jsonwebtoken");
const user = require("../models/users");

exports.isAuth = (req, res, next) => {
  const bearerHeaders = req.headers["authorization"];
  if (typeof bearerHeaders !== "undefined") {
    let token = bearerHeaders.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.json({
          err: "Invalid token : Login in ",
        });
      }

      let tempUser = await user.findOne({ email: decoded.email });

      if (!tempUser) {
        return res.json({
          err: "Invalid User",
        });
      }
      req.user = tempUser;
      next();
    });
  } else {
    return res.json({
      err: "Not logged in",
    });
  }
};
