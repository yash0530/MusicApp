// importing modules
const express = require("express"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose");

// importing routes
const indexRoutes = require("./routes/index");

// setting up the app
const app = express();

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(indexRoutes);

// setting the default view engine to ejs
app.set("view engine", "ejs");

// connecting to DB
mongoose.connect(process.env.MUSICAPPDB || "mongodb://localhost/music_app", { useNewUrlParser: true });

// routes
app.get("/", (req, res) => res.render("landing"));

// starting server
app.listen(3000, function(){
    console.log("MusicApp Server Started");
});