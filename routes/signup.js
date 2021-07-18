const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

//ps
const { forwardAuthenticated } = require("../config/auth");

// router.get("/", (req, res) => {
//   res.render("users/signup", { user: new User() });
// });
router.get("/", forwardAuthenticated, (req, res) => {
  res.render("users/signup");
});

router.post("/", async (req, res) => {
  const { email, first, last, password } = req.body;
  let errors = [];

  //form validation
  //!add more validation later
  if (!first || !email || !last || !password) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  //if there is error
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      first,
      last,
      email,
      password,
    }); //if no errors
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("users/signup", {
          errors,
          first,
          last,
          email,
          password,
        });
      } 
      // else {
      //   const newUser = new User({
      //     fullname: first + " " + last,
      //     email,
      //     password,
      //   });

      //   bcrypt.genSalt(10, (err, salt) => {
      //     bcrypt.hash(newUser.password, salt, (err, hash) => {
      //       if (err) throw err;
      //       newUser.password = hash;
      //       newUser
      //         .save()
      //         .then((user) => {
      //           // req.flash(
      //           //   'success_msg',
      //           //   'You are now registered and can log in'
      //           // );
      //           // res.redirect('/users/login');

      //           res.render("users/signup", { msg: "User Created" });
      //         })
      //         .catch((err) => console.log(err));
      //     });
      //   });
      // }
      else {

        User.findOne({}).then((user) => {
          if (user) {
            // errors.push({ msg: "admin there already" });
            // res.render("users/signup", {
            //   errors,
            //   first,
            //   last,
            //   email,
            //   password,
            // });

            const newUser = new User({
          fullname: first + " " + last,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                // req.flash(
                //   'success_msg',
                //   'You are now registered and can log in'
                // );
                // res.redirect('/users/login');

                res.render("users/signup", { msg: "User Created" });
              })
              .catch((err) => console.log(err));
          });
        });
     



          } 

          else {
            // res.render("users/signup", {
            //   errors,
            //   first,
            //   last,
            //   email,
            //   password,
            // });




            const newUser = new User({
          fullname: first + " " + last,
          role: ["admin"],
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                // req.flash(
                //   'success_msg',
                //   'You are now registered and can log in'
                // );
                // res.redirect('/users/login');

                res.render("users/signup", { msg: "User Created" });
              })
              .catch((err) => console.log(err));
          });
        });
      

          }








        
    });
  }

  //---------------------------------------------------------------------

  // const userData = {
  //   email,
  //   password: bcrypt.hashSync(password, 5),
  //   fullname: first + " " + last,
  // };

  // const newUser = new User(userData);
  //   newUser.save().then((error) => {
  //     if (!error) {
  //       return res.status(201).json("signup successful");
  //     } else {
  //       if (error.code === 11000) {
  //         // this error gets thrown only if similar user record already exist.
  //         return res.status(409).send("user already exist!");
  //       } else {
  //         console.log(JSON.stringigy(error, null, 2)); // you might want to do this to examine and trace where the problem is emanating from
  //         return res.status(500).send("error signing up user");
  //       }
  //     }
  //   });

  // //!add above error code support in below when time

  // try {
  //   const user = await newUser.save();
  //   res.redirect("/signup", {
  //     successMessage: "User Created",
  //   });
  // } catch (error) {
  //   res.render("/signup", {
  //     errorMessage: `Error: ${error}`,
  //   });
  // }
});
}
});

module.exports = router;
