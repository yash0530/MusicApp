// Modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

// setting up GridFs
let gfs;
mongoose.connection.once("open", () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection("songs");
});

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
router.post("/", (req, res) => {
    res.send("Handle new song creation logic here");
});

// SHOW ROUTE: GET /songs/:id
router.get("/:id", (req, res) => {
    res.render("songs/show");
});

// EDIT ROUTE: GET /songs/:id/edit
router.get("/:id/edit", (req, res) => {
    res.render("songs/edit");
});

// UPDATE ROUTE: PUT /songs/:id
router.put("/:id", (req, res) => {
    res.send("Handle update songs logic here");
});

// DESTROY ROUTE: DELETE /songs/:id
router.delete("/:id", (req, res) => {
    res.send("Handle delete song logic here");
});

module.exports = router;