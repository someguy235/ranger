const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
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
    // TODO: file type validation
    if (req.isAuthenticated()) {
      try {
        let imgData = null;
        if (req.files.image) {
          imgData = await sharp(req.files.image[0].buffer)
            .resize(400)
            .jpeg()
            .toBuffer();
        }
        let kmlData = req.files.kml ? req.files.kml[0].buffer : null;

        await TripModel.create({
          user: req.user.email,
          title: req.body.title,
          bDate: req.body.bDate,
          eDate: req.body.eDate,
          parks: req.body.parks.split(","),
          kml: kmlData,
          image: imgData,
        });

        res.status(200).json();

        // sharp(req.files.image[0].buffer)
        //   .resize(400)
        //   .jpeg()
        //   .toBuffer()
        //   .then(async (imgData) => {
        //     await TripModel.create({
        //       user: req.user.email,
        //       title: req.body.title,
        //       bDate: req.body.bDate,
        //       eDate: req.body.eDate,
        //       parks: req.body.parks.split(","),
        //       kml: req.files.kml[0].buffer,
        //       image: imgData,
        //     });
        //     res.status(200).json();
        //   });
      } catch (e) {
        console.log(e);
        res.status(500).json();
      }
    }
  }
);
module.exports = router;
