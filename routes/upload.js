const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");
const { ensureAuthenticated } = require("../config/auth");

//common
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    // const uniqueName = `${Date.now()}-${Math.round(
    //   Math.random() * 1e9
    // )}${path.extname(file.originalname)}`;
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

// easy example
//------------------------------------------------------
// var storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, '/path/to/uploads')
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + '-' + Date.now())
//   }
// });
//------------------------------------------------------

//single upload
let upload = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },
}).single("singleFile"); //100mb

//load upload buttons
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("files/upload");
});

//handle single file upload
router.post("/file", ensureAuthenticated, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
      uploader: req.user.fullname,
    });

    const response = await file.save();
    //!should i add more?
    //?adding temp render
    res.render("files/upload");
    //!also need to add try catch for await?
  });
});

//multiple file upload
let multUpload = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },
}).array("multFile");

//handle multiple file upload
router.post("/files", ensureAuthenticated, (req, res) => {
  multUpload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    req.files.forEach(async (file) => {
      const mfile = new File({
        filename: file.filename,
        uuid: uuidv4(),
        path: file.path,
        size: file.size,
        uploader: req.user.fullname,
      });

      const response = await mfile.save();
    });

    //!should i add more?
    //?adding temp render
    res.render("files/upload");
    //!also need to add try catch for await?
  });
});

//handle folder upload
router.post("/folder", ensureAuthenticated, (req, res) => {
  multUpload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    //!--------------------------------------------------------------------------------------------------------------
    //!no idea how to handle recursive files ie files in folders inside specified folder. all added in one go instead
    //!--------------------------------------------------------------------------------------------------------------
    req.files.forEach(async (file) => {
      const mfile = new File({
        filename: file.filename,
        uuid: uuidv4(),
        path: file.path,
        size: file.size,
        uploader: req.user.fullname,
      });

      const response = await mfile.save();
    });

    //!should i add more?
    //?adding temp render
    res.render("files/upload");
    //!also need to add try catch for await?
  });
});

module.exports = router;
