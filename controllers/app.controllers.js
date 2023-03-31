const comments = require("../db/data/test-data/comments");
const {
  fetchCategories,
  fetchReviewById,
  fetchReviews,
  fetchCommentsFromReviewId,
  createComment,
} = require("../models/app.models");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => res.status(200).send({ categories }));
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  fetchReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getCommentsFromReviewId = (req, res, next) => {
  const { review_id } = req.params;

  fetchCommentsFromReviewId(review_id, fetchReviewById)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const author = req.body.username;
  const body = req.body.body;

  createComment(author, body, review_id)
    .then((postedComment) => {
      res.status(201).send(postedComment);
    })
    .catch((err) => {
      next(err);
    });
};
