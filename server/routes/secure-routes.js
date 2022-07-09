const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const xml2js = require("xml2js");
const router = express.Router();
const TripModel = require("../model/model").TripModel;

const upload = multer();

const getKmlBounds = (a, b) => {
  if (!a) {
    return {
      minLat: b.lat,
      maxLat: b.lat,
      minLon: b.lon,
      maxLon: b.lon,
    };
  }
  return {
    minLat: a.minLat < b.lat ? a.minLat : b.lat,
    maxLat: a.maxLat > b.lat ? a.maxLat : b.lat,
    minLon: a.minLon < b.lon ? a.minLon : b.lon,
    maxLon: a.maxLon > b.lon ? a.maxLon : b.lon,
  };
};

const getKmlDistance = (a, b) => {
  const lat1 = a.lat,
    lon1 = a.lon,
    lat2 = b.lat,
    lon2 = b.lon;
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const d =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  const distance = 7917.5117 * Math.asin(Math.sqrt(d));
  return distance;
};

const getKmlBoundsAndDistance = (points) => {
  let kmlBounds = null,
    kmlDistance = null;
  let prevPoint = null;
  for (const point of points) {
    const a = point.trim().split(",");
    if (a.length > 1) {
      const curPoint = { lat: parseFloat(a[1]), lon: parseFloat(a[0]) };
      kmlBounds = getKmlBounds(kmlBounds, curPoint);
      if (prevPoint) {
        const distance = getKmlDistance(prevPoint, curPoint);
        kmlDistance = kmlDistance ? kmlDistance + distance : distance;
      }
      prevPoint = curPoint;
    }
  }
  kmlDistance = kmlDistance ? Math.round(kmlDistance) : kmlDistance;
  return [kmlBounds, kmlDistance];
};

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
        const kmlBuffer = req.files.kml ? req.files.kml[0].buffer : null;
        let kmlString = null,
          kmlBounds = null,
          kmlDistance = null;

        if (kmlBuffer) {
          const parser = new xml2js.Parser();
          kmlString = new TextDecoder().decode(new Uint8Array(kmlBuffer));
          const kml = await parser.parseStringPromise(kmlString);
          const points =
            kml?.kml?.Document[0]?.Placemark[0]?.LineString[0]?.coordinates[0]?.split(
              "\n"
            );
          [kmlBounds, kmlDistance] = getKmlBoundsAndDistance(points);
        }

        await TripModel.create({
          user: req.user.email,
          title: req.body.title,
          bDate: req.body.bDate,
          eDate: req.body.eDate,
          parks: req.body.parks.split(","),
          kml: kmlString,
          distance: kmlDistance,
          bounds: kmlBounds,
          image: imgData,
        });

        res.status(200).json();
      } catch (e) {
        console.log(e);
        res.status(500).json();
      }
    }
  }
);
module.exports = router;
