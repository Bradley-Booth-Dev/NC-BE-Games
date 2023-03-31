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

exports.handleUsernameNotFoundError = (err, req, res, next) => {
  if (err.status === 404 && err.msg === "Username not found") {
    res.status(404).send({ status: 404, msg: "Username not found" });
  } else {
    next(err);
  }
};

exports.handleCommentMissing400Error = (err, req, res, next) => {
  if (err.status === 400 && err.msg === "Comment body is missing") {
    res.status(400).send({ status: 400, msg: "Comment body is missing" });
  } else {
    next(err);
  }
};

