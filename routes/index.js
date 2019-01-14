// Modules
const express = require("express");
const middleware = require("../middlewares");

// Setting up the router
const router = express.Router({ mergeParams: true });

// Routes
router.get("/", (req, res) => res.render("landing"));

router.get("/home", middleware.isLoggedIn, (req, res) => {
    res.render("home");
});

module.exports = router;