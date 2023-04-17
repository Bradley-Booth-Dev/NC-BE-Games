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

app.get("/api/", (req, res) => {
  const endpoints = [
    {
      path: "/api",
      method: "GET",
      description: "Returns a message to check if the API is working",
    },
    {
      path: "/api/categories",
      method: "GET",
      description: "Returns all the categories",
    },
    {
      path: "/api/reviews/:review_id",
      method: "GET",
      description: "Returns the review with the specified ID",
    },
    {
      path: "/api/reviews",
      method: "GET",
      description: "Returns all the reviews",
    },
    {
      path: "/api/reviews/:review_id/comments",
      method: "GET",
      description: "Returns all the comments for the specified review",
    },
    {
      path: "/api/reviews/:review_id/comments",
      method: "POST",
      description: "Adds a new comment to the specified review",
    },
    {
      path: "/api/reviews/:review_id",
      method: "PATCH",
      description: "Updates the specified review",
    },
    {
      path: "/api/comments/:comment_id",
      method: "DELETE",
      description: "Deletes the specified comment",
    },
    {
      path: "/api/users",
      method: "GET",
      description: "Returns all the users",
    },
    {
      path: "/api/endpoints",
      method: "GET",
      description: "Returns all the available endpoints on the API",
    },
  ];

  res.status(200).send({ endpoints });
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
