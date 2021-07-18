const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
  //!----remove all files and folder with no parentFolders-------------------------
  //!----clear copiedUUID field from user------------------------------------------
  User.findOneAndUpdate(
    { _id: req.user._id },
    { copiedUUID: "", copyCutFlag: "" },
    (err) => {
      if (err) res.json(err);
    }
  );
  req.logout();
  // req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

module.exports = router;
