var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
const mongoose = require("mongoose");
const Nations = require("./models/nation");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken")
const {requireAuth,checkUser} = require("./middleware/auth")
const url = "mongodb://127.0.0.1:27017/football";
const connect = mongoose.connect(url);

connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/usersRouter");
var nationRouter = require("./routes/nationRouter");
var playerRouter = require("./routes/playerRouter");
var adminRouter = require("./routes/adminRouter");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



// parse application/json
app.use(bodyParser.json())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/nations", nationRouter);
app.use("/players",requireAuth, playerRouter);
app.use("/accounts",[requireAuth,checkUser],adminRouter);
app.get('*',checkUser)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

// function auth (req, res, next) {
//     console.log(req.session);

//     if (!req.session.user) {
//         var authHeader = req.headers.authorization;
//         if (!authHeader) {
//             var err = new Error('You are not authenticated!');
//             res.setHeader('WWW-Authenticate', 'Basic');                        
//             err.status = 401;
//             next(err);
//             return;
//         }
//         var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//         var user = auth[0];
//         var pass = auth[1];
//         if (user == 'admin' && pass == 'password') {
//             req.session.user = 'admin';
//             next(); // authorized
//         } else {
//             var err = new Error('You are not authenticated!');
//             res.setHeader('WWW-Authenticate', 'Basic');
//             err.status = 401;
//             next(err);
//         }
//     }
//     else {
//         if (req.session.user === 'admin') {
//             console.log('req.session: ',req.session);
//             next();
//         }
//         else {
//             var err = new Error('You are not authenticated!');
//             err.status = 401;
//             next(err);
//         }
//     }
// }




// app.use(cookieParser('12345-67890'));
// function auth (req, res, next) {
//   if (!req.signedCookies.user) {
//     var authHeader = req.headers.authorization;
//     if (!authHeader) {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');
//         err.status = 401;
//         next(err);
//         return;
//     }
//     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     var user = auth[0];
//     var pass = auth[1];
//     if (user == 'admin' && pass == 'password') {
//         res.cookie('user','admin',{signed: true});
//         next(); // authorized
//     } else {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');
//         err.status = 401;
//         next(err);
//     }
//   }
//   else {
//       if (req.signedCookies.user === 'admin') {
//           next();
//       }
//       else {
//           var err = new Error('You are not authenticated!');
//           err.status = 401;
//           next(err);
//       }
//   }
// }
// app.use(auth);

// function auth(req, res, next) {
//   console.log(req.session);

//   if (!req.session.user) {
//     var err = new Error("You are not authenticated!");
//     err.status = 403;
//     return next(err);
//   } else {
//     if (req.session.user === "authenticated") {
//       next();
//     } else {
//       var err = new Error("You are not authenticated!");
//       err.status = 403;
//       return next(err);
//     }
//   }
// }

// app.use(auth)

// app.use(
//   session({
//     name: "session-id",
//     secret: "12345-67890-09876-54321",
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore(),
//   })
// );

// function auth(req, res, next) {
//   console.log(req.session);

//   if (!req.session.user) {
//     var authHeader = req.headers.authorization;
//     if (!authHeader) {
//       var err = new Error("You are not authenticated!");
//       res.setHeader("WWW-Authenticate", "Basic");
//       err.status = 401;
//       next(err);
//       return;
//     }
//     var auth = new Buffer.from(authHeader.split(" ")[1], "base64")
//       .toString()
//       .split(":");
//     var user = auth[0];
//     var pass = auth[1];
//     if (user == "admin" && pass == "password") {
//       req.session.user = "admin";
//       next(); // authorized
//     } else {
//       var err = new Error("You are not authenticated!");
//       res.setHeader("WWW-Authenticate", "Basic");
//       err.status = 401;
//       next(err);
//     }
//   } else {
//     if (req.session.user === "admin") {
//       console.log("req.session: ", req.session);
//       next();
//     } else {
//       var err = new Error("You are not authenticated!");
//       err.status = 401;
//       next(err);
//     }
//   }
// }

module.exports = app;
