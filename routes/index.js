var express = require("express");
var router = express.Router();
const Players = require("../models/players");
const Nations = require("../models/nation")
const { requireAuth } = require("../middleware/auth");

/* GET home page. */


router.get("/" ,function (req, res, next) {
  Players.find({})
    .populate("nation")
    .then((player) => {
      // console.log(player.nation);
      // const na = Nations.find({_id:player.nation})
      // console.log(na);
      res.render("index", {
        title: "Player list",
        players: player,
      });
      // res.status(200).json(player)
    });
});

module.exports = router;
