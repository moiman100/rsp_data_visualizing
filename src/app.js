var express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
var reqs = require("/usr/src/app/src/routes/reqs.js");
var mongoose = require('mongoose');
mongoose.connect("mongodb://mongo:27017/test", { useNewUrlParser: true });
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set("view engine", "ejs");

// serve public directory
app.use(express.static("src/public"));
app.use("/api/", reqs);

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Insert advertisement into database before trying the dummy advertisement, site  http://localhost:3000/dummyad
app.get("/dummyad", (req, res) => {
  res.render("dummyad", { title: "Insert Ad" });
});

// Dummy advertisement, create events and user sessions, site  http://localhost:3000/dummy
app.get("/dummy", (req, res) => {
  res.render("dummy", { title: "Dummy Advertisement" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
