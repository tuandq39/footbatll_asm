const Users = require("../models/user");
const Otp = require("../models/otp");
var session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {insertOtp, validOtp} = require("../services/otp.service")
const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const nodemailer = require('nodemailer')

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

  if (err.message === 'duplicate username') {
    errors.username = 'That username is already registered!';
  }

  // duplicate email error
  // if (err.code === 11000) {
  //   errors.username = 'that email is already registered';
  //   return errors;
  // }

  // validation errors
  // if (err.message.includes("user validation failed")) {
  //   // console.log(err);
  //   Object.values(err.errors).forEach(({ properties }) => {
  //     // console.log(val);
  //     // console.log(properties);
  //     errors[properties.path] = properties.message;
  //   });
  // }

  return errors;
}

class UsersController {
  index_signup(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
      res.redirect("/");
    } else {
      res.render("signup");
    }
  }
  index_login(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
      res.redirect("/");
    } else {
      res.render("login");
    }
  }
  async signup(req, res, next) {
    const {username,name,yob} = req.body
    let password = req.body.password
    try {
      const user = await Users.findOne({ username: username });
      if (user != null) {
        throw Error("duplicate username");
      } else {
        const salt = await bcrypt.genSalt(10);
        password = password.toString();
        password = await bcrypt.hash(password, salt);
        const newUser = new Users({
          username:username,
          password: password,
          name:name,
          yob:yob
        })
        newUser.save(newUser).then(()=>{
          const token = createToken(newUser._id);
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: MaxAge * 1000,
            });
            res.status(201).json({ user: newUser._id });
        })
        
      }
    } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({ errors });
    }
    

    // Users.findOne({ username: req.body.username })
    //   .then((user) => {
    //     if (user != null) {
    //       // var err = new Error("User " + req.body.username + " already exists!");
    //       // err.status = 403;
    //       // next(err);
    //       throw Error("duplicate username");
    //     } else {
    //       // console.log(req.body);
    //       const user = new Users({
    //         username: req.body.username,
    //         password: req.body.password,
    //         name: req.body.name,
    //         yob: req.body.yob,
    //       });

    //       user.save(user).then(() => {
    //         const token = createToken(user._id);
    //         res.cookie("jwt", token, {
    //           httpOnly: true,
    //           maxAge: MaxAge * 1000,
    //         });
    //         res.status(201).json({ user: user._id });
    //         // res.redirect("/");
    //       });
    //       // .catch((err) => {
    //       //   const erros = handleErrors(err);
    //       //   res.status(500).json("Error: " + err);
    //       // });
    //     }
    //   })
    //   .catch((err) => {
    //     const errors = handleErrors(err);
    //     res.status(400).json({ errors });
    //   });
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
          console.log(password);
          console.log(user.password);
          throw Error("incorrect password");
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
          // console.log(user);
          res.status(200).json({ user: user._id });
          // res.redirect("/players");
        }
      })
      .catch((err) => {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
      });

    // const { username, password } = req.body;

    // try {
    //   const user = await Users.login(username, password);
    //   const token = createToken(user._id);
    //   res.cookie("jwt", token, { httpOnly: true, maxAge: MaxAge * 1000 });
    //   res.status(200).json({ user: user._id });
    //   res.redirect('/players')
    // } catch (err) {
    //   const errors = handleErrors(err);
    //   res.status(400).json({ errors });
    // }
  }

  logout(req, res, next) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
  }

  formUpdate(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(
        token,
        "process.env.SECRET_ACCESS_TOKEN",
        async (err, decodedToken) => {
          if (err) {
          } else {
            let user = await Users.findById(decodedToken.id).then((user) => {
              res.render("updateUserInfo", {
                user: user,
              });
            });
          }
        }
      );
    } else {
      res.redirect("/");
    }
    // console.log(req);
    // const user=  Users.findById(req.id)
    // .then((user) => {
    //   res.render('updateUserInfo',{
    //     user:user
    //   })
    // })
  }

  async updateUsersInfo(req, res, next) {
    const salt = await bcrypt.genSalt();
    let { username, password, name, yob } = { ...req.body };

    password = await bcrypt.hash(password, salt);
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(
        token,
        "process.env.SECRET_ACCESS_TOKEN",
        async (err, decodedToken) => {
          if (err) {
          } else {
            Users.updateOne(
              { _id: decodedToken.id },
              {
                username: username,
                password: password,
                name: name,
                yob: yob,
              }
            )
              .then(() => {
                res.redirect("/");
              })
              .catch(next);
          }
        }
      );
    }

    // Users.updateOne({username:username},req.body)
    // .then(() =>{
    //   res.redirect('/');
    // }).catch(next);
  }

  async forgotPassword(req, res, next) {
    try {
      const { username } = req.body;

      // Find user by email
      const user = await Users.findOne({ username });
      console.log(user);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Generate reset token and expiration time
      const token = crypto.randomBytes(20).toString("hex");
      const expiresAt = Date.now() + 3600000; // 1 hour from now

      // Save reset token and expiration time in user document
      user.resetToken = token;
      user.resetTokenExpiration  = expiresAt;
      await user.save();
      console.log(user);

      // Send password reset email with reset link
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
          user: "dqtutest@gmail.com",
          pass: "pgtabncvpzzikrin",
        },
      });

      const resetLink = `http://${req.headers.host}/users/reset-password/${token}`;
      console.log(resetLink);
      const mailOptions = {
        from: "dqtutest@gmail.com",
        to: username,
        subject: "Password Reset Request",
        html: `<p>You have requested to reset your password. Please click <b><a href="${resetLink}">here</a></b> to reset your password.</p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ message: "Failed to send reset email" });
        }

        res.json({ message: "Reset email sent" });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      // Find user by reset token and check if token is expired
      const user = await Users.findOne({
        resetToken: token,
        resetTokenExpiration : { $gt: Date.now() },
      });
      console.log(user);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Hash new password and save in user document
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetToken = null;
      user.resetTokenExpiration  = null;
      await user.save();

      // await user.updateOne({_id:user._id},{
      //   password: await bcrypt.hash(newPassword, salt),
      //   resetToken:null,
      //   resetTokenExpiration:null
      // });


      res.json({ message: "Password reset successful",
                  newPassword:newPassword,
                  hashedPassword:user.password, 
                  isMatch:await bcrypt.compare(newPassword, user.password),
                  user:user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  async updatePassword(req,res,next) {
    const {username,currentPassword,newPassword} = req.body;
    const user = await Users.findOne({username});
    if(!(await bcrypt.compare(currentPassword,user.password))) {
      res.status(400).json({message:"Incorrect password"})
    } else {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword,salt);
      await user.save();
      res.status(200).json({message:"Update successfully"})
    }
  }

  updatePasswordForm(req,res,next){
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(
        token,
        "process.env.SECRET_ACCESS_TOKEN",
        async (err, decodedToken) => {
          if (err) {
          } else {
            let user = await Users.findById(decodedToken.id).then((user) => {
              res.render("updatePassword", {
                user: user,
              });
            });
          }
        }
      );
    } else {
      res.redirect("/");
    }

  }

  async resetPasswordByOTP(req,res,next) {
    
  }
}

  
module.exports = new UsersController();
