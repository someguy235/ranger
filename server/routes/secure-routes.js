const express = require("express");
const multer = require("multer");
const router = express.Router();
const TripModel = require("../model/model").TripModel;

const upload = multer();

router.post(
  "/upload",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "kml", maxCount: 1 },
  ]),
  async (req, res) => {
    // TODO: return success/error indications
    if (req.isAuthenticated()) {
      //   res.json({
      //     message: "It's the secure upload route",
      //   });
      try {
        const trip = await TripModel.create({
          user: req.user.email,
          title: req.body.title,
          bDate: req.body.bDate,
          eDate: req.body.eDate,
          parks: req.body.parks.split(","),
          kml: req.files.kml[0].buffer,
          image: req.files.image[0].buffer,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
);
module.exports = router;
