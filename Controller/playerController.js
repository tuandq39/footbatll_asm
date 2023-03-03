const Players = require("../models/players");
class PlayerController {
  index(req, res, next) {
    Players.find({})
    // .populate('nation')
      .then((players) => {
        res.render("players", {
          title: "The list of Players",
          players: players,
          positionList: positionData,
        });
        // res.json(players)
      })
      .catch(next);
  }

  add(req, res, next) {
    res.render("addPlayer", {
      title: "add a player",
      positionList: positionData,
    });
  }
  create(req, res, next) {
    // console.log(req.body);
    // const player = new Players(req.body);
    // player.save()
    // .then(() => res.redirect('/players'))
    // .catch(error =>{});
    const { name, image, club, position, goals, isCaptain } = { ...req.body };
    const player = new Players({
      name: name,
      image: image,
      club: club,
      position: position,
      goals: goals,
      isCaptain: isCaptain,
    });
    player
      .save(player)
      .then(() => res.redirect("/players"))
      .catch((err) => {
        res.status(500).json("Error: " + err);
      });
  }
  delete(req, res, next) {
    Players.findByIdAndRemove({ _id: req.params.playerId })
      .then(() => res.redirect("/players"))
      .catch((err) => {
        res.status(500);
      });
  }

  formUpdate(req, res, next) {
    const playerId = req.params.playerId;
    Players.findById(playerId)
      .then((player) => {
        res.render("updatePlayer", {
          player: player,
          positionList: positionData,
        });
      })
      .catch((err) => res.status(500));
  }
  update(req, res, next) {
    const playerId = req.params.playerId;
    Players.updateOne({ _id: playerId }, req.body)
      .then(() => {
        res.redirect("/players");
      })
      .catch(next);
  }
}

let clubData = [
  { id: "1", name: "Arsenal" },
  { id: "2", name: "Manchester United" },
  { id: "3", name: "Chelsea" },
  { id: "4", name: "Manchester City" },
  { id: "5", name: "PSG" },
  { id: "6", name: "Inter Milan" },
  { id: "7", name: "Real Madrid" },
  { id: "8", name: "Barcelona" },
];

let positionData = [
  { id: "GK", name: "Goalkeeper" },
  { id: "DF", name: "Defender" },
  { id: "CB", name: "Center Back" },
  { id: "CD", name: "Center Defender" },
  { id: "LM", name: "Left Midfielder" },
  { id: "LM", name: "Right Midfielder" },
  { id: "LF", name: "Forward" },
  { id: "ST", name: "Striker" },
];

module.exports = new PlayerController();
