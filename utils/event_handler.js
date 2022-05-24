const { bot } = require("../bot");
const fs = require("fs");

var files = {};
const eventList = [
  "applicationCommandCreate",
  "applicationCommandDelete",
  "applicationCommandUpdate",
  "debug",
  "emojiCreate",
  "emojiDelete",
  "emojiUpdate",
  "error",
  "guildBanAdd",
  "guildBanRemove",
  "guildCreate",
  "guildDelete",
  "guildIntegrationsUpdate",
  "guildMemberAdd",
  "guildMemberAvailable",
  "guildMemberRemove",
  "guildMembersChunk",
  "guildMemberUpdate",
  "guildUnavailable",
  "guildUpdate",
  "channelCreate",
  "channelDelete",
  "channelPinsUpdate",
  "channelUpdate",
  "interactionCreate",
  "invalidated",
  "invalidRequestWarning",
  "inviteCreate",
  "inviteDelete",
  "messageCreate",
  "messageDelete",
  "messageDeleteBulk",
  "messageReactionAdd",
  "messageReactionRemove",
  "messageReactionRemoveAll",
  "messageReactionRemoveEmoji",
  "messageUpdate",
  "presenceUpdate",
  "rateLimit",
  "ready",
  "roleCreate",
  "roleDelete",
  "roleUpdate",
  "shardDisconnect",
  "shardError",
  "shardReady",
  "shardReconnecting",
  "shardResume",
  "stageInstanceCreate",
  "stageInstanceDelete",
  "stageInstanceUpdate",
  "stickerCreate",
  "stickerDelete",
  "stickerUpdate",
  "threadCreate",
  "threadDelete",
  "threadListSync",
  "threadMembersUpdate",
  "threadMemberUpdate",
  "threadUpdate",
  "typingStart",
  "userUpdate",
  "voiceStateUpdate",
  "warn",
  "webhookUpdate",
];

// eventList = array of all event names (strings)

var other = ["../bot.js", "../music/music.js"];
var filter = ["event_handler.js"];

var utilFiles = fs
  .readdirSync("./utils")
  .filter((file) => file.endsWith(".js") && !filter.includes(file));
utilFiles = utilFiles.map((s) => `./${s}`);
const store = (file) => {
  // u - file
  // p - name of an event in the file
  var u = require(file);
  if (!u.events) return;
  var propertyList = Object.keys(u.events);
  propertyList.forEach((p) => {
    if (eventList.includes(p)) {
      if (!files[p]) files[p] = [];
      files[p].push(u);
    }
  });
};

utilFiles.forEach(store);
other.forEach(store);

Object.keys(files).forEach((p) => {
  bot.on(p, (...args) => {
    files[p].forEach((u) => {
      u.events[p](...args);
    });
  });
});
