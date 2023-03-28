const app = require("./app");

app.listen(9090, (err) => {
  if (err) {
    console.log("error");
  } else {
    console.log("listening on port 9090");
  }
});
