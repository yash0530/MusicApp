const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);