const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    description: String,
    avatar: String,
    genre: Array(String),
    recentlyPlayed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'songs.file'
    }],
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'songs.file'
    }],
    uploaded: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'songs.file'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);