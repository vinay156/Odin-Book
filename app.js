const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");

const authRoute = require("./routes/auth-route");
const commentRoute = require("./routes/comment-route");
const friendRequestRoute = require("./routes/friend-request-route");
const postRoute = require("./routes/post-route");
const userRoute = require("./routes/user-route");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(
  process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("DB is Connected..");
  }
);

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/post", commentRoute);
app.use("/friendrequest", friendRequestRoute);
app.get("*", (req, res) => {
  res.status(404).send("No Route Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at port 3000");
});
