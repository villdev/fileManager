const router = require("express").Router();
const Folder = require("../models/folder");
const File = require("../models/file");
const Team = require("../models/team");
const { v4: uuidv4 } = require("uuid");
const { ensureAuthenticated } = require("../config/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");

router.get("/", ensureAuthenticated, async (req, res) => {
    // res.render("homePage/home", {
    //   user: req.user,
    // });
    // if(req.user.role == "admin") {
    if(req.user.role.indexOf("admin") !== -1) {
        const users = await User.find({});
        const noOfUsers = await User.countDocuments();
        // const folders = await Folder.find({});
        const noOfFolders = await Folder.countDocuments();
        const files = await File.find({});
        let sizeTotal = 0;
        files.forEach((file)=> {
            sizeTotal += file.size;
        })
        sizeTotal = humanFileSize(sizeTotal, true);

        const noOfFiles = await File.countDocuments();
        // const teams = await Team.find({});
        const noOfTeams = await Team.countDocuments();
        res.render("admin/admin", {
          user: req.user,
          users,
          noOfUsers,
          noOfFolders,
          noOfFiles,
          noOfTeams,
          sizeTotal,
        });
    }
    else {
        res.redirect("/");
    }
});

//* convert bytes size to readable values
function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }


//-------------------1--------------------------------
//create initial db if first user in db.
// initial db creates the root public folder
// ability to remove db and start new

router.get("/createDB", ensureAuthenticated, async (req, res) => {
    // res.render("homePage/home", {
    //   user: req.user,
    // });
    // if(req.user.role == "admin") {
    if(req.user.role.indexOf("admin") !== -1) {
        
        const folders = await Folder.find({});
        const noOfFolders = await Folder.countDocuments();
        
        
        
        if(noOfFolders == 0 ) {
            //* create folder in root -> like public :P

        const folder = new Folder({
            foldername: "root",
            path: "/",
            uuid: uuidv4(),
            createdBy: req.user._id,
            parentFolder: "root",
            owner: req.user.fullname,
            team: "public",
            root: true,
        });
        //!wrap in try catch for error handling
        const response = await folder.save();
        res.redirect("/admin");
        }
        else {
            res.redirect("/admin");
        }
    }
    else {
        res.redirect("/");
    }
});
router.get("/delDB", ensureAuthenticated, async (req, res) => {
    // res.render("homePage/home", {
    //   user: req.user,
    // });
    // if(req.user.role == "admin") {
    if(req.user.role.indexOf("admin") !== -1) {
        
        const folders = await Folder.find({});
        const noOfFolders = await Folder.countDocuments();
        if(noOfFolders > 0) {
            //delete all files and folder
            await Team.deleteMany({});
            //delete users 
            await User.deleteMany({});
            // User.deleteMany({ role:{ $nin: [ ["admin"] ] } })
            await Team.deleteMany({});
            const root = await Folder.find({ parentFolder: "root" });
            delSub(root);
            await Folder.deleteMany({});

            await File.deleteMany({});
            //delete teams
            // res.redirect("/");
            // req.logout();
            // req.flash("success_msg", "You are logged out");

            // Team.deleteMany


            res.redirect("/");
        }
        else {
            res.redirect("/admin");
        }
        // res.redirect("/admin");
    }
    else {
        res.redirect("/admin");
    }
});



//* recursively delete folders and files Function
async function delSub(folder) {
    const files = await File.find({ parentFolder: folder.uuid });
    files.forEach((file) => {
      // fs.unlink(`${__dirname}/../../${file.path}`, (err) => {
      fs.unlink(`${__dirname}/../${file.path}`, (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .send({ error: "Not deleted from local storage." });
        }
      });
    });
    File.deleteMany({ parentFolder: folder.uuid }, function (err) {
      if (err) res.json(err);
      // else res.redirect(`/directory/${parentFolder}`);
    });
  
    const folders = await Folder.find({ parentFolder: folder.uuid });
    Folder.deleteOne({ uuid: folder.uuid }, function (err) {
      if (err) res.json(err);
      // else res.redirect(`/directory/${parentFolder}`);
    });
    folders.forEach((subfolder) => {
      delSub(subfolder);
    });
}

//------------------3----------------------------------
//list all users.... 
//ability to delete users
//ability to create users in bulk



module.exports = router;