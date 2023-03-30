const {
  fetchCategories,
  fetchReviewById,
  fetchReviews,
  fetchCommentsFromReviewId,
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
  console.log(review_id, "CONT");
};
