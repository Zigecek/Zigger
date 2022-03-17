
var config = require("../config");
const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  annouce: {
    default: 1,
    type: Number,
  },
  autoroleEnabled: {
    default: true,
    type: Boolean,
  },
  autoRoleID: {
    default: null,
    type: String,
  },
  autoRoleIDs: {
    default: [],
    type: Array,
  },
  blacklist: {
    default: [],
    type: Array,
  },
  byeChannelID: {
    default: null,
    type: String,
  },
  cooldowns: {
    default: {
      autorole: new Date(),
      calladmin: new Date(),
      clear: new Date(),
      counters: new Date(),
      dev: new Date(),
      disconnect: new Date(),
      eval: new Date(),
      help: new Date(),
      howgay: new Date(),
      channel: new Date(),
      invite: new Date(),
      join: new Date(),
      language: new Date(),
      loop: new Date(),
      meme: new Date(),
      nowplaying: new Date(),
      other: new Date(),
      pause: new Date(),
      penis: new Date(),
      ping: new Date(),
      play: new Date(),
      porn: new Date(),
      prefix: new Date(),
      queue: new Date(),
      queueloop: new Date(),
      reactionroles: new Date(),
      remove: new Date(),
      resume: new Date(),
      search: new Date(),
      shuffle: new Date(),
      skip: new Date(),
      stop: new Date(),
      tempchannel: new Date(),
      test: new Date(),
      twitch: new Date(),
      volume: new Date(),
    },
    type: Object,
  },
  counters: {
    default: [],
    type: Array,
  },
  countersCategoryChannelID: {
    default: null,
    type: String,
  },
  countersSetupDone: {
    default: false,
    type: Boolean,
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
  rrMessages: {
    default: [],
    type: Array,
  },
  spam: {
    default: [],
    type: Array,
  },
  spamDelay: {
    default: 2000,
    type: Number,
  },
  spamEnabled: {
    default: false,
    type: Boolean,
  },
  spamIgnoreAdmins: {
    default: true,
    type: Boolean,
  },
  spamMuteRoleID: {
    default: null,
    type: String,
  },
  stream: {
    default: null,
    type: Boolean,
  },
  streamMessageChannelID: {
    default: null,
    type: String,
  },
  streamMessageID: {
    default: null,
    type: String,
  },
  streamNotifyChannelID: {
    default: null,
    type: String,
  },
  streamUserID: {
    default: null,
    type: String,
  },
  streamUserName: {
    default: null,
    type: String,
  },
  tc: {
    default: [],
    type: Array,
  },
  tcCategoryID: {
    default: null,
    type: String,
  },
  welChannelID: {
    default: null,
    type: String,
  },
});

module.exports = mongoose.model("Guild", guildSchema, "guilds");
