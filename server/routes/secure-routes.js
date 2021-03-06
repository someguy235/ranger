const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const xml2js = require("xml2js");
const router = express.Router();
const { TripModel, ParkModel } = require("../model/model");

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
    minLat: Math.min(a.minLat, b.lat),
    maxLat: Math.max(a.maxLat, b.lat),
    minLon: Math.min(a.minLon, b.lon),
    maxLon: Math.max(a.maxLon, b.lon),
  };
};

const getParkBounds = (tripBounds, tripParks, parks) => {
  for (const tripParkId of tripParks) {
    const tripPark = parks.filter((park) => park._id == tripParkId)[0];
    const parkLat = tripPark.get("lat"),
      parkLon = tripPark.get("lon");
    if (!tripBounds) {
      tripBounds = {
        minLat: parkLat,
        maxLat: parkLat,
        minLon: parkLon,
        maxLon: parkLon,
      };
    } else {
      tripBounds = {
        minLat: Math.min(tripBounds.minLat, parkLat),
        maxLat: Math.max(tripBounds.maxLat, parkLat),
        minLon: Math.min(tripBounds.minLon, parkLon),
        maxLon: Math.max(tripBounds.maxLon, parkLon),
      };
    }
  }
  return tripBounds;
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
    // TODO: form validation, including file type
    if (req.isAuthenticated()) {
      try {
        const tripId = req.body.id;

        // handle image data
        let imgString = null;
        if (req.files.image) {
          const imgData = await sharp(req.files.image[0].buffer)
            .resize(400)
            .jpeg()
            .toBuffer();
          imgString = "data:image/jpg;base64," + imgData.toString("base64");
        }

        const kmlBuffer = req.files.kml ? req.files.kml[0].buffer : null;
        let kmlString = null,
          tripBounds = null,
          tripDistance = null;
        if (kmlBuffer) {
          const parser = new xml2js.Parser();
          kmlString = new TextDecoder().decode(new Uint8Array(kmlBuffer));
          const kml = await parser.parseStringPromise(kmlString);
          const points =
            kml?.kml?.Document[0]?.Placemark[0]?.LineString[0]?.coordinates[0]?.split(
              "\n"
            );
          [tripBounds, tripDistance] = getKmlBoundsAndDistance(points);
        }

        const tripParks = req.body.parks.split(",");
        const parks = await ParkModel.find();
        tripBounds = getParkBounds(tripBounds, tripParks, parks);

        if (tripId) {
          // update
          const filter = { _id: tripId, user: req.user.username };
          const update = {};
          if (req.body.title) update.title = req.body.title;
          if (req.body.bDate) update.bDate = req.body.bDate;
          if (req.body.eDate) update.eDate = req.body.eDate;
          if (req.body.color) update.color = req.body.color;
          if (tripParks) update.parks = tripParks;
          if (req.body.removeKml === "true") {
            update.kml = null;
            update.distance = null;
          } else {
            if (kmlString) update.kml = kmlString;
            if (tripDistance) update.distance = tripDistance;
          }
          if (tripBounds) update.bounds = tripBounds;
          if (req.body.removeImg === "true") {
            update.image = null;
          } else if (imgString) {
            update.image = imgString;
          }
          const result = await TripModel.findOneAndUpdate(filter, update);
          if (!result) throw "no results updated";
        } else {
          // insert
          await TripModel.create({
            user: req.user.username,
            title: req.body.title,
            bDate: req.body.bDate,
            eDate: req.body.eDate,
            color: req.body.color,
            parks: tripParks,
            kml: kmlString,
            distance: tripDistance,
            bounds: tripBounds,
            image: imgString,
          });
        }

        res.status(200).json();
      } catch (e) {
        console.log(e);
        res.status(500).json();
      }
    }
  }
);
module.exports = router;
