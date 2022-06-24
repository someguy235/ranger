const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

router.post(
  "/upload",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "kml", maxCount: 1 },
  ]),
  (req, res) => {
    console.log("/upload");
    console.log(req.body);
    console.log(req.files);
    res.json({
      message: "It's the secure upload route",
    });
  }
);
module.exports = router;
