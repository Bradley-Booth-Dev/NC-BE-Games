const { query } = require("../db/connection");
const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      return rows[0];
    });
};

exports.fetchReviews = () => {
  return db
    .query(
      `
  SELECT reviews.*,
  
  COUNT(comments.review_id)
  AS comment_count
  FROM reviews
  
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id 
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC
;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentsFromReviewId = (review_id, fetchReviewById) => {
  return db
    .query(
      `
      SELECT reviews.title, comments.*
      FROM reviews
      INNER JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1

      ORDER BY comments.created_at DESC
      ;
      `,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length) {
        return rows;
      }
      return fetchReviewById(review_id).then(() => {
        return rows;
      });
    });
};

exports.createComment = (author, body, review_id) => {
  if (!body) {
    return Promise.reject({ status: 400, msg: "Comment body is missing" });
  }

  return db
    .query(
      `
    SELECT * FROM reviews WHERE review_id = $1;
    `,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      return db
        .query(
          `
    SELECT username FROM users WHERE username = $1;
    `,
          [author]
        )
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Username not found" });
          }
          return db.query(
            `
          INSERT INTO comments (author,body,review_id)
          VALUES ($1,$2,$3)
          RETURNING *
          ;`,
            [author, body, review_id]
          );
        })
        .then(({ rows }) => {
          const { author, body } = rows[0];
          return { username: author, body };
        });
    });
};

exports.patchCommentsFromReviewId = (review_id, inc_vote) => {
  return db
    .query(
      `
    SELECT * FROM reviews WHERE review_id = $1;
    `,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }

      return db
        .query(
          `
          UPDATE reviews 
          SET votes = votes + $1
          WHERE review_id = $2
          RETURNING *
          ;`,
          [inc_vote, review_id]
        )
        .then(({ rows }) => {
          const updatedReview = rows[0];
          return updatedReview;
        });
    });
};
