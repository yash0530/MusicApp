// Modules
const express = require("express");
const passport = require("passport");
const User = require("../models/User");

// Setting up the router
const router = express.Router({ mergeParams: true });

// Routes
router.get("/", (req, res) => res.render("landing"));

// Register Routes
router.get("/register", (req, res) => res.render("auth/register"));

router.post("/register", (req, res) => {
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect('/register');
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect('/secret');
        });
    });
});

// Login Routes
router.get("/login", (req, res) => res.render("auth/login"));

router.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/secret',
        failureRedirect: '/login'
    })
);

// Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get("/secret", require("../middlewares").isLoggedIn, (req, res) => res.send("Woba Loba Dub Dub"));

module.exports = router;