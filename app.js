const express = require("express");
const {
  getCategories,
  getReviewById,
  getReviews,
  getCommentsFromReviewId,
} = require("./controllers/app.controllers");
const {
  handleIdNotFound404Error,
  handlePSQL400Error,
} = require("./controllers/error_handler.controller");
const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ message: "all ok" });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsFromReviewId);

app.use(handlePSQL400Error);
app.use(handleIdNotFound404Error);
app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});
module.exports = app;
