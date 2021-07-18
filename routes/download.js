const router = require("express").Router();
const File = require("../models/file");
const Folder = require("../models/folder");
const User = require("../models/user");
const Team = require("../models/team");
const fs = require("fs");
const path = require("path");
const { ensureAuthenticated } = require("../config/auth");
// const user = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { route } = require("./signin");



// --------------------Admin console-----------------//
// --delete user, update role, remove last role,
// --delete files and folders ---> //!add recursive delete
// --create team, update team name, del team, rem from team, add to team, change manager




//?--------------------files-------------------------------------------------------------------
//render download page with all files
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const files = await File.find({});
    const folders = await Folder.find({});
    const users = await User.find({});
    const teams = await Team.find({});
    res.render("files/download", {
      files: files,
      folders: folders,
      users: users,
      teams: teams,
    });
  } catch (err) {
    res.render("files/download", { error: "Something went wrong" });
  }
});

//handle download route
router.get("/:uuid", ensureAuthenticated, async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid });
  if (!file) {
    //  return res.render('', { error: 'Link has been expired.'});
    return res.status(500).send({ error: "Error in link." });
  }
  const filePath = `${__dirname}/../${file.path}`;
  res.download(filePath);
});

//handle delete route
router.get("/delete/:uuid", ensureAuthenticated, async function (req, res) {
  // User.findByIdAndRemove({ _id: req.params.id }, function (err) {
  //   if (err) res.json(err);
  //   else res.redirect("/delete");
  // });
  const file = await File.findOne({ uuid: req.params.uuid });
  fs.unlink(`${__dirname}/../${file.path}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Not deleted from local storage." });
    }
  });
  File.deleteOne({ uuid: req.params.uuid }, function (err) {
    if (err) res.json(err);
    else res.redirect("/download");
  });
});

//?-------------------------------------Folder-------------------------------------------------------------
//delete folder route (not used / full implementation in directory.js)
router.get("/deleteFolder/:uuid", ensureAuthenticated, async function (
  req,
  res
) {
  //!---------------------------------------------------------
  //!recursively delete rest folders and files inside not done
  //!---------------------------------------------------------

  const folder = await Folder.findOne({ uuid: req.params.uuid });
  // const parentFolder = folder.parentFolder;
  // delSub(folder);
  Folder.deleteOne({ uuid: req.params.uuid }, function (err) {
    if (err) res.json(err);
    else res.redirect("/download");
  });
});

//?---------------------Users role------------------------------------------------------------------------------------
// router.post("/user/update/role/:id", ensureAuthenticated, (req, res) => {
router.post("/user/role/add/:id", ensureAuthenticated, async (req, res) => {
  // const folder = await Folder.findOneAndUpdate({ uuid: req.params.uuid }, {foldername: req.body.foldername}, (err) => {
  const user = await User.findOne({ _id: req.params.id });
  user.role.push(req.body.role);
  user.save();
  res.redirect("/download");

  // User.findOneAndUpdate(
  //   { _id: req.params.id },
  //   { role: req.body.role },
  //   async (err) => {
  //     if (err) res.json(err);
  //     else {
  //       res.redirect("/download");
  //     }
  //   }
  // );
});

router.get("/user/role/remove/:id", ensureAuthenticated, async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  user.role.pop();
  user.save();
  res.redirect("/download");
});

//?------------------teams--------------------------------------------------------------------------------------------------------

//* create team -> new team
router.post("/team/create", async (req, res) => {
  //! --------------------------------validate team names-------------------------------------------------------------------------
  //!------------------can use teamname as roles if we validate the names and make them unique------------------------------------
  const user = await User.findOne({ _id: req.user._id });

  // if (req.user.role !== "admin") {
  if (req.user.role.indexOf("admin") === -1) {
    // User.findOneAndUpdate(
    //   { _id: req.user._id },
    //   { role: req.body.name },
    //   async (err) => {
    //     if (err) res.json(err);
    //     // else {
    //     //   res.redirect("/download");
    //     // } 
    //   }
    // );

    user.role.push(req.body.name);
    user.save();
  }

  //? also create the team folder inside -> root -> publicUUID -> teamname
  const rootFolders = await Folder.find({ parentFolder: "root" });
  const parentFolder = rootFolders[0]; //uuid of public folder

  //root folder of team
  const folder = new Folder({
    foldername: req.body.name,
    path: parentFolder.foldername + "/",
    uuid: uuidv4(),
    createdBy: req.user._id,
    owner: req.user.fullname,
    parentFolder: parentFolder.uuid,
    team: "public",
    root: true,
  });
  //! error handle?
  const response1 = await folder.save();

  //? then create the public and private folder inside -> teamname -> public & private
  const publicSubFolder = new Folder({
    foldername: "public",
    path: folder.foldername + "/",
    uuid: uuidv4(),
    createdBy: req.user._id,
    owner: req.user.fullname,
    parentFolder: folder.uuid,
    team: "public",
    // root: true,
  });
  const response2 = await publicSubFolder.save();

  const privateSubFolder = new Folder({
    foldername: "private",
    path: folder.foldername + "/",
    uuid: uuidv4(),
    createdBy: req.user._id,
    owner: req.user.fullname,
    parentFolder: folder.uuid,
    team: req.body.name,
    // root: true,
  });
  const response3 = await privateSubFolder.save();

  const team = new Team({
    teamname: req.body.name,
    manager: req.user._id,
    managerName: req.user.fullname,
    parentFolder: folder.uuid,
    count: 1,
  });
  // ! add error handling?
  const response = await team.save();

  res.redirect("/download");
});

//* delete team -> remove team with specified uuid
router.get("/team/delete/:id", async (req, res) => {
  //? also update all user roles with same teamname
  const delTeam = await Team.findOne({ _id: req.params.id });
  const delTeamMembers = await User.find({ role: delTeam.teamname });
  // const delTeamMembers = await User.updateMany(
  //   { role: delTeam.teamname },
  //   { role: "" }
  // );
  delTeamMembers.forEach((member) => {
    const pos = member.role.indexOf(delTeam.teamname);
    member.role.splice(pos, 1);
    member.save();
  });

  //? also delete the teamname folder plus its sub
  const folder = await Folder.findOne({ uuid: delTeam.parentFolder });
  const parentFolder = folder.parentFolder;
  delSub(folder);
  Folder.deleteOne({ uuid: req.params.uuid }, function (err) {
    if (err) res.json(err);
  });

  Team.deleteOne({ _id: req.params.id }, function (err) {
    if (err) res.json(err);
    else res.redirect("/download");
    // else
  });
});

//* recursively delete folders and files Function
async function delSub(folder) {
  const files = await File.find({ parentFolder: folder.uuid });
  // const file = await File.findOne({ uuid: req.params.uuid });
  files.forEach((file) => {
    fs.unlink(`${__dirname}/../${file.path}`, (err) => {
      if (err) {
        console.error(err);
        //! here res is not defined in this function
        // return res
        //   .status(500)
        //   .send({ error: "Not deleted from local storage." });
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

//* update team name
router.post("/team/update/:id", async (req, res) => {
  //!---------------------validate updated name not done----------------------------------------//

  //! check if manager or not 

  //handled updating each user roles-
  const team = await Team.findOne({ _id: req.params.id });
  // const updateTeamMembers = await User.updateMany(
  //   { role: team.teamname },
  //   { role: req.body.name }
  // );
  const updateTeamMembers = await User.find({ role: team.teamname });

  updateTeamMembers.forEach((member) => {
    const pos = member.role.indexOf(team.teamname);
    member.role.splice(pos, 1, req.body.name);
    member.save();
  });

  //update folders team key
  //  const allFolders = await Folder.find({ team: team.teamname });
  const updateFolders = await Folder.updateMany(
    { team: team.teamname },
    { team: req.body.name }
  );

  // Team.findOneAndUpdate(
  //   { _id: req.params.id },
  //   { teamname: req.body.name },
  //   async (err) => {
  //     if (err) res.json(err);
  //     else {
  //       res.redirect("/download");
  //     }
  //   }
  // );
  team.teamname = req.body.name;
  team.save();
  res.redirect("/download");
});

//* update team manager
router.get("/team/manager/:teamid/:userid", (req, res) => {
  //! check if the one requesting this is the manager of said team
  Team.findOneAndUpdate(
    { _id: req.params.teamid },
    { manager: req.params.userid },
    async (err) => {
      if (err) res.json(err);
      else {
        res.redirect("/download");
      }
    }
  );
});

//* add team member
router.get("/team/add/:teamid/:userid", async (req, res) => {
  //! handle admin user????????
  //! check if the one req this is the manager of team
  const team = await Team.findOne({ _id: req.params.teamid });
  const teamname = team.teamname;
  // User.findOneAndUpdate(
  //   { _id: req.params.userid },
  //   { role: teamname },
  //   async (err) => {
  //     if (err) res.json(err);
  //     else {
  //       res.redirect("/download");
  //     }
  //   }
  // );
  const user = await User.findOne({ _id: req.params.userid });
  user.role.push(teamname);
  user.save();
  //! increase the count from team
  res.redirect("/download");
});

//* remove team member
router.get("/team/remove/:teamid/:userid", async (req, res) => {
  // const team = await Team.find({ _id: req.params.teamid });
  // if (team.manager != req.user._id) {
  //----------------------------
  // User.findOneAndUpdate(
  //   { _id: req.params.userid },
  //   { role: "" },
  //   async (err) => {
  //     if (err) res.json(err);
  //     else {
  //       res.redirect("/download");
  //     }
  //   }
  // );
  // // }
  // ---------------------------------------------------------------------
  // const user = await User.findOne({ _id: req.params.userid });
  // const pos = user.role.indexOf(team.teamname);
  // user.role.splice(pos, 1);
  // user.save();
  // res.redirect("/download");
  //-----------------------------------------------------------------------\
  // ! check if manager or not
  const delTeam = await Team.findOne({ _id: req.params.teamid });
  const delTeamMembers = await User.find({ role: delTeam.teamname });
//! decrease the count from team
  delTeamMembers.forEach((member) => {
    if (member._id == req.params.userid) {
      const pos = member.role.indexOf(delTeam.teamname);
      member.role.splice(pos, 1);
      member.save();
    }
  });
  res.redirect("/download");
});

// //* access control function
// function hasAccess(user, folder) {

// }

router.get("/testing", async (req,res) => {
  // Folder.deleteMany({ foldername: "testing" }, function (err) {
    
  //   if (err) res.json(err);
  //     else res.redirect("/download");
  // });
  const delFolders = await Folder.find({ foldername: "testing" });
  delFolders.forEach(delFolder => {
    delFolder.deleteOne({ foldername: "testing" }, function(err) {
      if (err) res.json(err);
    else res.redirect("/donwload");
    })
  })
})


module.exports = router;
