// importing modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');

// models
const User = require('./models/User');

// connecting to DB
mongoose.connect(process.env.MUSICAPPDB || "mongodb://localhost/music_app", { useNewUrlParser: true });

// setting up the app
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// passport Configuration
app.use(require('express-session')({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// global variables
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// middleware
app.use(bodyParser.urlencoded({extended: true}));

// routes
app.use("/", require("./routes/index"));

// starting server
app.listen(3000, () => console.log("MusicApp Server Started"));