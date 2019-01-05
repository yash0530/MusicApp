// importing modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// setting up the app
const app = express();

// middleware
app.use(bodyParser.urlencoded({extended: true}));

// connecting to DB
mongoose.connect(process.env.MUSICAPPDB || "mongodb://localhost/music_app", { useNewUrlParser: true });

// routes
app.get("/", (req, res) => res.send("MusicApp"));

// starting server
app.listen(3000);