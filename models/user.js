
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: String,
  spam: {
    type: Object,
    default: {},
  },
});

module.exports = mongoose.model("User", userSchema, "users");
