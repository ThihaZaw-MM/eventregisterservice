var express = require("express");
var validator = require('express-validator');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var events = require("./routes/events");
var users = require("./routes/users");

var app = express();

var passport = require("passport");

app.use(require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(validator());

app.use(function(req, res, next) {

  var allowedOrigins = ['http://thihazaw.com:8080', 'http://localhost:8080'];
  var origin = req.headers.origin;

  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader("Access-Control-Allow-Origin", origin);
  }

  //res.set("Access-Control-Allow-Origin", "http://localhost:8080");
  res.set("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  next();
});

app.use(express.static("./static"));
app.use("/api/events", events);
app.use("/api/users", users);

app.listen(3001, function() {
  console.log("API server running at port 3001");
});