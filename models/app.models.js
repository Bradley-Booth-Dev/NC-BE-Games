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


