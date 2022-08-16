const express = require("express");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");

// TODO: convert to ES modules

mongoose.connect("mongodb://127.0.0.1:27017/ranger", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (error) => console.log(error));
mongoose.Promise = global.Promise;

require("./auth/auth");

const routes = require("./routes/routes");
const secureRoutes = require("./routes/secure-routes");

const app = express();

app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use("/ranger/api/", routes);
app.use(
  "/ranger/api/",
  passport.authenticate("jwt", { session: false }),
  secureRoutes
);

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(3001, () => {
  console.log("Server started.");
});
