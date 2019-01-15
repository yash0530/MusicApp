// modules
const express = require("express");
const middleware = require("../middlewares");

// router
const router = express.Router({ mergeParams: true });

// model
const User = require("../models/User");

// routes
router.get("/:id", (req, res) => {
    if (req.user && req.user._id == req.params.id)
        res.render("users/show", { ret_user: req.user, currUser: true });

    else {
        User.findById(req.params.id, (err, user) => {
            if (err) return res.status(415).json({ err: "User not found" });

            let isFollowing = false;
            if (user.followers.indexOf(req.user._id) >= 0)
                isFollowing = true;

            res.render("users/show", { ret_user: user, currUser: false, isFollowing });
        });
    }
});

router.get("/:id/edit", middleware.isLoggedIn, (req, res) => res.render("edit"));

router.post("/:id", middleware.isLoggedIn, (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err) res.json({ err: "Something went wrong" });
        else res.redirect(`/songs/${req.params.id}`);
    });
});

router.get("/:id/:id2", middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id2, (err, user) => {

        if (err) return res.json({ done: false, err });

        user.followers.push(req.user);
        user.save();

        req.user.following.push(user);
        req.user.save();

        return res.json({ done: true });
    });
});

// exporting router
module.exports = router;