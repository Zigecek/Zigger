var config = require("../config");
const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  annouce: {
    default: 1,
    type: Number,
  },
  blacklist: {
    default: [],
    type: Array,
  },
  cooldowns: {
    default: {
      calladmin: new Date(),
      clear: new Date(),
      dev: new Date(),
      disconnect: new Date(),
      eval: new Date(),
      help: new Date(),
      join: new Date(),
      loop: new Date(),
      nowplaying: new Date(),
      other: new Date(),
      pause: new Date(),
      ping: new Date(),
      play: new Date(),
      prefix: new Date(),
      queue: new Date(),
      queueloop: new Date(),
      remove: new Date(),
      resume: new Date(),
      search: new Date(),
      shuffle: new Date(),
      skip: new Date(),
      stop: new Date(),
      test: new Date(),
      volume: new Date(),
    },
    type: Object,
  },
  guildID: String,
  guildName: String,
  musicBotDefaultVolume: {
    default: 80,
    type: Number,
  },
  musicBotLastUUID: {
    default: null,
    type: String,
  },
  musicBotLoop: {
    default: false,
    type: Boolean,
  },
  musicBotPaused: {
    default: false,
    type: Boolean,
  },
  musicBotPauseElapsed: {
    default: 0,
    type: Number,
  },
  musicBotPlaying: {
    default: false,
    type: Boolean,
  },
  musicBotPlayTime: {
    default: new Date(),
    type: Date,
  },
  musicBotQueueLoop: {
    default: false,
    type: Boolean,
  },
  musicBotTxtChannelID: {
    default: null,
    type: String,
  },
  musicBotVolume: {
    default: 80,
    type: Number,
  },
  plus: {
    default: false,
    type: Boolean,
  },
  prefix: {
    default: config.DefaultPrefix,
    type: String,
  },
});

module.exports = mongoose.model("Guild", guildSchema, "guilds");
