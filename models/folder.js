const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const folderSchema = new Schema(
  {
    foldername: { type: String, required: true },
    path: { type: String, required: true },
    uuid: { type: String, required: true },
    createdBy: { type: String, required: true }, 
    owner: { type: String, required: true },
    parentFolder: { type: String, required: true },
    team: { type: String, required: true },
    root: { type: Boolean, required: false },
    // sortBy: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Folder", folderSchema);
