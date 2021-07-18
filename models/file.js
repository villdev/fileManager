const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    path: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
    uploader: { type: String, required: false }, 
    owner: { type: String, required: true },
    parentFolder: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
