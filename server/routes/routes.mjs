import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import jwt_decode from "jwt-decode";

import { TripModel, ParkModel, UserModel } from "../model/model.mjs";

dotenv.config();

const router = express.Router();

// router.post(
//   "/signup",
//   passport.authenticate("signup", { session: false }),
//   async (req, res, next) => {
//     console.log("signup");
//     res.json({
//       message: "Signup successful",
//       user: req.user,
//     });
//   }
// );

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, username: user.email };
        const token = jwt.sign({ user: body }, process.env.JWT_AUTH_SECRET, {
          expiresIn: "5m",
        });
        const refresh = jwt.sign(
          { user: body },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "1d" }
        );

        const result = await UserModel.findOneAndUpdate(
          { _id: user._id },
          { refresh }
        );
        if (!result) throw "could not set refresh";

        const decode = jwt_decode(refresh);

        res.cookie("refresh", refresh, { httpOnly: true, sameSite: "strict" });
        info.refreshExpire = decode.exp;
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

export default router;
