
const mongoose = require("mongoose");

const configSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  botAdminDiscordID: {
    deafult: [],
    type: Array
  },
  number: {
    default: 1,
    type: Number
  },
  PCfeedback: {
    default: 0,
    type: Number
  },
  pin: {
    default: null,
    type: Number
  },
  SteambotLogged: {
    default: null,
    type: Boolean
  },
  SteambotWhoWhenPlaying: {
    default: null,
    type: String
  }
});

module.exports = mongoose.model("Config", configSchema, "config");
