const express = require("express");
// const fetch = require("node-fetch");
// const _ = require("underscore");
// const secret = require("./secret.json");
// const MongoClient = require("mongodb").MongoClient;

const PORT = process.env.PORT || 3001;

const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

app.get("/", async (req, res) => {
  res.json({ response: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
