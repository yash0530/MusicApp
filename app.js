// importing modules
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");

// setting up the app
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

// passport config
require('./config/passport')(passport);

// connecting to DB
const mongoURI = "mongodb://localhost:27017/music_app"
mongoose.connect(process.env.MUSICAPPDB || mongoURI, { useNewUrlParser: true });

// express session middleware
app.use(session({ secret: process.env.SECRET || 'secret', resave: true, saveUninitialized: true }));

// bodyParser middleware
app.use(express.urlencoded({ extended: true }));

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

// Method Override middleware
app.use(methodOverride("_method"));

// routes
app.use("/", require("./routes"));
app.use("/", require("./routes/auth"));
app.use("/songs", require("./routes/songs"));

// starting server
app.listen(process.env.PORT || 3000, process.env.IP);