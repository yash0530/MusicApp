// Modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const middleware = require("../middlewares");
const musicMetadata = require("music-metadata");
const btoa = require("btoa");

// Models
const Song = require("../models/Song");

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
                if (err) return reject(err);
                const filename = buf.toString("hex") + path.extname(file.originalname);
                req.filename = filename;
                const fileInfo = {
                    filename,
                    bucketName: "songs",
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

// Setting up the router
const router = express.Router({ mergeParams: true });

// INDEX ROUTE: GET /songs
router.get("/", (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0)
            return res.status(404).json({ err: "No Files Exist" });
        return res.json(files);
    });
});

// NEW ROUTE: GET /songs/new
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("songs/new");
});

// CREATE ROUTE: POST /songs
router.post("/", middleware.isLoggedIn, upload.single("file"), (req, res) => {
    Song.findOne({ filename: req.filename }, (err, song) => {
        if (err)
            return res.status(500).json({ err: "Something Went Wrong" });

        else if (!song || song.length === 0)
            return res.status(404).json({ err: "No Such File" });

        else{
            song.name = req.body.name;
            song.artist = req.body.artist;
            song.genre = req.body.genre;
            song.year = req.body.year;

            const songReadStream = gfs.createReadStream(song.filename);
            musicMetadata.parseStream(songReadStream, "audio/mp3")
                .then((songMetadata) => {
                    const albumArt = songMetadata.common.picture[0];
                    if(albumArt){
                        var base64String = "";
                        for (var i = 0; i < albumArt.data.length; i++) {
                            base64String += String.fromCharCode(albumArt.data[i]);
                        }
                        const albumArtSrc = "data:" + albumArt.format + ";base64," + btoa(base64String);
                        song.albumArt = albumArtSrc;
                    }
                    else{
                        song.albumArt = "/assets/default-albumart.png";
                    }
                    song.save((err) => {
                        if(err){
                            return res.status(500).json({ err: "Something Went Wrong" });
                        }
                    });
                    res.redirect("/home");
                })
                .catch((reason) => {
                    console.log(reason);
                    res.redirect("/home");
                });
        }
    });
});

// SHOW ROUTE: GET /songs/:id
router.get("/:filename", (req, res) => {
    // res.render("songs/show");
    gfs.files.findOne({ filename: req.params.filename }, (err, song) => {
        if (err)
            return res.status(500).json({ err: "Something Went Wrong" });

        else if (!song || song.length === 0)
            return res.status(404).json({ err: "No Such File" });

        else {
            if (song.contentType === "audio/mp3") {
                const readstream = gfs.createReadStream(song.filename);
                readstream.pipe(res);
            }
            else
                return res.status(415).json({ err: "Requested File is not a mp3 audio file" });
        }
    });
});

// EDIT ROUTE: GET /songs/:id/edit
router.get("/:filename/edit", (req, res) => {
    Song.findOne({ filename: req.params.filename }, (err, song) => {
        if (err)
            return res.status(500).json({ err: "Something Went Wrong" });

        else if (!song || song.length === 0)
            return res.status(404).json({ err: "No Such File" });

        else {
            if (song.contentType === "audio/mp3")
                return res.render("songs/edit", { song });

            else
                return res.status(415).json({ err: "Requested File is not a mp3 audio file" });
        }
    });
});

// UPDATE ROUTE: PUT /songs/:id
router.put("/:filename", (req, res) => {
    Song.findOneAndUpdate({ filename: req.params.filename }, { ...req.body }, (err, song) => {
        if (err)
            return res.status(500).json({ err: "Internal Server Error" });

        // This should be the final redirect route
        // res.redirect("/songs/" + req.params.filename);
        res.redirect("/home");
    });
});

// DESTROY ROUTE: DELETE /songs/:id
router.delete("/:filename", (req, res) => {
    Song.findOneAndDelete({ filename: req.params.filename }, (err) => {
        if (err)
            return res.status(500).json({ err: "Internal Server Error" });
        res.redirect("/home");
    });
});

module.exports = router;