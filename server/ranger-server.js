const express = require("express");
// const fetch = require("node-fetch");
// const _ = require("underscore");
// const secret = require("./secret.json");
// const MongoClient = require("mongodb").MongoClient;

const PORT = process.env.PORT || 3001;

const app = express();
// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");

// get config vars
// dotenv.config();

// const generateAccessToken = (username) => {
//   return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
// };

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.sendStatus(401);
//   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//     console.log(err);
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

app.get("/", async (req, res) => {
  res.json({ response: "ok" });
});

// app.post("/api/upload", authenticateToken, (req, res) => {
//   res.json({ response: "upload" });
// });

// app.post("/api/signin", (req, res) => {
//   const token = generateAccessToken({ username: req.body.username });
//   res.json(token);
// });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
