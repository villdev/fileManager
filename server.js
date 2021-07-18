if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//load files from .env file to env.process

//load express and start app
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const app = express();

require("./config/passport")(passport);

//load routes
//user register login lgout delete routes
const signinRoute = require("./routes/signin");
const signupRoute = require("./routes/signup");
const deleteRoute = require("./routes/delete");
const signoutRoute = require("./routes/signout");
//menu routes
const homeRoute = require("./routes/home");
const filesRoute = require("./routes/files");
const noticesRoute = require("./routes/notices");
const teamsRoute = require("./routes/teams");
const recentRoute = require("./routes/recent");
const starredRoute = require("./routes/starred");
const settingsRoute = require("./routes/settings");
const adminRoute = require("./routes/admin");
//file upload/download route
const uploadRoute = require("./routes/upload");
const downloadRoute = require("./routes/download");
//directory
const directoryRoute = require("./routes/directory/directory");
const testingRoute = require("./routes/testing");

//add view engine for ejs
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//use public folder
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));

//accept form data for express
app.use(express.urlencoded({ extended: false }));

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// //connect to mongodb
// const mongoose = require("mongoose");
// mongoose.connect(process.env.DATABASE_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true, //coz of -> DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
// });
// const db = mongoose.connection;
// db.on("error", (error) => console.error(error));
// db.on("open", () => console.log("Connected to mongodb"));
//?instead of above using below code
const connectDB = require("./config/db");
connectDB();

//connect routes to this server
app.use("/", signinRoute);
app.use("/signup", signupRoute);
app.use("/delete", deleteRoute);
app.use("/signout", signoutRoute); 
app.use("/home", homeRoute);
app.use("/files", filesRoute);
app.use("/notices", noticesRoute);
app.use("/teams", teamsRoute);
app.use("/recent", recentRoute);
app.use("/starred", starredRoute);
app.use("/settings", settingsRoute);
app.use("/admin", adminRoute);
// app.use("/file/upload", uploadRoute);
// app.use("/file/download", downloadRoute);
app.use("/upload", uploadRoute);
app.use("/download", downloadRoute);
app.use("/directory", directoryRoute);
app.use("/testing", testingRoute);



//start on port
app.listen(process.env.PORT || 3000);
