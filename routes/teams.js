const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const router = express.Router();
const File = require("../models/file");
const Folder = require("../models/folder");
const User = require("../models/user");
const Team = require("../models/team");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { route } = require("./signin");

router.get("/", ensureAuthenticated, async (req, res) => {
  // res.render("homePage/home", {
  //   user: req.user,
  // });
  try {
    // const files = await File.find({});
    // const folders = await Folder.find({});
    const users = await User.find({});
    const teams = await Team.find({});
    // const tempUsers = [];
    // let i = 0;
    // users.forEach(user => {
    //   // tempUsers[i] = {};
    //   tempUsers[i].fullname = user.fullname;
    //   tempUsers[i].role = user.role;
    //   tempUsers[i]._id = user._id;
    //   i=i+1;
    // })

 // let temp = [];

 // temp = [ team1, team2]

 //team1 -> { admin: [], manager: [], remove: [], add: []}

 // team1 -> { admin: [ {name: "sk", id: 1 } ], manager: [{name: "sk2", id: 2 }], remove: [{name: "sk3", id: 3 }, {name: "sk4", id: 4 }], add: [{name: "sk5", id: 5 }, {name: "sk6", id: 6 }] }

 // team2 -> { admin: [ {name: "sk", id: 1 } ], manager: [{name: "sk6", id: 6 }], remove: [{name: "sk5", id: 5 }, {name: "sk4", id: 4 }], add: [{name: "sk3", id: 3 }, {name: "sk2", id: 2 }] }

// let temp = [ { admin: [ {name: "sk", id: 1 } ], manager: [{name: "sk2", id: 2 }], remove: [{name: "sk3", id: 3 }, {name: "sk4", id: 4 }], add: [{name: "sk5", id: 5 }, {name: "sk6", id: 6 }] },
//  { admin: [ {name: "sk", id: 1 } ], manager: [{name: "sk6", id: 6 }], remove: [{name: "sk5", id: 5 }, {name: "sk4", id: 4 }], add: [{name: "sk3", id: 3 }, {name: "sk2", id: 2 }] }  ];

// console.log(temp);
// let i = 1;
// temp.forEach(t => {
//   console.log("Team", i)
//   console.log("Admin: ", t.admin[0].name);
//   if(t.manager[0].id !== t.admin[0].id) {
//     console.log("Manager: ", t.manager[0].name);
//   }
//   console.log("Members: ")
//   t.remove.forEach(member => {
//     console.log(member.name);
//   })
//   console.log("Not Members: ")
//   t.add.forEach(user => {
//     console.log(user.name);
//   })
//   i++;
// })



    //! better version of below, not working
    // let temp = [];
    // let teams = [{teamname: "abc", manager: 3}, {teamname: "zxy", manager: 4} ];
    
    // let tempUsers = [{name: "sk", role: ["admin"], id: 1}, {name: "sk3", role: ["abc"], id: 3}, {name: "sk4", role: ["abc", "xyz"], id: 4}, {name: "sk2", role: [], id: 2} ];
     
    
    
    // let i = 0;
    // teams.forEach(team => {
    //   temp[i] = {};
      
    //   temp[i].add = [];
    //   temp[i].remove = [];
    //   temp[i].admin = [];
    //   temp[i].manager = [];
      
      
    //  tempUsers.forEach(user => {
       
    //   if(user.role.indexOf("admin") !== -1) {
        
    //      temp[i].admin.push(user);
    //   }
    //   else if(user.role.indexOf(team.teamname) !== -1) {
    //      if(team.manager !== user._id) {
    //          temp[i].remove.push(user);
    //       }
    //      else {
    //          temp[i].manager.push(user);
    //       }
    //    }
    //    else {
    //       temp[i].add.push(user);
    //    }
    //     i++;
    //  })
    // })
        
    // temp.forEach(t => {
    //   console.log(t);
    // })

    // let k = 0, j = 0;
    // let temp = []
    // for(k = 0; k < teams.length; i++) {
    //   temp[k] = {};
    //   temp[k].add = [];
    //   temp[k].rem = [];
    //   temp[k].admin = [];
    //   temp[k].mg = [];
    //   for(j = 0; j < tempUsers.length; j++) {
    //     if(tempUsers[j].role.indexOf("admin") !== -1) {  
    //       temp[k].admin.push(tempUsers[j]);
    //     }
    //     else if(tempUsers[j].role.indexOf(teams[k].teamname) !== -1) {
    //       if(teams[k].manager !== tempUsers[j]._id) {
    //         temp[k].rem.push(tempUsers[j]);
    //       }
    //       else {
    //         temp[k].mg.push(tempUsers[j]);
    //       }
    //     }
    //     else {
    //       temp[k].add.push(tempUsers[j]);
    //     }
    //   }
    // }
    

    
    res.render("teams/teams", {
      users: users,
      // users: tempUsers,
      teams: teams,
    });
  } 
  catch (err) {
    res.json(err)
  }
  // res.render("teams/teams", {
  //   user: req.user,
  // });
});




// //* from downloadjs for teams

// //?------------------teams--------------------------------------------------------------------------------------------------------

//* create team -> new team
router.post("/create", async (req, res) => {
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

  res.redirect("/teams");
});


//* delete team -> remove team with specified uuid
router.get("/delete/:id", async (req, res) => {
  //? also update all user roles with same teamname
  const delTeam = await Team.findOne({ _id: req.params.id });
  if(hasAccess(req.user, delTeam)) {
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
      else res.redirect("/teams");
      // else
    });
  }
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
router.post("/update/:id", async (req, res) => {
  //!---------------------validate updated name not done----------------------------------------//

  
  //handled updating each user roles-
  const team = await Team.findOne({ _id: req.params.id });
  //! check if manager or not 
  if(hasAccess(req.user, team)) {
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
    
    //update root team folder as well
    const rootTeamFolder = await Folder.findOneAndUpdate({foldername: team.teamname, root: true}, {foldername: req.body.name})

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
    res.redirect("/teams");
  }
});

//* update team manager
router.get("/manager/:teamid/:userid", async (req, res) => {
  const team = await Team.findOne({ _id: req.params.teamid });
  //! check if the one requesting this is the manager of said team
  if(hasAccess(req.user, team)) {
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
  }
});

//* add team member
router.get("/add/:teamid/:userid", async (req, res) => {
  //! handle admin user????????
  //! check if the one req this is the manager of team
  const team = await Team.findOne({ _id: req.params.teamid });
  if(hasAccess(req.user, team)) {
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
    team.count = team.count + 1;
    team.save();
    // res.redirect("/download");
    // res.end();
  }
});

//* remove team member
router.get("/remove/:teamid/:userid", async (req, res) => {
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
  if(hasAccess(req.user,delTeam)) {
    
    delTeamMembers.forEach((member) => {
      if (member._id == req.params.userid) {
        const pos = member.role.indexOf(delTeam.teamname);
        member.role.splice(pos, 1);
        member.save();
        //! decrease the count from team
        delTeam.count = delTeam.count - 1;
        delTeam.save();
      }
    });
    // res.redirect("/download");
  
  }
});

function hasAccess(user, team) {
  if(user.role == "admin" || user._id == team.manager) {
    return true;
  }
  else {
    return false;
  }
}

module.exports = router;
