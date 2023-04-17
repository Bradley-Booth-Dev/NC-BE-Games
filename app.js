const cors = require("cors");

const express = require("express");
const {
  getCategories,
  getReviewById,
  getReviews,
  getCommentsFromReviewId,
  postComment,
  patchComment,
  deleteComment,
  getUsers,
} = require("./controllers/app.controllers");
const {
  handleIdNotFound404Error,
  handlePSQL400Error,
  handleUsernameNotFoundError,
  handleCommentMissing400Error,
  handleCommentNotFound404Error,
} = require("./controllers/error_handler.controller");
const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ message: "all ok" });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsFromReviewId);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use(handleCommentNotFound404Error);
app.use(handlePSQL400Error);
app.use(handleIdNotFound404Error);
app.use(handleCommentMissing400Error);
app.use(handleUsernameNotFoundError);
app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
