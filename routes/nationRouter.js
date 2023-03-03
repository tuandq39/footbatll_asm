const express = require('express');
const bodyParser = require('body-parser');
const Nations = require('../models/nation');	
const nationsController = require('../Controller/nationsController');
const playerController = require('../Controller/playerController');
const nationRouter = express.Router();
	
nationRouter.use(bodyParser.json());

nationRouter.route('/')
.get(nationsController.index)


nationRouter.route('/addNation')
.get(nationsController.add)
.post(nationsController.create);

nationRouter.route('/delete/:nationId')
.get(nationsController.delete)

nationRouter.route('/update/:nationId')
.get(nationsController.formUpdate)
.post(nationsController.update)

// nationRouter.route('/update/:nationId')
// .get(playerController.formUpdate)
// .post(playerController.update)

// nationRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req,res,next) => {
//     res.end('Will send all the nations to you');
// })
// .post((req, res, next) => {
//     res.end('Will add the nation: ' + req.body.name + ' with details: ' + req.body.description);
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /nations');
// })
// .delete((req, res, next) => {
//     res.end('Deleting all nations');
// });

// nationRouter.route("/:nationId")
// .get((req,res) => {
//     res.end('Will send details of the player: ' + req.params.nationId +' to you!');
// })
// .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /nations/'+ req.params.nationId);
// })
// .put((req, res, next) => {
//     res.write('Updating the nation: ' + req.params.nationId + '\n');
//     res.end('Will update the nation: ' + req.body.name + 
//              ' with details: ' + req.body.description);
// })
// .delete((req, res, next) => {
//     res.end('Deleting nation: ' + req.params.nationId);
// });

// nationRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req,res,next) => {
//     Nations.find({})
//     .then((nation)=>{
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
// 	    res.json(nation);
//     },(err) => next(err))
//     .catch((err)=>next(err))
// })
// .post((req, res, next) => {
//     Nations.create(req.body)
//     .then((nation)=>{
//         console.log("Nation create",nation);
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
// 	    res.json(nation);
//     },(err) => next(err))
//     .catch((err)=>next(err))
    
   
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /nations');
// })
// .delete((req, res, next) => {
//     Nations.remove({})
//     .then((nation)=>{
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
// 	    res.json(nation);
//     },(err) => next(err))
//     .catch((err)=>next(err))
// });

// nationRouter.route("/:nationId")
// .get((req,res,next) => {
//     Nations.findById(req.params.nationId)
//     .then((nation)=>{
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
// 	    res.json(nation);
//     },(err) => next(err))
//     .catch((err)=>next(err))
// })
// .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /nations/'+ req.params.nationId);
// })
// .put((req, res, next) => {
//      Nations.findByIdAndUpdate(req.params.nationId,{$set:req.body})
//     .then((nation)=>{
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
// 	    res.json(nation);
//     },(err) => next(err))
//     .catch((err)=>next(err))
// })
// .delete((req, res, next) => {
//     Nations.findByIdAndRemove(req.params.nationId)
//     .then((nation)=>{
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
// 	    res.json(nation);
//     },(err) => next(err))
//     .catch((err)=>next(err))
// });

// nationRouter.route("/:nationId/comments")
// .get((req,res,next) => {
//     Nations.findById(req.params.nationId)
//     .then((nation)=>{
//         if(nation != null) {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(nation);
//         } else {
//             err= new Error('Nation' + req.params.nationId + " not found")
//             err.status = 404;
//             return next(err);
//         }
//     },(err) => next(err))
//     .catch((err)=>next(err))
// })
// .post((req, res, next) => {
//     Nations.findById(req.params.nationId)
//     .then((nation)=>{
//         if(nation != null) {
//             nation.comments.push(req.body);
//             nation.save()
//             .then((nation) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(nation);
//             },(err) => next(err));
           
//         } else {
//             err= new Error('Nation' + req.params.nationId + " not found")
//             err.status = 404;
//             return next(err);
//         }
//     },(err) => next(err))
//     .catch((err)=>next(err))
   
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /nations/'+ req.params.nationId +"/comments");
// })
// .delete((req, res, next) => {
//     Nations.findById(req.params.nationId)
//     .then((nation)=>{
//         if(nation != null) {
//             for(var i=(nation.comments.length -1);i>=0;i--){
//                 nation.comments.id(nation.comments[i]._id).remove();
//             }
//             nation.save()
//             .then((nation) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(nation);
//             },(err) => next(err));
           
//         } else {
//             err= new Error('Nation' + req.params.nationId + " not found")
//             err.status = 404;
//             return next(err);
//         }
//     },(err) => next(err))
//     .catch((err)=>next(err))
// });

// nationRouter.route("/:nationId/comments/:commentId")
// .get((req,res,next) => {
//     Nations.findById(req.params.nationId)
//     .then((nation)=>{
//         if(nation != null && nation.comments.id(req.params.commentId) != null) {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(req.params.commentId);
//         } else if(nation ==null){
//             err= new Error('Nation' + req.params.nationId + " not found")
//             err.status = 404;
//             return next(err);
//         } else {
//             err= new Error('Nation' + req.params.commentId + " not found")
//             err.status = 404;
//             return next(err);
//         }
//     },(err) => next(err))
//     .catch((err)=>next(err))
// })
// .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /nations/'+ req.params.nationId +"/comments/"+ req.params.commentId);
   
// })
// .put((req, res, next) => {
//     Nations.findById(req.params.nationId)
//     .then((nation)=>{
//         if(nation != null && nation.comments.id(req.params.commentId) != null) {
//            if(req.body.rating){
            
//            }
//         } else if(nation ==null){
//             err= new Error('Nation' + req.params.nationId + " not found")
//             err.status = 404;
//             return next(err);
//         } else {
//             err= new Error('Nation' + req.params.commentId + " not found")
//             err.status = 404;
//             return next(err);
//         }
//     },(err) => next(err))
//     .catch((err)=>next(err))
// })
// .delete((req, res, next) => {
//     Nations.findById(req.params.nationId)
//     .then((nation)=>{
//         if(nation != null) {
//             for(var i=(nation.comments.length -1);i>=0;i--){
//                 nation.comments.id(nation.comments[i]._id).remove();
//             }
//             nation.save()
//             .then((nation) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(nation);
//             },(err) => next(err));
           
//         } else {
//             err= new Error('Nation' + req.params.nationId + " not found")
//             err.status = 404;
//             return next(err);
//         }
//     },(err) => next(err))
//     .catch((err)=>next(err))
// });



module.exports = nationRouter;
