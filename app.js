const express = require("express");
const { getCategories } = require("./controllers/app.controllers");
const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ message: "all ok" });
});

app.get("/api/categories", getCategories);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
