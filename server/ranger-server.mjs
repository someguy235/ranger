import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "passport";

mongoose.connect("mongodb://127.0.0.1:27017/ranger", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (error) => console.log(error));
mongoose.Promise = global.Promise;

import "./auth/auth.mjs";

import routes from "./routes/routes.mjs";
import secureRoutes from "./routes/secure-routes.mjs";

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
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(3002, () => {
  console.log("Server started.");
});
