const db = require("../db/connection");

exports.fetchCategories = () => {
  console.log("Inside Model");
  return db.query(`SELECT * FROM categories;`).then(({ rows }) => {
    return rows;
  });
};
