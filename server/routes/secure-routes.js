const express = require("express");
const router = express.Router();

router.post("/upload", async (req, res, next) => {
  console.log("/upload");
  res.json({
    message: "It's the secure upload route",
  });
});
module.exports = router;
