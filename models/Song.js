const mongoose = require("mongoose");

const SongSchema = mongoose.Schema({
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    artist: String,
    genre: String,
    year: Number,
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    filename: String,
    md5: String,
    contentType: String
});

module.exports = mongoose.model("songs.file", SongSchema);