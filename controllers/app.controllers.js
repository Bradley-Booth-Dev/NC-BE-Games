const comments = require("../db/comments");
const {
  fetchCategories,
  fetchReviewById,
  fetchReviews,
  fetchCommentsFromReviewId,
  createComment,
  patchVotesFromReviewId,
  deleteCommentFromId,
  fetchUsers,
  fetchCommentCount,
} = require("../models/app.models");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => res.status(200).send({ categories }));
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  Promise.all([fetchReviewById(review_id), fetchCommentCount(review_id)])
    .then(([review, comment_count]) => {
      res.status(200).send({ review: { ...review, comment_count } });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { category, sort_by = "created_at", order = "desc" } = req.query;
  fetchReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
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
      res.status(201).send({ comment: postedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (req, res, next) => {
  const { review_id } = req.params;
  const inc_vote = req.body.inc_votes;

  patchVotesFromReviewId(review_id, inc_vote)
    .then((updatedReview) => {
      res.status(200).send({ review: updatedReview });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentFromId(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((error) => {
      next(error);
    });
};
