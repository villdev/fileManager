const mongoose = require("mongoose");
const { use } = require("../routes/signin");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    // uuid: { type: String, required: true },
    createdAt: {
      type: Date,
      required: false,
    },
    updatedAt: {
      type: Number,
      required: false,
    },
    copiedUUID: {
      type: String,
      required: false,
    },
    copyCutFlag: {
      type: String,
      required: false,
    },
    role: {
      type: Array,
      required: false,
    },
    sortBy: { type: String, required: false },
  },
  { runSettersOnQuery: true, timestamps: true }
  //!use "timestamps: true" to do the createdat and updatedat values automatically instead of using .pre
);

userSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase(); // ensure email are in lowercase

  // var currentDate = new Date().getTime();
  // this.updatedAt = currentDate;
  // if (!this.createdAt) {
  //   this.createdAt = currentDate;
  // }
  next();
});

module.exports = mongoose.model("User", userSchema);
