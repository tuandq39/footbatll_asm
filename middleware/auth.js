const Users = require("../models/user");
var session = require("express-session");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

// const checkRole = (req,res,next) => {
//     let
// }

const requireAuth = (req,res,next) =>{
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token,"process.env.SECRET_ACCESS_TOKEN",(err,decodedToken)=>{
            if(err) {
                console.log(err.message);
                res.redirect('/users/login');
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else {
        res.redirect('/users/login')
    }
}

const checkUser = (req,res,next) =>{
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token,"process.env.SECRET_ACCESS_TOKEN", async (err,decodedToken)=>{
            if(err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToken);
                let user = await Users.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }else {
        res.locals.user = null;
        next()
    }
}

const verifyAdmin = (req,res,next) =>{
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token,"process.env.SECRET_ACCESS_TOKEN", async (err,decodedToken)=>{
            if(err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToken);
                let user = await Users.findById(decodedToken.id);
                res.locals.user = user;
                if(user.isAdmin) {
                    // res.redirect('/accounts')
                    next();
                } else {

                    // res.status(401).json({message:"You're not an admin"})
                    res.redirect('/error')
                    next()
                }
            }
        })
    }else {
        res.locals.user = null;
        next()
    }
}
module.exports = {requireAuth,checkUser, verifyAdmin};