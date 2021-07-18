const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  // res.render("homePage/home", {
  //   user: req.user,
  // });
  res.render("starred/starred", {
    user: req.user,
  });
});

module.exports = router;
