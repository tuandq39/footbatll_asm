const Users = require("../models/user");
var session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const MaxAge = 3 * 34 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "process.env.SECRET_ACCESS_TOKEN", {
    expiresIn: MaxAge,
  });
};

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { username: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect username') {
    errors.username = 'That username is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.username = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

class UsersController {
  index_signup(req, res, next) {
    res.render("signup");
  }
  index_login(req, res, next) {
    res.render("login");
  }
  signup(req, res, next) {
    try {
      Users.findOne({ username: req.body.username }).then((user) => {
        if (user != null) {
          var err = new Error("User " + req.body.username + " already exists!");
          err.status = 403;
          next(err);
        } else {
          const user = new Users({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            yob: req.body.yob,
          });

          user
            .save(user)
            .then(() => {
              const token = createToken(user._id);
              res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: MaxAge * 1000,
              });
              // res.status(201).json({ user: user._id });
              res.redirect("/");
            })
            .catch((err) => {
              const erros = handleErrors(err);
              res.status(500).json("Error: " + err);
            });
        }
      });
    } catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({errors})
    }
  }
  login(req, res, next) {
    const { username, password } = { ...req.body };
    Users.findOne({ username: username })
      .then(async (user) => {
        if (user === null) {
          // var err = new Error("User " + username + " does not exist!");
          // err.status = 403;
          // return next(err);
          throw Error("incorrect username");
        } else if (!(await bcrypt.compare(password, user.password))) {
          // var err = new Error("Your password is incorrect!");
          throw Error('incorrect password');
          // err.status = 403;
          // return next(err);
        } else if (
          user.username === username &&
          (await bcrypt.compare(password, user.password))
        ) {
          //   req.session.user = "authenticated";
          const token = createToken(user._id);
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: MaxAge * 1000,
          });
          res.redirect("/players");
        }
      })
      .catch((err) => {
        const errors = handleErrors(err);
        res.status(400).json({errors})
      });
  }

  logout(req, res, next) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
  }
}

module.exports = new UsersController();
