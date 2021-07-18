const express = require("express");
const router = express.Router();
// const User = require("../models/user");
const passport = require("passport");
const { forwardAuthenticated } = require("../config/auth");

router.get("/", forwardAuthenticated, (req, res) => {
  res.render("users/signin");
});

router.post("/", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: false, //true to use flash and send msg in flash to failur url.
  })(req, res, next);
});

module.exports = router;
