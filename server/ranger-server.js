const express = require("express");
const compression = require("compression");
const mongoose = require("mongoose");
const passport = require("passport");

mongoose.connect("mongodb://127.0.0.1:27017/ranger", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (error) => console.log(error));
mongoose.Promise = global.Promise;

require("./auth/auth");

const routes = require("./routes/routes");
const secureRoute = require("./routes/secure-routes");

const app = express();

app.use(compression());
app.use(express.json());

app.use("/ranger/api/", routes);
app.use(
  "/ranger/api/",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(3001, () => {
  console.log("Server started.");
});
