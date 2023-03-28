exports.handlePSQL400Error = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handleIdNotFound404Error = (err, req, res, next) => {
  if (err.status === 404 && err.msg === "Review not found") {
    res.status(404).send({ status: 404, msg: "Review not found" });
  } else {
    next(err);
  }
};
