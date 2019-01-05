const express = require("express"),
      router = express.Router(),
      passport = require("passport");

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    res.send("HANDLE REGISTRATION LOGIC HERE");
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", function(req, res){
    res.send("HANDLE LOGIN LOGIC HERE");
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;