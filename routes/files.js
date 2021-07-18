// const express = require("express");
// const { ensureAuthenticated } = require("../config/auth");
// const router = express.Router();

// router.get("/", ensureAuthenticated, (req, res) => {
//   // res.render("homePage/home", {
//   //   user: req.user,
//   // });
//   res.render("files/files", {
//     user: req.user,
//   });
// });

// module.exports = router;

//!---- new connection----------------------------------------
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

//?admin / root routes below
 
//* render the root folders -> like public
// router.get("/", ensureAuthenticated, async (req, res) => {
//   const folders = await Folder.find({ parentFolder: "root" });
//   //   const folders = await Folder.find({});
//   res.render("directory/directory", { folders: folders, parentFolder: "/" });
// });

//* create folder in root -> like public :P
// router.post("/newFolder", ensureAuthenticated, async (req, res) => {
//   //!----------------------------------------------------------
//   //!validate folder name for present directory / parent folder
//   //!----------------------------------------------------------
//   const folder = new Folder({
//     foldername: req.body.foldername,
//     path: "/",
//     uuid: uuidv4(),
//     createdBy: req.user._id,
//     parentFolder: "root",
//      now we have owner as well............
//     team: "public",
//      root: true,
//   });
//   //!wrap in try catch for error handling
//   const response = await folder.save();
//   res.redirect("/directory");
// });

//* access control function
function hasAccess(user, folder) {
  // const folder = Folder.findOne({ uuid: folderUUID });
  if (folder.team == "public") return "true";
  if (user.role == "admin") return "true";
  if (user.role.indexOf(folder.team) !== -1) return "true";
  return "false";
  // return "true";
}

//* right control function
function hasRights(user, folder, recursiveFlag) {
  if (user.role == "admin") return "true";
  if (recursiveFlag === false && folder.createdBy == user._id) return "true";
  return "false";
}

//* right ccntrol for file
function hasRightsFile(user, file, team) {
  if (user.role == "admin") return "true";
  if (file.uploader == user._id) return "true";
  return "false";
}

