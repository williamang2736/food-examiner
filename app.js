const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require('compression')

const dotenv = require("dotenv");
dotenv.config();

/* Needed for unsplash api */
require("es6-promise").polyfill();
require("isomorphic-fetch");

const foodImageRecognitionRouter = require("./routes/foodImageRecognition");
const imagesRouter = require("./routes/images");
const recipesRouter = require("./routes/recipes");

const app = express();
app.use(compression())
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/foodImageRecognition", foodImageRecognitionRouter);
app.use("/api/images", imagesRouter);
app.use("/api/recipes", recipesRouter);

// For any unknown paths, return the react file
app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || "3001";
app.listen(port);
