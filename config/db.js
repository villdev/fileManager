require("dotenv").config();
const mongoose = require("mongoose");

//connect to mongodb
function connectDB() {
  const mongoose = require("mongoose");
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, //coz of -> DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
    useFindAndModify: false,
  });
  const db = mongoose.connection;
  db.on("error", (error) => console.error(error));
  db.on("open", () => console.log("Connected to mongodb"));
}

module.exports = connectDB;
