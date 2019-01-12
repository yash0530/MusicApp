// Modules
const express = require("express");

// Setting up the router
const router = express.Router({ mergeParams: true });

router.get("/", (req, res) => res.send("Hello"));

module.exports = router;