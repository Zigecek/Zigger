var bodyParser = require("body-parser");
const express = require("express");

const port = 3321;
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/toAdmin", function (req, res, next) {
  console.log(req.body);
});

app.listen(port, "localhost");