//* delete folder
router.get("/delete/:uuid", ensureAuthenticated, async function (req, res) {
  const folder = await Folder.findOne({ uuid: req.params.uuid });
  const parentFolder = await Folder.findOne({ uuid: folder.parentFolder });

  if (hasRights(req.user, folder, false) == "true") {
    if (!folder.root && !parentFolder.root) {
      delSub(folder);
      Folder.deleteOne({ uuid: req.params.uuid }, function (err) {
        if (err) res.json(err);
        else res.redirect(`/files/${folder.parentFolder}`);
      });
    } else res.redirect(`/files/${folder.parentFolder}`);
  } else res.redirect(`/files/${folder.parentFolder}`);
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

//?normal user routes below plus the above folder delete for everyone

//* show folder -> render the directory of uuid
router.get("/:uuid", ensureAuthenticated, async (req, res) => {
  // if(hasAccess(req.user, req.params.uuid)) {
  try {
    const folder = await Folder.findOne({ uuid: req.params.uuid });
    let subFolders, subFiles;
    let sortBy;
    //default sort value
    if (!req.user.sortBy) sortBy = "name";
    else sortBy = req.user.sortBy;
    //specified sort value
    if (sortBy === "name") {
      subFolders = await Folder.find({ parentFolder: req.params.uuid })
        .collation({ locale: "en" })
        .sort({ foldername: 1 });
      subFiles = await File.find({ parentFolder: req.params.uuid })
        .collation({ locale: "en" })
        .sort({
          filename: 1,
        });
    } else if (sortBy === "size") {
      subFolders = await Folder.find({ parentFolder: req.params.uuid })
        .collation({ locale: "en" })
        .sort({ foldername: 1 });
      subFiles = await File.find({ parentFolder: req.params.uuid }).sort({
        size: 1,
      });
    } else if (sortBy === "date") {
      subFolders = await Folder.find({
        parentFolder: req.params.uuid,
      }).sort({ updatedAt: -1 });
      subFiles = await File.find({ parentFolder: req.params.uuid }).sort({
        updatedAt: -1,
      });
    } else {
      subFolders = await Folder.find({ parentFolder: req.params.uuid })
        .collation({ locale: "en" })
        .sort({ foldername: 1 });
      subFiles = await File.find({ parentFolder: req.params.uuid })
        .collation({ locale: "en" })
        .sort({ type: 1 });
    }

    let parentFolder = folder.parentFolder;
    if (parentFolder == "root") {
      parentFolder = folder.uuid;
    }

    //!-------------------------------------------------------------------
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~send hasAccesFiles and hasAccessFolders to frontend for search ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //!--------------------------then use get search query to send request and filter through these--------------------------------------------\
    //!--------------------output the search results in searchResults div -> which now gets display block-----------------------------------------------
    //!--------------------if lose foucs on search result, remove all of it---------------------------------------------------------------------
 
    // const files = await File.find({});
    // let parentFolders = [];
    // files.forEach(async (file) => {
    //   const pFile = await Folder.findOne({ uuid: file.parentFolder });
    //   parentFolders.push(pFile);
    // });
    // const folders = await Folder.find({});
    // let counter = -1;
    // let hasAccessFiles = files.filter((file) => {
    //   counter = counter + 1;
    //   if (hasAccess(req.user, parentFolders[counter]) == "true") return true;
    // });
    // let hasAccessFolders = folders.filter((folder) => {
    //   if (hasAccess(req.user, folder) == "true") return true;
    // });

    //!-------------------------------------------------------------------------------


    if (hasAccess(req.user, folder) == "true") {
      //* find path loop below
      let tempf = folder;
      let path = "/";
      let pathUUID = [];
      while (tempf.parentFolder !== "root") {
        path = "/" + tempf.foldername + path;
        pathUUID.unshift(tempf.uuid);
        pFolder = await Folder.findOne({ uuid: tempf.parentFolder });
        tempf = pFolder;
      }

      res.render("files/files", {
        folders: subFolders,
        parentFolder: parentFolder,
        currentFolder: folder.uuid,
        files: subFiles,
        // hasAccessFolders: hasAccessFolders,
        // hasAccessFiles: hasAccessFiles,
        path: path,
        pathUUID: pathUUID,
      });
    } else res.redirect(`/files/${parentFolder}`);
  } catch {
    res.redirect("/files");
    //!go to 404 page instead which says folder not found or corrupted||||||||||||||||||||||||||||||||||||||||||||
  }
});

//* redirect directory/ to directoy/:rootUUID  | Basically always opens public folder from root
router.get("/", ensureAuthenticated, async (req, res) => {
  const folders = await Folder.find({ parentFolder: "root" });
  if(folders.length == 0) {
    res.redirect("/");
  }
  else {

    res.redirect(`/files/${folders[0].uuid}`);
  }
});

//* change default sortBy to name for uuid folder
//!-------------------------------------------change sort from folder.sortBy to user.sortBy---------------------------------------------//
router.get("/sort/name/:uuid", ensureAuthenticated, (req, res) => {
  // Folder.findOneAndUpdate(
  //   { uuid: req.params.uuid },
  //   { sortBy: "name" },
  //   async (err) => {
  //     if (err) res.json(err);
  //     else {
  //       res.redirect(`/directory/${req.params.uuid}`);
  //     }
  //   }
  // );
  User.findOneAndUpdate({ _id: req.user._id }, { sortBy: "name" }, (err) => {
    if (err) res.json(err);
    else {
      res.redirect(`/files/${req.params.uuid}`);
    }
  });
});

//* change default sortBy to size for uuid folder
router.get("/sort/size/:uuid", ensureAuthenticated, (req, res) => {
  // Folder.findOneAndUpdate(
  //   { uuid: req.params.uuid },
  //   { sortBy: "size" },
  //   async (err) => {
  //     if (err) res.json(err);
  //     else {
  //       res.redirect(`/directory/${req.params.uuid}`);
  //     }
  //   }
  // );
  User.findOneAndUpdate({ _id: req.user._id }, { sortBy: "size" }, (err) => {
    if (err) res.json(err);
    else {
      res.redirect(`/files/${req.params.uuid}`);
    }
  });
});

//* change default sortBy to date for uuid folder
router.get("/sort/date/:uuid", ensureAuthenticated, (req, res) => {
  // Folder.findOneAndUpdate(
  //   { uuid: req.params.uuid },
  //   { sortBy: "date" },
  //   async (err) => {
  //     if (err) res.json(err);
  //     else {
  //       res.redirect(`/directory/${req.params.uuid}`);
  //     }
  //   }
  // );
  User.findOneAndUpdate({ _id: req.user._id }, { sortBy: "date" }, (err) => {
    if (err) res.json(err);
    else {
      res.redirect(`/files/${req.params.uuid}`);
    }
  });
});

//* change default sortBy to type for uuid folder
router.get("/sort/type/:uuid", ensureAuthenticated, (req, res) => {
  // Folder.findOneAndUpdate(
  //   { uuid: req.params.uuid },
  //   { sortBy: "type" },
  //   async (err) => {
  //     if (err) res.json(err);
  //     else {
  //       res.redirect(`/directory/${req.params.uuid}`);
  //     }
  //   }
  // );
  User.findOneAndUpdate({ _id: req.user._id }, { sortBy: "type" }, (err) => {
    if (err) res.json(err);
    else {
      res.redirect(`/files/${req.params.uuid}`);
    }
  });
});

//* search route for all files and folder based on query regexp
router.get("/search/files", ensureAuthenticated, async (req, res) => {
  let searchOptionsFile = {};
  let searchOptionsFolder = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptionsFile.filename = new RegExp(req.query.name, "i");
    searchOptionsFolder.foldername = new RegExp(req.query.name, "i");
  }
  try {
    const files = await File.find(searchOptionsFile);
    let parentFolders = [];
    files.forEach(async (file) => {
      const pFile = await Folder.findOne({ uuid: file.parentFolder });
      parentFolders.push(pFile);
    });
    const folders = await Folder.find(searchOptionsFolder);
    let counter = -1;
    let hasAccessFiles = files.filter((file) => {
      counter = counter + 1;
      if (hasAccess(req.user, parentFolders[counter]) == "true") return true;
    });
    let hasAccessFolders = folders.filter((folder) => {
      if (hasAccess(req.user, folder) == "true") return true;
    });
    res.render("directory/search", {
      // folders: folders,
      // files: files,
      folders: hasAccessFolders,
      files: hasAccessFiles,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

//* create new folder inside uuid parentFolder
router.post("/:uuid/newFolder", ensureAuthenticated, async (req, res) => {
  //!----------------------------------------------------------
  //!validate folder name for present directory / parent folder
  //!----------------------------------------------------------

  //!----is hasAccess needed as accessing parentFolder means you have access to that folder already???????
  const parentFolder = await Folder.findOne({ uuid: req.params.uuid });
  if (!parentFolder.root) {
    const folder = new Folder({
      foldername: req.body.foldername,
      path: parentFolder.foldername + "/",
      uuid: uuidv4(),
      createdBy: req.user._id,
      owner: req.user.fullname,
      parentFolder: req.params.uuid,
      team: parentFolder.team,
    });
    //!wrap in try catch for error handling
    const response = await folder.save();
    res.redirect(`/files/${req.params.uuid}`);
  } else res.redirect(`/files/${req.params.uuid}`);
});

//* update folder name
router.post("/update/:uuid", ensureAuthenticated, async (req, res) => {
  const folder = await Folder.findOne({ uuid: req.params.uuid });
  const parentFolder = await Folder.findOne({ uuid: folder.parentFolder });
  if (
    !folder.root &&
    !parentFolder.root &&
    hasRights(req.user, folder, false) == "true"
  ) {
    folder.foldername = req.body.foldername;
    folder.save();
    res.redirect(`/files/${folder.parentFolder}`);
  } else {
    res.redirect(`/files/${folder.parentFolder}`);
  }
});

//?---------------------------------------------------------------------------
//files addition
//?---------------------------------------------------------------------------

//* how and where files are stored in local system.
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const temp = new Date();
    const fname = file.originalname.split(path.extname(file.originalname));
    const uniqueName = `${fname[0]}-${temp.getDate()}${
      temp.getMonth() + 1
    }${temp.getFullYear()}-${temp.getHours()}${temp.getMinutes() + 1}${
      temp.getSeconds() + 1
    }${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

//* single file upload function
let upload = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },
}).single("singleFile"); //100mb

//* handle single file upload
router.post("/:uuid/newFile", ensureAuthenticated, async (req, res) => {
  const folder = await Folder.findOne({ uuid: req.params.uuid });
  const parentFolder = await Folder.findOne({ uuid: folder.parentFolder });
  //!----is hasAccess needed as accessing parentFolder means you have access to that folder already???????
  if (!folder.root) {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      const ogName = originalFilename(req.file.filename);
      const file = new File({
        filename: req.file.filename,
        originalname: ogName,
        uuid: uuidv4(),
        path: req.file.path,
        type: req.file.filename.split(".").pop(),
        size: req.file.size,
        uploader: req.user._id,
        owner: req.user.fullname,
        parentFolder: req.params.uuid,
      });

      const response = await file.save();
      //!should i add more?
      //?adding temp render
      res.redirect(`/files/${req.params.uuid}`);
      //!also need to add try catch for await?
    });
  } else res.redirect(`/files/${req.params.uuid}`);
});

//* multiple file upload function
let multUpload = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },
}).array("multFile");

//* handle multiple file upload
router.post("/:uuid/newFiles", ensureAuthenticated, async (req, res) => {
  const folder = await Folder.findOne({ uuid: req.params.uuid });
  const parentFolder = await Folder.findOne({ uuid: folder.parentFolder });
  //!----is hasAccess needed as accessing parentFolder means you have access to that folder already???????
  if (!folder.root) {
    multUpload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      
      req.files.forEach(async (file) => {
        const ogName = originalFilename(file.filename);
        const mfile = new File({
          filename: file.filename,
          originalname: ogName,
          uuid: uuidv4(),
          path: file.path,
          type: file.filename.split(".").pop(),
          size: file.size,
          uploader: req.user._id,
          owner: req.user.fullname,
          parentFolder: req.params.uuid,
        });

        const response = await mfile.save();
      });

      //!should i add more?
      //?adding temp render
      res.redirect(`/files/${req.params.uuid}`);
      //!also need to add try catch for await?
    });
  } else res.redirect(`/files/${req.params.uuid}`);
});

//* delete file route
router.get("/deleteFile/:uuid", ensureAuthenticated, async function (req, res) {
  //since we cant upload in team root: true, no need to check here
  const file = await File.findOne({ uuid: req.params.uuid });
  const parentFolder = await Folder.find({ uuid: file.parentFolder });
  const team = await Team.findOne({ teamname: parentFolder.team });
  if (hasRightsFile(req.user, file, team) == "true") {
    // fs.unlink(`${__dirname}/../../${file.path}`, (err) => {
    fs.unlink(`${__dirname}/../${file.path}`, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send({ error: "Not deleted from local storage." });
      }
    });
    File.deleteOne({ uuid: req.params.uuid }, function (err) {
      if (err) res.json(err);
      else res.redirect(`/files/${file.parentFolder}`);
    });
  } else res.redirect(`/files/${file.parentFolder}`);
});

//* download file route
router.get("/downloadFile/:uuid", ensureAuthenticated, async (req, res) => {
  //since we cant upload in team root: true, no need to check here
  const file = await File.findOne({ uuid: req.params.uuid });
  const parentFolder = await Folder.findOne({ uuid: file.parentFolder });
  if (hasAccess(req.user, parentFolder) == "true") {
    if (!file) {
      //  return res.render('', { error: 'Link has been expired.'});
      return res.status(500).send({ error: "Error in link." });
    }
    // const filePath = `${__dirname}/../../${file.path}`;
    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath, file.originalname);
  } else {
    res.redirect("/files");
  }
});

//? cut, copy, paste folder and file

//* copy file
router.get("/copyFile/:uuid", ensureAuthenticated, async (req, res) => {
  //since we cant upload in team root: true, no need to check here
  //!----is hasAccess needed as accessing parentFolder means you have access to that folder already??
  if (req.user.copiedUUID !== req.params.uuid) {
    User.findOneAndUpdate(
      { _id: req.user._id },
      { copiedUUID: req.params.uuid, copyCutFlag: "copy" },
      (err) => {
        if (err) res.json(err);
        else res.status(200);
        //!----------------------------use something else to settle res.status, theres a weird link on bottm of browser...---------------
      }
    );
  }
});
//* cut file
router.get("/cutFile/:uuid", ensureAuthenticated, async (req, res) => {
  //since we cant upload in team root: true, no need to check here
  const file = await File.findOne({ uuid: req.params.uuid });
  const parentFolder = await Folder.find({ uuid: file.parentFolder });
  const team = await Team.findOne({ teamname: parentFolder.team });
  if (hasRightsFile(req.user, file, team) == "true") {
    if (req.user.copiedUUID !== req.params.uuid) {
      User.findOneAndUpdate(
        { _id: req.user._id },
        { copiedUUID: req.params.uuid, copyCutFlag: "cut" },
        (err) => {
          if (err) res.json(err);
          else res.status(200);
        }
      );
    }
  }
});
//* copy folder
router.get("/copy/:uuid", ensureAuthenticated, async (req, res) => {
  const folder = await Folder.findOne({ uuid: req.params.uuid });
  const parentFolder = await Folder.findOne({ uuid: folder.parentFolder });
  //! can club all if together using &&
  if (hasAccess(req.user, folder) == "true") {
    if (!folder.root && !parentFolder.root) {
      if (req.user.copiedUUID !== req.params.uuid) {
        User.findOneAndUpdate(
          { _id: req.user._id },
          { copiedUUID: req.params.uuid, copyCutFlag: "copy" },
          (err) => {
            if (err) res.json(err);
            else res.status(200);
          }
        );
      }
    }
  }
});
//* cut folder
router.get("/cut/:uuid", ensureAuthenticated, async (req, res) => {
  const folder = await Folder.findOne({ uuid: req.params.uuid });
  const parentFolder = await Folder.findOne({ uuid: folder.parentFolder });
  // const team = await Team.findOne({ teamname: folder.team });
  if (hasRights(req.user, folder, false) == "true") {
    if (!folder.root && !parentFolder.root) {
      if (req.user.copiedUUID !== req.params.uuid) {
        User.findOneAndUpdate(
          { _id: req.user._id },
          { copiedUUID: req.params.uuid, copyCutFlag: "cut" },
          (err) => {
            if (err) res.json(err);
            else res.status(200);
          }
        );
      }
    }
  }
});

//* paste
router.get("/paste/:uuid", ensureAuthenticated, async (req, res) => {
  //! handle case where cut folder and paste inside same folder...
  const file = await File.findOne({ uuid: req.user.copiedUUID });
  const folder = await Folder.findOne({ uuid: req.user.copiedUUID });
  const toFolder = await Folder.findOne({ uuid: req.params.uuid });

  if (hasAccess(req.user, toFolder) == "true" && !toFolder.root) {
    if (req.user.copyCutFlag === "cut") {
      if (file) {
        File.findOneAndUpdate(
          { uuid: req.user.copiedUUID },
          { parentFolder: req.params.uuid },
          (err) => {
            if (err) res.json(err);
            else {
              User.findOneAndUpdate(
                { _id: req.user._id },
                { copiedUUID: "", copyCutFlag: "" },
                (err) => {
                  if (err) res.json(err);
                }
              );
            }
          }
        );
        res.redirect(`/files/${req.params.uuid}`);
      }
      if (folder && (folder.uuid !== toFolder.uuid)) {
        //folder !== tofolder coz destination folder cant be a subfolder of the source folder
        Folder.findOneAndUpdate(
          { uuid: req.user.copiedUUID },
          { parentFolder: req.params.uuid },
          (err) => {
            if (err) res.json(err);
            else {
              User.findOneAndUpdate(
                { _id: req.user._id },
                { copiedUUID: "", copyCutFlag: "" },
                (err) => {
                  if (err) res.json(err);
                }
              );
            }
          }
        );
        res.redirect(`/files/${req.params.uuid}`);
      }
    } else if (req.user.copyCutFlag === "copy") {
      if (file) {
        // const filePath = `${__dirname}/../../${file.path}`;
        const filePath = `${__dirname}/../${file.path}`;
        const newFilename = newCopyFilename(file.filename);
        const newPath = "uploads/" + newFilename;
        const ogName = originalFilename(file.filename);
        const copyfile = new File({
          filename: newFilename,
          originalname: ogName,
          uuid: uuidv4(),
          path: newPath,
          size: file.size,
          type: newFilename.split(".").pop(),
          uploader: req.user._id,
          owner: req.user.fullname,
          parentFolder: req.params.uuid,
        });
        // const copyfilePath = `${__dirname}/../../${newPath}`;
        const copyfilePath = `${__dirname}/../${newPath}`;

        fs.copyFile(filePath, copyfilePath, (err) => {
          if (err) throw err;
          else {
            copyfile.save();
            User.findOneAndUpdate(
              { _id: req.user._id },
              { copiedUUID: "", copyCutFlag: "" },
              (err) => {
                if (err) res.json(err);
              }
            );
          }
        });
        res.redirect(`/files/${req.params.uuid}`);
      }
      if (folder && (folder.uuid !== toFolder.uuid)) {
        //folder !== tofolder coz destination folder cant be a subfolder of the source folder
        const parentFolder = await Folder.findOne({ uuid: req.params.uuid });
        const copyFolder = Folder({
          foldername: folder.foldername,
          path: parentFolder.foldername + "/",
          uuid: uuidv4(),
          createdBy: req.user._id,
          owner: req.user.owner,
          parentFolder: req.params.uuid,
          team: parentFolder.team,
        });
        copyFolder.save();
        copySub(folder, copyFolder, req.user);
        User.findOneAndUpdate(
          { _id: req.user._id },
          { copiedUUID: "", copyCutFlag: "" },
          (err) => {
            if (err) res.json(err);
          }
        );
        res.redirect(`/files/${req.params.uuid}`);
      }
    }
  }
});

//* function to recursively copy all folder and files inside
async function copySub(folder, copyFolder, user) {
  const files = await File.find({ parentFolder: folder.uuid });
  files.forEach((file) => {
    // const filePath = `${__dirname}/../../${file.path}`;
    const filePath = `${__dirname}/../${file.path}`;
    const newFilename = newCopyFilename(file.filename);
    const newPath = "uploads/" + newFilename;
    const ogName = originalFilename(file.filename);
    const copyfile = new File({
      filename: newFilename,
      originalname: ogName,
      uuid: uuidv4(),
      path: newPath,
      type: newFilename.split(".").pop(),
      size: file.size,
      uploader: user._id,
      owner: user.fullname,
      parentFolder: copyFolder.uuid,
    });
    // const copyfilePath = `${__dirname}/../../${newPath}`;
    const copyfilePath = `${__dirname}/../${newPath}`;

    fs.copyFile(filePath, copyfilePath, (err) => {
      if (err) throw err;
      else {
        copyfile.save();
      }
    });
  });
  const folders = await Folder.find({ parentFolder: folder.uuid });
  folders.forEach((subfolder) => {
    const copySubFolder = Folder({
      foldername: subfolder.foldername,
      path: copyFolder.foldername + "/",
      uuid: uuidv4(),
      createdBy: user._id,
      owner: user.fullname,
      parentFolder: copyFolder.uuid,
      team: copyFolder.team,
    });
    copySubFolder.save();
    copySub(subfolder, copySubFolder, user);
  });
}

//* function to remove details added by multer in filename to original and add new ones, for making new copies
function newCopyFilename(filename) {
  let temp = filename.split(".");
  const ext = temp.pop();
  temp = temp.join(".");
  temp = temp.split("-");
  temp.pop();
  temp.pop();
  temp = temp.join("-");
  // const newFilename = temp + "." + ext;
  const newFilename = [temp, ext];
  const t = new Date();
  const uniqueName = `${newFilename[0]}-${t.getDate()}${
    t.getMonth() + 1
  }${t.getFullYear()}-${t.getHours()}${t.getMinutes() + 1}${
    t.getSeconds() + 1
  }.${newFilename[1]}`;
  return uniqueName;
}
//* function to remove details added by multer in filename to original, for getting original name
function originalFilename(filename) {
  let temp = filename.split(".");
  const ext = temp.pop();
  temp = temp.join(".");
  temp = temp.split("-");
  temp.pop();
  temp.pop();
  temp = temp.join("-");
  const newFilename = temp + "." + ext;
  // const newFilename = [temp, ext];
  return newFilename;
}


//not used
router.get("/root/updateRoot", async (req, res) => {
  const folders = await Folder.find({ parentFolder: "root" });
  // res.redirect(`/directory/${folders[0].uuid}`);
  folders[0].root = true;
  folders[0].save();
  res.json("success");
});
//<form action="/directory/root/updateTeam" method="post">
//      <input type="text" name="team" />
//      <button type="submit">Update team of root</button>
//    </form>
//-------------root-------------
//<a href="/directory/root/updateRoot">Update Root</a>







module.exports = router;

//!!-----------------folder upload not added-------------------------

// !!----------------- folder download not added---------------------

