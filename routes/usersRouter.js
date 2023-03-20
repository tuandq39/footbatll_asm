var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var User = require("../models/user");
var session = require("express-session");
const bcrypt = require('bcrypt');


const jwt = require("jsonwebtoken")
const userController = require('../Controller/usersController');
const usersRouter = express.Router();

usersRouter.use(bodyParser.json());
usersRouter.use(bodyParser.urlencoded({extended:false}))

usersRouter.route('/')
.get(userController.index_signup);

usersRouter.route('/signup')
.get(userController.index_signup)
.post(userController.signup);


usersRouter.route('/login')
.get(userController.index_login)
.post(userController.login);

usersRouter.route('/logout')
.get(userController.logout)

usersRouter.route('/update')
.get(userController.formUpdate)
.post(userController.updateUsersInfo)

usersRouter.route('/forgot-password')
.post(userController.forgotPassword)

usersRouter.route('/reset-password/:token')
.post(userController.resetPassword)

usersRouter.route('/update-password')
.get(userController.updatePasswordForm)
.post(userController.updatePassword)

module.exports = usersRouter;
