const router = require("express").Router();
const Folder = require("../models/folder");
router.get("/", function(req, res) {
    Folder.deleteMany({ foldername: "test" }, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  });

module.exports = router;