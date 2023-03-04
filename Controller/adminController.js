const Users = require("../models/user");
var session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AdminController {
    index(req, res, next) {
        Users.find({})
        .then(users => {
            res.render("accounts",{
                accounts: users,
                title: "The list of users"
            })
        }).catch(next);
    }
}

module.exports = new AdminController();