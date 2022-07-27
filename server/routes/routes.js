const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { TripModel, ParkModel } = require("../model/model");
// const e = require("express");

dotenv.config();

const router = express.Router();

// TODO: allow multiple users
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

// TODO: expire jwt
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
  try {
    const user = req.query.user;
    if (user !== null) {
      const trips = await TripModel.find({ user });
      res.json(trips.sort((a, b) => (a.bDate < b.bDate ? -1 : 1)));
    } else {
      res.json([]);
    }
  } catch (error) {
    console.log(error);
    res.json(null);
  }
});

module.exports = router;
