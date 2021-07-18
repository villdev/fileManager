const express = require("express");
const router = express.Router();
const User = require("../models/user");


//-------delete users control panel------------------//


router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.render("users/delete", { users: users });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id", function (req, res) {
  // User.findByIdAndRemove({ _id: req.params.id }, function (err) {
  //   if (err) res.json(err);
  //   else res.redirect("/delete");
  // });
  User.deleteOne({ _id: req.params.id }, function (err) {
    if (err) res.json(err);
    else res.redirect("/delete");
  });
});

//? not working below method using post, need to use methodOverriding i guess and then use delete method instead of post
// router.post("/", async (req, res) => {
//   try {
//     // const { email } = req.body;
//     // User.deleteOne({ email: email }, function(err) {

//     // });

//     //----------------------------------------------------------//
//     const res = await User.deleteOne({ email: req.body.email });
//     console.log(res);

//     //------------------------------------------------------------//
//     const users = await User.find({});
//     res.render("users/delete", { users: users });

//     // User.findOneAndDelete({ email: email });
//     // res.redirect("/login");
//   } catch {
//     res.redirect("/");
//   }
// });

module.exports = router;
