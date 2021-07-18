const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    teamname: { type: String, required: true },
    manager: { type: String, required: true },
    managerName: { type: String, required: true },
    parentFolder: { type: String, required: true },
    count: { type: Number, required: true },
    // members: { type: String, required: true },
    // uuid: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
