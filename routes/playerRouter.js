const express = require('express');
const bodyParser = require('body-parser');
const playerController = require('../Controller/playerController')
const { requireAuth,checkUser } = require("../middleware/auth");
	
const playerRouter = express.Router();
	
playerRouter.use(bodyParser.json());

playerRouter.route('/')
.get(requireAuth,checkUser,playerController.index)

playerRouter.route('/addPlayer')
.get(playerController.add)
.post(playerController.create);

playerRouter.route("/delete/:playerId")
.get(playerController.delete);

playerRouter.route("/update/:playerId")
.get(playerController.formUpdate)
.post(playerController.update)


// playerRouter.route('/')
// .all((req,res,next) => {
// 	res.statusCode = 200;
// 	res.setHeader('Content-Type', 'text/plain');
// 	next();
// })
// .get((req,res,next) => {
//     res.end('Will send all the players to you');
// })
// .post((req, res, next) => {
//     res.end('Will add the player: ' + req.body.name + ' with details: ' + req.body.description);
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /player');
// })
// .delete((req, res, next) => {
//     res.end('Deleting all players');
// });

// playerRouter.route("/:playerId")
// .get((req,res) => {
// 	res.end('Will send details of the player: ' + req.params.playerId +' to you!');
// })
// .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /nations/'+ req.params.playerId);
// })
// .put((req, res, next) => {
//     res.write('Updating the player: ' + req.params.playerId + '\n');
//     res.end('Will update the player: ' + req.body.name + 
//                 ' with details: ' + req.body.description);
// })
// .delete((req, res, next) => {
// 	res.end('Deleting player: ' + req.params.playerId);
// });



module.exports = playerRouter;