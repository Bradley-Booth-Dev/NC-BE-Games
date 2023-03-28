const { fetchCategories } = require("../models/app.models");

exports.getCategories = (req, res) => {
  console.log("inside controller");

  fetchCategories().then((categories) => res.status(200).send({ categories }));
};
