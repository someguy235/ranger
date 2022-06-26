const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { TripModel } = require("../model/model");

const ParkModel = require("../model/model").ParkModel;

dotenv.config();

const router = express.Router();

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    console.log("signup");
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.TOKEN_SECRET);

        return res.json({ token, info });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get("/parks", async (req, res) => {
  try {
    const parks = await ParkModel.find();
    res.json(parks);
  } catch (error) {
    console.log(error);
    res.json(null);
  }
});

router.get("/trips", async (req, res) => {
  console.log("/trips");
  console.log(req.query);
  try {
    const user = req.query.user;
    if (user !== null) {
      const trips = await TripModel.find({ user });
      res.json(trips);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.log(error);
    res.json(null);
  }
});

module.exports = router;
