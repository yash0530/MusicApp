// Modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

// Models
const Song = require("../../models/Song");

// setting up GridFs
let gfs;
mongoose.connection.once("open", () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection("songs");
});

const mongoURI = "mongodb://localhost:27017/music_app"
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err){
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                req.filename = filename;
                const fileInfo = {
                    filename: filename,
                    bucketName: "songs",
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({storage});

// Setting up the router
const router = express.Router({ mergeParams: true });

// INDEX ROUTE: GET /songs
router.get("/", (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if(!files || files.length === 0){
            return res.status(404).json({err: "No Files Exist"});
        }
        return res.json(files);
    });
});

// NEW ROUTE: GET /songs/new
router.get("/new", (req, res) => {
    res.render("songs/new");
});

// CREATE ROUTE: POST /songs
router.post("/", upload.single("file"), (req, res) => {
    var artist = req.body.artist;
    var genre = req.body.genre;
    var year = req.body.year;
    Song.findOneAndUpdate({filename: req.filename}, {
        artist: artist,
        genre: genre,
        year: year
    }, {new: true}, (err, updatedSong) => {
        if(err){
            return res.status(500).json({err: "Internal Server Error"});
        }
        res.redirect("/songs");
    });
});

// SHOW ROUTE: GET /songs/:id
router.get("/:filename", (req, res) => {
    // res.render("songs/show");
    gfs.files.findOne({filename: req.params.filename}, (err, foundSong) => {
        if(err){
            return res.status(404).json({err: "Something Went Wrong"});
        }
        else if(!foundSong || foundSong.length === 0){
            return res.status(404).json({err: "No Such File"});
        }
        else{
            if(foundSong.contentType === "audio/mp3"){
                const readstream = gfs.createReadStream(foundSong.filename);
                readstream.pipe(res);
            }
            else{
                return res.status(415).json({err: "Requested File is not a mp3 audio file"});
            }
        }
    });
});

// EDIT ROUTE: GET /songs/:id/edit
router.get("/:filename/edit", (req, res) => {
    Song.findOne({filename: req.params.filename}, (err, foundSong) => {
        if(err){
            return res.status(404).json({err: "Something Went Wrong"});
        }
        else if(!foundSong || foundSong.length === 0){
            return res.status(404).json({err: "No Such File"});
        }
        else{
            if(foundSong.contentType === "audio/mp3"){
                return res.render("songs/edit", {song: foundSong});
            }
            else{
                return res.status(415).json({err: "Requested File is not a mp3 audio file"});
            }
        }
    });
});

// UPDATE ROUTE: PUT /songs/:id
router.put("/:filename", (req, res) => {
    var artist = req.body.artist;
    var genre = req.body.genre;
    var year = req.body.year;
    Song.findOneAndUpdate({filename: req.params.filename}, {
        artist: artist,
        genre: genre,
        year: year
    }, {new: true}, (err, updatedSong) => {
        if(err){
            return res.status(500).json({err: "Internal Server Error"});
        }
        // This should be the final redirect route
        // res.redirect("/songs/" + req.params.filename);
        res.redirect("/songs");
    });
});

// DESTROY ROUTE: DELETE /songs/:id
router.delete("/:filename", (req, res) => {
    Song.deleteOne({filename: req.params.filename}, (err) => {
        if(err){
            return res.status(500).json({err: "Internal Server Error"});
        }
        res.redirect("/songs");
    });
});

module.exports = router;