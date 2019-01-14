// Modules
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const validateEmail = require("../config/validateEmail");

// Models
const User = require("../models/User");

// Setting up the router
const router = express.Router({ mergeParams: true });

// Register Routes
router.get("/register", (req, res) => res.render("auth/register"));

router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = [];

    if (!name || !email || !password || !password2)
        errors.push({ msg: 'Please enter all fields' });

    if (!validateEmail(email))
        errors.push({ msg: 'Please enter a vaild email' })

    if (password !== password2)
        errors.push({ msg: 'Passwords do not match' });

    if (password.length < 6)
        errors.push({ msg: 'Password must be at least 6 characters' });

    if (errors.length > 0)
        res.render("auth/register", { errors, ...req.body });

    else {
        User.findOne({ email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email already exists' });
                    res.render("auth/register", { errors, ...req.body });
                }
                else {
                    const newUser = new User({ name, email, password });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;

                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered, please login to continue');
                                    res.redirect('/login');
                                });
                        });
                    });
                }
            });
    }
});

// Login Routes
router.get("/login", (req, res) => res.render("auth/login"));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

module.exports = router;