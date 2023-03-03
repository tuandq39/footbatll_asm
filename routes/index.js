var express = require("express");
var router = express.Router();
const Players = require("../models/players");
const { requireAuth } = require("../middleware/auth");

/* GET home page. */


router.get("/" ,function (req, res, next) {
  Players.find({})
    .populate("nation")
    .then((player) => {
      res.render("index", {
        title: "Express",

        players: player,
      });
    });
});

module.exports = router;
