const express = require("express");
const router = express.Router();
const Unsplash = require("unsplash-js").default;
const { toJson } = require("unsplash-js");

const unsplash = new Unsplash({
  applicationId: process.env.UNSPLASH_ACCESS_KEY || "",
  secret: process.env.UNSPLASH_SECRET_KEY || ""
});

// TODO, allow query
router.get("/random", (req, res) => {
  unsplash.photos
    .getRandomPhoto({ query: "food" })
    .then(toJson)
    .then(json => {
      const status = json.errors ? 400 : 200;
      return res.status(status).send(json);
    })
    .catch(err => {
      return res.send(err);
    });
});

router.get('/', (req, res) => {

  const { page = 1 } = req.query;
  unsplash.search.photos("food", page, 28)
    .then(toJson)
    .then(json => {
      const status = json.errors ? 400 : 200;
      return res.status(status).send(json);
    })
    .catch(err => {
      return res.send(err);
    });

});

module.exports = router;
