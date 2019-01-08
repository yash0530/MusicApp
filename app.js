// importing modules
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

// setting up the app
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

// passport config
require('./config/passport')(passport);

// models
const User = require("./models/User");

// connecting to DB
mongoose.connect(process.env.MUSICAPPDB || "mongodb://localhost/music_app", { useNewUrlParser: true });

// express session middleware
app.use(session({ secret: process.env.SECRET || 'secret', resave: true, saveUninitialized: true }));

// bodyParser middleware
app.use(express.urlencoded({extended: true}));

// flash middlemare
app.use(flash());

// passport middlemare
app.use(passport.initialize());
app.use(passport.session());

// global variables
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// routes
app.use("/", require("./routes/index"));

// starting server
app.listen(process.env.PORT || 3000, process.env.IP);