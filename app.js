const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", require("./routes/auth-route"));
app.use("/user", require("./routes/user-route"));
app.use("/post", require("./routes/post-route"));
app.use("/post", require("./routes/comment-route"));
app.use("/friendrequest", require("./routes/friend-request-route"));
app.get("*", (req, res) => {
  res.status(404).send("No Route Found");
});

mongoose.connect(
  process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("DB is Connected..");
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at port 3000");
});
