const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    created: { type: Date, default: Date.now }
});
UserSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

module.exports = mongoose.model("User", UserSchema);